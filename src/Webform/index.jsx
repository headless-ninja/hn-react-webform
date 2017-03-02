import React from 'react';
import getNested from 'get-nested';
import fetch from 'fetch-everywhere';
import{ observer } from 'mobx-react';
import CSSModules from 'react-css-modules';
import FormStore from './FormStore';
import SubmitButton from '../SubmitButton';
import WebformElement from '../WebformElement';
import rules from './rules';
import styles from './styles.scss';

@CSSModules(styles, { allowMultiple: true })
@observer
class Webform extends React.Component {
  static propTypes = {
    form: React.PropTypes.shape({
      form_id: React.PropTypes.string.isRequired,
      settings: React.PropTypes.object,
      elements: React.PropTypes.arrayOf(React.PropTypes.shape({
        '#type': React.PropTypes.string.isRequired,
      })).isRequired,
      token: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.formStore = new FormStore();

    this.components = [];

    this.state = {
      hasErrors: false,
      errors: [],
    };
  }

  componentDidMount() {
    this.validateState();
  }

  onSubmit(e) {
    e.preventDefault();
    const isValid = this.validate();
    if(isValid) {
      this.updateSubmission();
    }
  }

  getFormElements() {
    const formElements = getNested(() => this.props.form.elements, []);
    return formElements.map((field) => {
     return <WebformElement
        key={field['#webform_key']}
        field={field}
        formStore={this.formStore}
      />});
  }

  hasErrors() {
    Object.keys(this.components).reduce((prev, name) => {
      const component = this.components[name];
      const validations = component.props.validations;
      const length = validations.length;

      for(let i = 0; i < length; i += 1) {
        if(!rules[validations[i]].rule(component.state.value, this.components)) {
          prev[name] = prev[name] || [];
          prev[name].push(validations[i]);
        }
      }

      return prev;
    }, {});
  }

  validateState() {
    const hasErrors = this.hasErrors();
    this.setState({ hasErrors });
  }

  updateSubmission(draft = false) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.props.form.token,
    });
    const values = {};
    this.formStore.fields.forEach((field) => {
      values[field.id] = field.value;
    });
    fetch('/api/form', {
      headers,
      method: 'POST',
      body: JSON.stringify(Object.assign({
        form_id: this.props.form.form_id,
        in_draft: draft,
      }, values)),
    })
      .then(response => response.json())
      .then((response) => {
        console.log('response', response);
      });
  }

  render() {
    const formElements = this.getFormElements();
    return (
      <div>
        <form ref="formElement" method="POST" onSubmit={this.onSubmit}>
          {formElements}
          <SubmitButton
            form={this.props.form}
            formElement={getNested(() => this.refs.formElement)}
          />
        </form>
      </div>
    );
  }
}

export default Webform;

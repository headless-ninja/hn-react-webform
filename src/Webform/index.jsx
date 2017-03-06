import React from 'react';
import getNested from 'get-nested';
import fetch from 'fetch-everywhere';
import{ observer } from 'mobx-react';
import CSSModules from 'react-css-modules';
import FormStore from './FormStore';
import SubmitButton from '../SubmitButton';
import WebformElement from '../WebformElement';
import styles from './styles.css';

@CSSModules(styles, { allowMultiple: true })
@observer
class Webform extends React.Component {
  static propTypes = {
    settings: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
    }).isRequired,
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
    return formElements.map(field =>
      <WebformElement
        key={field['#webform_key']}
        field={field}
        formStore={this.formStore}
      />);
  }

  hasErrors() {
    this.components.reduce((prev, component) => component.hasErrors() || prev, false);
  }

  validateState() {
    return this.hasErrors();
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
    const hasErrors = this.validateState();
    return (
      <div>
        <h1 styleName="formtitle" >{getNested(() => this.props.settings.title)}</h1>
        <form method='POST' onSubmit={this.onSubmit}>
          {formElements}

          <SubmitButton
            form={this.props.form}
          />
        </form>
      </div>
    );
  }
}

export default Webform;

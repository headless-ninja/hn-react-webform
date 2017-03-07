import React from 'react';
import getNested from 'get-nested';
import fetch from 'fetch-everywhere';
import { observer } from 'mobx-react';
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

    this.components = {}; // Will be filled by each individual element

    this.state = {
      hasErrors: false,
      errors: [],
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    const isValid = this.isValid();
    if(isValid) {
      return this.updateSubmission();
    }

    return console.warn('One or more fields are invalid...');
  }

  getFormElements() {
    const formElements = getNested(() => this.props.form.elements, []);
    return formElements.map(field =>
      <WebformElement
        key={field['#webform_key']}
        field={field}
        formStore={this.formStore}
        webform={this}
        ref={(component) => {
          if(component) {
            this.components[component.key] = component;
          }
        }}
      />);
  }

  isValid() {
    console.log(this.components);
    return Object.keys(this.components).reduce((prev, componentKey) => {
      const component = this.components[componentKey];
      component.validate();
      return prev && component.getValue('valid');
    }, true);
  }

  updateSubmission(draft = false) {
    return console.info('Simulate form sending...');
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
        <h1 styleName='formtitle'>{getNested(() => this.props.settings.title)}</h1>
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

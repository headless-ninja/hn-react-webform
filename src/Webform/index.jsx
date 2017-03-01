import React from 'react';
import Validation from 'react-validation';
import getNested from 'get-nested';
import fetch from 'fetch-everywhere';
import { observer } from 'mobx-react';
import FormStore from './formStore';
import { entries } from '../utils';
import SubmitButton from '../SubmitButton';
import FormElementComponent from '../WebformElement';

@observer
class FormComponent extends React.Component {
  constructor(props) {
    super(props);
    this.store = new FormStore();
    this.state = {
      value: 'Default',
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  getFormElements() {
    const formElements = getNested(() => this.props.form.elements);
    const form = [];
    if (formElements) {
      for (const [elementKey, element] of entries(formElements)) {
        form.push(<FormElementComponent
          key={elementKey}
          name={elementKey}
          props={element}
          store={this.store}
        />);
      }
    }
    return form;
  }

  onSubmit(e) {
    e.preventDefault();
    const isValid = this.validate();
    if (isValid) {
      this.updateSubmission(false);
    }
  }

  validate() {
    if (this.refs.formElement) {
      const errors = this.refs.formElement.validateAll();
      this.refs.formElement.validateState();
      return Object.keys(errors).length === 0;
    }
    return false;
  }

  updateSubmission(draft = true) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.props.form.token,
    });
    const values = {};
    this.store.fields.forEach(field => values[field.id] = field.value);
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
    const form = this.getFormElements();
    console.log(form);
    return (
      <div>
        {form &&
        <Validation.components.Form ref="formElement" method="POST" onSubmit={this.onSubmit}>
          {form}
          <SubmitButton form={this.props.form} formElement={getNested(() => this.refs.formElement)} />
        </Validation.components.Form>
        }
      </div>
    );
  }
}
export default FormComponent;

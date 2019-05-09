import React, { Component } from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { get } from 'mobx';
import { observer } from 'mobx-react';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';
import composeLookUp from '../LookUp';
import WebformUtils from '../WebformUtils';
import FormStore from '../Observables/Form';
// styled
import Email from './styled/email';

@observer
class EmailField extends Component {
  static meta = {
    validations: [
      el => `email_${el.key}`,
      el => `email_neverbounce_${el.key}`,
    ],
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#emailError': PropTypes.string,
      '#neverBounceEmail': PropTypes.string,
    }).isRequired,
    getField: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    settings: PropTypes.shape().isRequired,
    url: PropTypes.string.isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    registerLookUp: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.lookUpFields = {
      email: {
        elementKey: 'email',
        formKey: props.field['#webform_key'],
        triggerLookUp: true,
        apiValue: () => false,
        required: true,
      },
    };
    this.lookUpBase = `${props.url}/neverbounce/validate-single?_format=json`;

    const lookUpKey = this.getLookUpKey(props);
    const field = props.formStore.getField(props.field['#webform_key']);

    rules.set(`email_${props.field['#webform_key']}`, {
      rule: () => field.isEmpty || validator.isEmail(field.value),
      hint: value =>
        <RuleHint key={`email_${props.field['#webform_key']}`} hint={WebformUtils.getCustomValue(props.field, 'emailError', props.settings) || WebformUtils.getErrorMessage(field.element, '#required_error') || 'Please enter a valid email.'} tokens={{ value }} />,
      shouldValidate: () => field.isBlurred && !field.isEmpty,
    });
    rules.set(`email_neverbounce_${props.field['#webform_key']}`, {
      rule: () => {
        const lookUp = get(field.lookUps, lookUpKey);
        return field.isEmpty || !lookUp || lookUp.lookUpSuccessful;
      },
      hint: () =>
        <RuleHint key={`email_neverbounce_${props.field['#webform_key']}`} hint={WebformUtils.getCustomValue(props.field, 'neverBounceError', props.settings) || WebformUtils.getErrorMessage(field.element, '#required_error') || 'Please enter a valid email.'} />,
      shouldValidate: () => field.isBlurred && !field.isEmpty && validator.isEmail(field.value),
    });


    props.registerLookUp(lookUpKey, this.lookUpFields);
  }

  getLookUpKey(props) {
    return `${(props || this.props).field['#webform_key']}-email`;
  }

  prepareLookUp(fields) {
    const emailField = this.props.getField('email');

    if(
      !fields.email ||
      !emailField.field ||
      WebformUtils.isEmpty(emailField.field.props, fields.email) ||
      !validator.isEmail(fields.email)
    ) {
      return false;
    }

    const query = `&email=${fields.email}`;

    return {
      query,
      checkResponse: json => (json.success ? json : false),
      isSuccessful: response => response.result !== 1,
    };
  }

  render() {
    return (
      <Email
        {...this.props}
        type='email'
        autoComplete='email'
      />
    );
  }
}

export default composeLookUp(EmailField);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isValidIBAN } from 'ibantools';
import { observer } from 'mobx-react';
import Input from '../Input';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';
import WebformUtils from '../WebformUtils';

@observer
class IBAN extends Component {
  static meta = {
    validations: [el => `iban_${el.key}`],
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#ibanError': PropTypes.string,
    }).isRequired,
    settings: PropTypes.shape().isRequired,
  };

  static rewriteValue(value) {
    return (value || '').replace(/\s/g, '').toUpperCase();
  }

  constructor(props) {
    super(props);

    rules.delete(`pattern_${props.field['#webform_key']}`); // IBAN has own validation, pattern is only used in back end.

    rules.set(`iban_${props.field['#webform_key']}`, {
      rule: value => isValidIBAN(value),
      hint: () =>
        <RuleHint key={`iban_${props.field['#webform_key']}`} hint={WebformUtils.getCustomValue(props.field, 'ibanError', props.settings) || WebformUtils.getErrorMessage(props.field, '#required_error') || 'Please enter a valid IBAN.'} />,
      shouldValidate: field => field.isBlurred,
    });
  }

  render() {
    return (
      <Input
        {...this.props}
        autoComplete='iban'
      />
    );
  }
}

export default IBAN;

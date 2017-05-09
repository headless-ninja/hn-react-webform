import React, { Component } from 'react';
import PropTypes from 'prop-types';
import iban from 'ibantools';
import Input from '../Input';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';
import WebformElement from '../WebformElement';

class IBAN extends Component {
  static meta = {
    validations: [el => rules[`iban_${el.key}`]],
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#ibanError': PropTypes.string,
    }).isRequired,
    settings: PropTypes.shape().isRequired,
  };

  constructor(props) {
    super(props);

    delete rules[`pattern_${props.field['#webform_key']}`]; // IBAN has own validation, pattern is only used in back end.

    Object.assign(rules, {
      [`iban_${props.field['#webform_key']}`]: {
        rule: value => iban.isValidIBAN(value),
        hint: () =>
          <RuleHint key={`iban_${props.field['#webform_key']}`} hint={WebformElement.getCustomValue(props.field, 'ibanError', props.settings) || 'Please enter a valid IBAN.'} />,
        shouldValidate: field => field.isBlurred,
      },
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

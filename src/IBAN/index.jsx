import React, { Component } from 'react';
import PropTypes from 'prop-types';
import iban from 'ibantools';
import { observer } from 'mobx-react';
import { site } from 'hn-react';
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

  constructor(props) {
    super(props);

    rules.delete(`pattern_${props.field['#webform_key']}`); // IBAN has own validation, pattern is only used in back end.

    rules.set(`iban_${props.field['#webform_key']}`, {
      rule: value => iban.isValidIBAN(value),
      hint: () =>
        <RuleHint key={`iban_${props.field['#webform_key']}`} hint={WebformUtils.getCustomValue(props.field, 'ibanError', props.settings) || site.t('Please enter a valid IBAN.')} />,
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

import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import validator from 'validator';
import styles from './styles.pcss';
import Input from '../Input';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';

@CSSModules(styles)
class EmailField extends Component {
  static meta = {
    validations: [el => rules[`email_${el.key}`]],
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#emailError': PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    Object.assign(rules, {
      [`email_${props.field['#webform_key']}`]: {
        rule: value => validator.isEmail(value) || value.toString().trim() === '',
        hint: value =>
          <RuleHint key={`email_${props.field['#webform_key']}`} hint={props.field['#emailError'] || '":value" isn\'t an Email.'} tokens={{ value }} />,
        shouldValidate: field => field.isBlurred && field.getValue().toString().trim() !== '',
      },
    });
  }

  render() {
    return (
      <Input
        {...this.props}
        type='email'
        styleName='email'
        autoComplete='email'
      />
    );
  }
}

export default EmailField;

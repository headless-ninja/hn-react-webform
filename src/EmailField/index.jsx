import React from 'react';
import CSSModules from 'react-css-modules';
import validator from 'validator';
import styles from './styles.pcss';
import Input from '../Input';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';

@CSSModules(styles)
class EmailField extends React.Component {
  static meta = {
    validations: [el => rules[`email_${el.key}`]],
  };

  static propTypes = {
    field: React.PropTypes.shape({
      '#webform_key': React.PropTypes.string.isRequired,
      '#emailError': React.PropTypes.string,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    Object.assign(rules, {
      [`email_${props.field['#webform_key']}`]: {
        rule: value => validator.isEmail(value),
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
      />
    );
  }
}

export default EmailField;

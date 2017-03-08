import React from 'react';
import CSSModules from 'react-css-modules';
import validator from 'validator';
import styles from './styles.css';
import Input from '../Input';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';

@CSSModules(styles)
class EmailField extends React.Component {
  constructor(props) {
    super(props);

    Object.assign(rules, {
      email: {
        rule: value => validator.isEmail(value),
        hint: value => <RuleHint key={`email_${this.key}`} hint={props.field['#validationError'] || '":value" isn\'t an Email.'} tokens={{ value }} />,
      },
    });
  }

  componentDidMount() {
    this.props.webformElement.setState({
      validations: [
        ...this.props.webformElement.state.validations,
        rules.email,
      ],
    });
  }

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.props.onChange}
        type='email'
        styleName='email'
      />
    );
  }
}

export default EmailField;

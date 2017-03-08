import React from 'react';
import CSSModules from 'react-css-modules';
import validator from 'validator';
import getNested from 'get-nested';
import styles from './styles.css';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';

@CSSModules(styles)
class Input extends React.Component {
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
    if(getNested(() => this.props.field['#type']) === 'email') {
      this.props.webformElement.setState({
        validations: [
          ...this.props.webformElement.state.validations,
          rules.email,
        ],
      });
    }
  }

  render() {
    return (
      <input
        type={this.props.type}
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        placeholder={this.props.field['#placeholder']}
        styleName={`input`}
      />
    );
  }
}

export default Input;

import React from 'react';
import validator from 'validator';
import rules from '../Webform/rules';

class EmailFormComponent extends React.Component {
  constructor(props) {
    super(props);

    rules = Object.assign(rules, {
      email: {
        rule: value => validator.isEmail(value),
        hint: value => <span className='form-error is-visible'>{value} isn&sbquo;t an Email.</span>,
      },
    });
  }

  render() {
    return (
      <input
        type='email'
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
      />
    );
  }
}

export default EmailFormComponent;

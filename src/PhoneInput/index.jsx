import React from 'react';
import Validation from 'react-validation';
import validator from 'validator';
import InputMask from 'react-input-mask';

Validation.rules = Object.assign(Validation.rules, {
  phone: {
    // Example usage with external 'validator'
    rule: value => validator.isMobilePhone(value),
    hint: value => <span className="form-error is-visible">{value} isn't a Phone.</span>,
  },
});

/**
 * Create an masked input with <InputMask/>
 * @source https://github.com/sanniassin/react-input-mask
 */

class PhoneFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mask: props.field['#mask'],
    };
  }

  render() {
    return (
      <InputMask
        onChange={this.props.onChange}
        value={this.props.value}
        type='text'
        name={this.props.key}
        mask={this.state.mask.pattern}
        alwaysShowMask={this.state.mask.always_visible}
      />
    );
  }
}

export default PhoneFormComponent;

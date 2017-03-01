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
      value: props.props['#default_value'] || '',
      mask: props.props['#mask'],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.state.value) {
      // this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <InputMask
        onChange={this.props.onChange}
        value={this.state.value}
        type="text"
        name={this.props.name}
        mask={this.state.mask.pattern}
        alwaysShowMask={this.state.mask.always_visible}
      />
    );
  }
}

export default PhoneFormComponent;

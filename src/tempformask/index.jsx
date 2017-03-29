import React from 'react';
import validator from 'validator';
import InputMask from 'react-input-mask';
import rules from '../Webform/rules';

Object.assign(rules, {
  phone: {
    // Example usage with external 'validator'
    rule: value => validator.isMobilePhone(value),
    hint: value => <span className='form-error is-visible'>{value} isn&lsquot;t a Phone.</span>,
  },
});

/**
 * Create an masked input with <InputMask/>
 * @source https://github.com/sanniassin/react-input-mask
 */

class Phone extends React.Component {
  static propTypes = {
    field: React.PropTypes.shape({
      '#webform_key': React.PropTypes.string.isRequired,
      '#mask': React.PropTypes.bool,
    }).isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.boolean,
    ]),
    onChange: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

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
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        mask={this.state.mask.pattern}
        alwaysShowMask={this.state.mask.always_visible}
      />
    );
  }
}

export default Phone;

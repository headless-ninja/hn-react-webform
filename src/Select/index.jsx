import React from 'react';
import Validation from 'react-validation';
import validator from 'validator';
import Select from 'react-select';
import getNested from 'get-nested';
import { entries } from '../utils';

Validation.rules = Object.assign(Validation.rules, {
  phone: {
    // Example usage with external 'validator'
    rule: value => validator.isMobilePhone(value),
    hint: value => <span className="form-error is-visible">{value} isn't a Phone.</span>,
  },
});

/**
 * Select2
 * @source https://github.com/JedWatson/react-select
 */

class SelectFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      // this.setState({ value: nextProps.value });
    }
  }

  handleChange(value) {
    this.setState({ value });

    this.props.onChange(value, false);
  }

  render() {
    const options = [];
    for (const [optionKey, optionValue] of entries(getNested(() => this.props.props['#options'], {}))) {
      options.push({
        label: optionValue,
        value: optionKey,
      });
    }
    return (
      <Select
        name={this.props.name}
        value={this.state.value}
        multi={this.props.props['#multiple']}
        options={options}
        onChange={this.handleChange}
      />
    );
  }
}

export default SelectFormComponent;

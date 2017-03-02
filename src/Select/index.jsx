import React from 'react';
import Validation from 'react-validation';
import validator from 'validator';
import Select from 'react-select';
import getNested from 'get-nested';
import { entries } from '../utils';

/**
 * Select2
 * @source https://github.com/JedWatson/react-select
 */

class SelectFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.setState({ value });

    this.props.onChange(value, false);
  }

  render() {
    const options = [];
    for(const [optionKey, optionValue] of entries(getNested(() => this.props.props['#options'], {}))) {
      options.push({
        label: optionValue,
        value: optionKey,
      });
    }
    return (
      <Select
        name={this.props.field['#webform_key']}
        value={this.props.value}
        multi={this.props.props['#multiple']}
        options={options}
        onChange={this.handleChange}
      />
    );
  }
}

export default SelectFormComponent;

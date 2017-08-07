import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Input from '../Input';
import WebformUtils from '../WebformUtils';

@observer
class Number extends Component {

  /**
   * @param {Field} field Field
   */
  static validate(field) {
    const numberError = WebformUtils.getCustomValue(field.element, 'numberError', field.formStore.form.settings);

    if(field.element['#step']) {
      const dec = (`${field.element['#step']}.`).split('.')[1].length + 1;
      if((field.value * (10 ** dec)) % (field.element['#step'] * (10 ** dec) !== 0)) {
        return [numberError];
      }
    }

    if(field.element['#min'] && parseInt(field.value, 10) < parseInt(field.element['#min'], 10)) {
      return [numberError];
    }

    if(field.element['#max'] && parseInt(field.value, 10) > parseInt(field.element['#max'], 10)) {
      return [numberError];
    }

    return [];
  }

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e);
  }

  render() {
    return (
      <Input
        {...this.props}
        type='number'
        onBlur={this.props.onBlur}
        onChange={this.onChange}
      />
    );
  }
}

export default Number;

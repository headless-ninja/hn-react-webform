import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Fieldset from '../Fieldset';
// styled
import FieldsetFormRow from '../Fieldset/styled/wrapper';

const FormulaParser = require('hot-formula-parser').Parser;

@inject('formStore')
@observer
class Converse extends Component {
  static meta = {
    wrapper: FieldsetFormRow,
    label: Fieldset.meta.label,
    wrapperProps: Fieldset.meta.wrapperProps,
    labelVisibility: Fieldset.meta.labelVisibility,
    hasValue: false,
  };

  static propTypes = {
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static getTokens(formStore, field) {
    if(field.visible) {
      const amount = field.componentClass.calculateCurrentAmount(formStore, field);
      const formattedAmount = parseFloat(amount).toFixed(2);
      return {
        payment_amount: formattedAmount,
        payment_amount_number: formattedAmount.slice(0, -3),
        payment_amount_decimals: formattedAmount.slice(-2),
      };
    }
    return {};
  }

  static calculateCurrentAmount(formStore, field) {
    const parser = new FormulaParser();
    Object.entries(formStore.values).forEach(([key, value]) => {
      parser.setVariable(key, value);
    });
    const amount = parser.parse(field.element['#payment_amount']).result;
    if(isNaN(amount) || amount === null) {
      return 0;
    }
    return amount < 0 ? 0 : amount;
  }

  render() {
    return (
      <Fieldset
        {...this.props}
        onBlur={this.props.onBlur}
        onChange={this.props.onChange}
        childrenAdjacent
      />
    );
  }
}

export default Converse;

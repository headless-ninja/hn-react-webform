import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Fieldset from '../Fieldset';
import { parse } from './formula';

// styled
import FieldsetFormRow from '../Fieldset/styled/wrapper';

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
      const amount = Converse.calculateFormula(formStore.values, field.element['#payment_amount']) || 0;
      const formattedAmount = parseFloat(amount).toFixed(2);
      return {
        payment_amount: formattedAmount,
        payment_amount_number: formattedAmount.slice(0, -3),
        payment_amount_decimals: formattedAmount.slice(-2),
      };
    }
    return {};
  }

  /**
   * financial_amount_monthly_suggestion|0| + financial_amount_monthly|0| + financial_amount_yearly_suggestion|0| + financial_amount_yearly|0|
   * @param values
   * @param formula
   * @returns {*}
   */
  static calculateFormula(values, formula) {
    const amount = parse(formula, values);
    if(isNaN(amount)) {
      return null;
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

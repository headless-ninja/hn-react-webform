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
    const parser = new FormulaParser();
    const formattedFormula = formula.replace(/\|([0-9]+)\|/g, ''); // Remove all fallback values from formula (|1|)
    const formulaParts = formula.split('|'); // Split formula into parts, an array of fields & fallback values ('field|1| + field2|0|' => ['field', 1, 'field2', 0])
    parser.on('callVariable', (name, done) => { // Get's called on every variable during calculation
      const value = values[name]; // Get field value from store
      if(typeof value === 'undefined' || isNaN(parseFloat(value))) { // If value doesn't exist, or isn't a number after parsing
        const fallbackIndex = formulaParts.findIndex(item => item.endsWith(name)); // Get index of field in formula parts
        const fallbackValue = parseFloat(formulaParts[fallbackIndex + 1]); // Next to field is the fallback value, hence the + 1
        if(fallbackIndex !== false && !isNaN(fallbackValue)) { // If the fallback value exists, and is a number
          done(fallbackValue);
        }
      } else {
        done(value.replace(',', '.')); // The value exists, make sure it's in the correct format to be recognized as a number
      }
    });
    Object.entries(values).forEach(([key, value]) => {
      parser.setVariable(key, value);
    });
    const amount = parser.parse(formattedFormula).result;
    if(isNaN(amount) || amount === null) {
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

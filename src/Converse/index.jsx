import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Fieldset from '../Fieldset';

const FormulaParser = require('hot-formula-parser').Parser;

@inject('formStore')
@observer
class Converse extends Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
    labelVisibility: Fieldset.meta.labelVisibility,
    hasValue: false,
  };

  static propTypes = {
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static getTokens(formStore, field) {
    if(field.visible) {
      return {
        payment_amount: field.componentClass.calculateCurrentAmount(formStore, field.element),
      };
    }
    return {};
  }

  static calculateCurrentAmount(formStore, field) {
    const parser = new FormulaParser();
    Object.entries(formStore.values).forEach(([key, value]) => {
      parser.setVariable(key, value);
    });
    const amount = parser.parse(Fieldset.getValue(field, 'payment_amount')).result;
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

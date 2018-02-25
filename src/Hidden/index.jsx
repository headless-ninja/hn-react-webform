import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Converse from '../Converse';
import Form from '../Observables/Form';

// styled
import StyledHidden from './styled/hidden';

const Hidden = props => (
  <StyledHidden
    {...props}
    value={Hidden.rewriteValue(props.value, props.formStore.values)}
    type='hidden'
  />
);

/**
 * ~financial_amount_monthly_suggestion|0| + financial_amount_monthly|0| + financial_amount_yearly_suggestion|0| + financial_amount_yearly|0|~
 * @param value
 * @param values
 * @returns {*}
 */
Hidden.rewriteValue = (value, values) => {
  if(!value.startsWith('~') || !value.endsWith('~')) return value;
  return Converse.calculateFormula(values, value.slice(1, -1));
};

Hidden.propTypes = {
  value: PropTypes.string.isRequired,
  formStore: PropTypes.instanceOf(Form).isRequired,
};

const DecoratedHidden = observer(Hidden);

DecoratedHidden.meta = {
  wrapper: 'div',
  wrapperProps: { style: { display: 'none' } },
};

export default DecoratedHidden;

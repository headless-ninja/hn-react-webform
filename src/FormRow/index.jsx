import React from 'react';
import Fieldset from '../Fieldset';

const FormRow = props => (
  <Fieldset
    {...props}
  />
);
FormRow.meta = {
  wrapper: Fieldset.meta.wrapper,
  label: Fieldset.meta.label,
  wrapperProps: Fieldset.meta.wrapperProps,
  labelVisibility: Fieldset.meta.labelVisibility,
  hasValue: false,
};

export default FormRow;

import React from 'react';
import Fieldset from '../Fieldset';
// styled
import FieldsetFormRow from '../Fieldset/styled/wrapper';

const FormRow = props => (
  <Fieldset
    {...props}
  />
);
FormRow.meta = {
  wrapper: FieldsetFormRow,
  label: Fieldset.meta.label,
  wrapperProps: Fieldset.meta.wrapperProps,
  labelVisibility: Fieldset.meta.labelVisibility,
  hasValue: false,
};

export default FormRow;

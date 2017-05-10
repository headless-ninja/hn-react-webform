import React from 'react';
import Fieldset from '../Fieldset';

const FormRow = (props) => (
  <Fieldset
    {...props}
  />
);
FormRow.meta = {
  wrapper: <fieldset />,
  label: <legend />,
  labelVisibility: Fieldset.meta.labelVisibility,
};

export default FormRow;

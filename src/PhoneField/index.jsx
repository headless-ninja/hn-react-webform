import React from 'react';
// styled
import Phone from './styled/phone';

const PhoneField = props => (
  <Phone
    {...props}
    type='tel'
    autoComplete='tel'
  />
);

export default PhoneField;

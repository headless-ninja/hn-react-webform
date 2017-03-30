import React from 'react';
import CSSModules from 'react-css-modules';
import Input from '../Input';

const DateField = props => (
  <Input
    {...props}
    type='date'
  />
);

DateField.propTypes = {
  onChange: React.PropTypes.func.isRequired,
};

export default CSSModules(DateField);

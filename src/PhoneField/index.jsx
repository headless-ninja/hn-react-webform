import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

const PhoneField = props => (
  <Input
    {...props}
    type='tel'
    styleName='phone'
  />
);

PhoneField.propTypes = {
  onChange: React.PropTypes.func.isRequired,
};

export default CSSModules(PhoneField, styles);

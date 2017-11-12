import React from 'react';
import PropTypes from 'prop-types';
import Button from './styled/button';

const BaseButton = ({ disabled, label, formSubmitAttributes, onClick, primary, type }) => (
  <Button
    disabled={disabled ? 'disabled' : null}
    primary={primary}
    {...formSubmitAttributes}
    onClick={onClick}
    type={type}
    className='hrw-button'
  >
    {label}
  </Button>
);

BaseButton.propTypes = {
  disabled: PropTypes.bool,
  formSubmitAttributes: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  primary: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

BaseButton.defaultProps = {
  disabled: null,
  formSubmitAttributes: [],
  label: '',
  primary: true,
  onClick: () => {},
  type: 'button',
};

export default BaseButton;

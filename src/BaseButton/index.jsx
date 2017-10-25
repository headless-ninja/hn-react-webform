import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

const BaseButton = ({ disabled, label, formSubmitAttributes, onClick, isPrimary, type }) => (
  <button
    styleName={`button ${disabled ? 'disabled' : ''} ${isPrimary ? '' : 'secondary'}`}
    disabled={disabled ? 'disabled' : null}
    {...formSubmitAttributes}
    onClick={onClick}
    type={type}
  >
    {label}
  </button>
);

BaseButton.propTypes = {
  disabled: PropTypes.bool,
  formSubmitAttributes: PropTypes.arrayOf(PropTypes.string),
  label: PropTypes.string,
  isPrimary: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

BaseButton.defaultProps = {
  disabled: null,
  formSubmitAttributes: [],
  label: '',
  isPrimary: true,
  onClick: () => {},
  type: 'button',
};

export default CSSModules(BaseButton, styles, { allowMultiple: true });

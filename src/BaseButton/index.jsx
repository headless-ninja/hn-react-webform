import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

const BaseButton = ({ disabled, label, formSubmitAttributes, onClick, isPrimary }) =>
  (<button
    styleName={`button ${disabled ? 'disabled' : ''} ${isPrimary ? '' : 'secondary'}`}
    disabled={disabled ? 'disabled' : null}
    {...formSubmitAttributes}
    onClick={onClick}
  >
    {label}
  </button>);

BaseButton.propTypes = {
  disabled: PropTypes.bool,
  formSubmitAttributes: PropTypes.shape({}),
  label: PropTypes.string,
  isPrimary: PropTypes.bool,
  onClick: PropTypes.func,
};

BaseButton.defaultProps = {
  disabled: null,
  formSubmitAttributes: {},
  label: '',
  isPrimary: true,
  onClick: () => {},
};

export default CSSModules(BaseButton, styles, { allowMultiple: true });

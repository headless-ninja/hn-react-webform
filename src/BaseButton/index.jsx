import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

const BaseButton = ({ disabled, label, formSubmitAttributes }) =>
  (<div>
    <button
      styleName='button'
      disabled={disabled}
      {...formSubmitAttributes}
    >
      {label}
    </button>
  </div>);

BaseButton.propTypes = {
  disabled: PropTypes.string,
  formSubmitAttributes: PropTypes.shape({}),
  label: PropTypes.string,
};

BaseButton.defaultProps = {
  disabled: null,
  formSubmitAttributes: {},
  label: '',
};

export default CSSModules(BaseButton, styles);

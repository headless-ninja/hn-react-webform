import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Webform from '../Webform';

const SubmitButton = ({ form, status }) => {
  const settings = form.settings;
  const disabled = status === Webform.formStates.PENDING;

  return (
    <div>
      <button
        styleName='button'
        disabled={disabled}
        {...settings.form_submit_attributes}
      >
        {settings.form_submit_label}
      </button>
    </div>
  );
};

SubmitButton.propTypes = {
  form: PropTypes.shape({
    settings: PropTypes.object.isRequired,
  }).isRequired,
  status: PropTypes.string.isRequired,
};

export default CSSModules(SubmitButton, styles);

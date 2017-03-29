import React from 'react';
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
  form: React.PropTypes.shape({
    settings: React.PropTypes.object.isRequired,
  }).isRequired,
  status: React.PropTypes.string.isRequired,
};

export default CSSModules(SubmitButton, styles);

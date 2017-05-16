import React from 'react';
import PropTypes from 'prop-types';
import Webform from '../Webform';
import BaseButton from '../BaseButton';

const SubmitButton = ({ form, status }) => {
  const settings = form.settings;
  const disabled = status === Webform.formStates.PENDING;

  return (
    <div>
      <BaseButton
        disabled={disabled ? 'disabled' : null}
        label={settings.form_submit_label}
        formSubmitAttributes={settings.form_submit_attributes}
      />
    </div>
  );
};

SubmitButton.propTypes = {
  form: PropTypes.shape({
    settings: PropTypes.object.isRequired,
  }).isRequired,
  status: PropTypes.string.isRequired,
};

export default SubmitButton;

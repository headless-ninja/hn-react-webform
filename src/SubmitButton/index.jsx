import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Webform from '../Webform';
import { template } from '../Parser';
import BaseButton from '../BaseButton';
import FormStore from '../Webform/FormStore';

const SubmitButton = ({ form, formStore, status }) => {
  const settings = form.settings;
  const disabled = status === Webform.formStates.PENDING;

  return (
    <div>
      <BaseButton
        disabled={disabled}
        label={template(formStore, settings.form_submit_label)}
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
  formStore: PropTypes.instanceOf(FormStore).isRequired,
};

export default inject('formStore')(observer(SubmitButton));

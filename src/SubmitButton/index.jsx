import React from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Webform from '../Webform';
import { template } from '../Parser';
import BaseButton from '../BaseButton';
import FormStore from '../Observables/Form';

const SubmitButton = ({ field, formStore, status, show, loadingTimeout, loadingComponent }) => {
  if(field['#submit__hide'] === true || (show === false && formStore.isMultipage())) {
    return null;
  }

  const disabled = status === Webform.formStates.PENDING;

  const label = template(formStore, field['#submit__label']);

  if(!label || label === '') {
    return null;
  }

  return (
    <div>
      <BaseButton
        disabled={disabled}
        label={label}
        formSubmitAttributes={field['#submit__attributes']}
        type='submit'
      />
      {loadingTimeout && (
        loadingComponent
      )}
    </div>
  );
};

SubmitButton.meta = {
  labelVisibility: 'invisible',
};

SubmitButton.propTypes = {
  field: PropTypes.shape().isRequired,
  status: PropTypes.string.isRequired,
  formStore: PropTypes.instanceOf(FormStore).isRequired,
  show: PropTypes.bool,
  loadingTimeout: PropTypes.bool.isRequired,
  loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
};

SubmitButton.defaultProps = {
  type: 'button',
  show: false,
  loadingComponent: undefined,
};

const DecoratedSubmitButton = inject('formStore')(observer(SubmitButton));

DecoratedSubmitButton.meta = SubmitButton.meta;

export default DecoratedSubmitButton;

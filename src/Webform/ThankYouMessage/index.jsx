import React from 'react';
import PropTypes from 'prop-types';
import { inject } from 'mobx-react';
import FormStore from '../../Observables/Form';
import Parser, { template } from '../../Parser/index';
// styled
import Message from './styled/message';

const ThankYouMessage = ({ message, formStore }) => (
  <Message>{Parser(template(formStore, message))}</Message>
);

ThankYouMessage.propTypes = {
  message: PropTypes.string.isRequired,
  formStore: PropTypes.instanceOf(FormStore).isRequired,
};

export default inject('formStore')(ThankYouMessage);

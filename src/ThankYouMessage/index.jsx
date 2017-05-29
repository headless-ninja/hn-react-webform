import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { inject } from 'mobx-react';
import FormStore from '../Webform/FormStore';
import Parser, { template } from '../Parser';
import styles from './styles.pcss';

const ThankYouMessage = ({ message, formStore }) => (
  <h1 styleName='thankyou'>{Parser(template(formStore, message))}</h1>
);

ThankYouMessage.propTypes = {
  message: PropTypes.string.isRequired,
  formStore: PropTypes.instanceOf(FormStore).isRequired,
};

export default inject('formStore')(CSSModules(ThankYouMessage, styles));

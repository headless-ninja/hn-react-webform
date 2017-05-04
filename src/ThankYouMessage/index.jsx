import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import Parser from '../Parser';
import styles from './styles.pcss';

const ThankYouMessage = ({ message }) => (
  <h1 styleName='thankyou'>{Parser(message)}</h1>
);

ThankYouMessage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default CSSModules(ThankYouMessage, styles);

import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

const ThankYouMessage = ({ message }) => (
  <h1 styleName='thankyou'>{message}</h1>
);

ThankYouMessage.propTypes = {
  message: React.PropTypes.string.isRequired,
};

export default CSSModules(ThankYouMessage, styles);

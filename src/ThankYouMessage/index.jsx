import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import React from 'react';

@CSSModules(styles)
class ThankYouMessage extends React.Component {
  render() {
    return (
      <h1 styleName='thankyou'>{this.props.message}</h1>
    );
  }
}

export default ThankYouMessage;

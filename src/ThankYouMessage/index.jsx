import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles)
class ThankYouMessage extends React.Component {
  static propTypes = {
    message: React.PropTypes.string.isRequired,
  };

  render() {
    return (
      <h1 styleName='thankyou'>{this.props.message}</h1>
    );
  }
}

export default ThankYouMessage;

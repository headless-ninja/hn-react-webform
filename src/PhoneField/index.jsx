import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

@CSSModules(styles)
class PhoneField extends React.Component {
  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        type='tel'
        styleName='phone'
      />
    );
  }
}

export default PhoneField;

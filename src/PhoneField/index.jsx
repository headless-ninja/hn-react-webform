import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

@CSSModules(styles)
class PhoneField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.props.onChange}
        type='tel'
        styleName='phone'
      />
    );
  }
}

export default PhoneField;

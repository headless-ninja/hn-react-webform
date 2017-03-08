import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Input from '../Input';

@CSSModules(styles)
class EmailField extends React.Component {
  render() {
    return (
      <Input
        {...this.props}
        onChange={this.props.onChange}
        type='email'
        styleName='email'
      />
    );
  }
}

export default EmailField;

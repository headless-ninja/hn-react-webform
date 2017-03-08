import React from 'react';
import CSSModules from 'react-css-modules';
import Input from '../Input';

@CSSModules(styles)
class TextInput extends React.Component {
  render() {
    return (
      <Input {...this.props} type='text' />
    );
  }
}

export default TextInput;

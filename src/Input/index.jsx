import React from 'react';
import CSSModules from 'react-css-modules';
import getNested from 'get-nested';
import styles from './styles.pcss';

@CSSModules(styles)
class Input extends React.Component {
  render() {
    return (
      <input
        type={this.props.type}
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        placeholder={this.props.field['#placeholder']}
        styleName={`input`}
      />
    );
  }
}

export default Input;

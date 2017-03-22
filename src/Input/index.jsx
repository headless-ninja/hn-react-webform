import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
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
        styleName='input'
        className={this.props.className ? this.props.className : ''}
        aria-required={this.props.validations.includes('required') ? 'true' : 'false'}
      />
    );
  }
}

export default Input;

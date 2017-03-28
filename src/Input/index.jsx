import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class Input extends React.Component {
  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
      'type': this.props.type ? this.props.type : 'text',
    };

    return (
      <input
        type={this.props.type}
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.id || this.props.field['#webform_key']}
        placeholder={this.props.field['#placeholder']}
        styleName={`input ${this.props.webformElement.isValid() ? 'validate-success' : 'validate-error'}`}
        className={this.props.className ? this.props.className : ''}
        disabled={!this.props.webformElement.state.enabled}
        {...attrs}
      />
    );
  }
}

export default Input;

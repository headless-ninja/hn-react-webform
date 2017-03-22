import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class Input extends React.Component {
  render() {
    var attrs = {};
    this.props.webformElement.state.errors.length > 0 ? attrs['aria-invalid'] = 'true' : null;
    this.props.field['#required'] ? attrs['aria-required'] = 'true' : null;

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
        {...attrs}
      />
    );
  }
}

export default Input;

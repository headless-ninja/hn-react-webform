import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import React from 'react';

@CSSModules(styles)
class TextArea extends React.Component {
  render() {
    var attrs = {};
    this.props.webformElement.state.errors.length > 0 ? attrs['aria-invalid'] = 'true' : null;
    this.props.field['#required'] ? attrs['aria-required'] = 'true' : null;

    return (
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName='textarea'
        {...attrs}
      />
    );
  }
}

export default TextArea;

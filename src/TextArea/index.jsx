import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import React from 'react';

@CSSModules(styles)
class TextArea extends React.Component {
  render() {
    return (
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName='textarea'
        aria-required={this.props.validations.includes('required') ? 'true' : 'false'}
      />
    );
  }
}

export default TextArea;

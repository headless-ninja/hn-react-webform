import CSSModules from 'react-css-modules';
import styles from './styles.css';
import React from 'react';

@CSSModules(styles)
class TextAreaFormComponent extends React.Component {
  render() {
    return (
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName="textarea"
      />
    );
  }
}

export default TextAreaFormComponent;

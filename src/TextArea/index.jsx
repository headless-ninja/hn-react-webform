import React from 'react';
import Validation from 'react-validation';

class TextAreaFormComponent extends React.Component {
  render() {
    return (
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
      />
    );
  }
}

export default TextAreaFormComponent;

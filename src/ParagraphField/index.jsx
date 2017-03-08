import React from 'react';

class ParagraphField extends React.Component {
  render() {
    return (
      <p>{this.props.field['#message_message']}</p>
    );
  }
}

export default ParagraphField;

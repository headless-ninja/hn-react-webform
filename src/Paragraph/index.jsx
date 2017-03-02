import React from 'react';

class TextFormComponent extends React.Component {
  render() {
    return (
      <p>{this.props.field['#message_message']}</p>
    );
  }
}

export default TextFormComponent;

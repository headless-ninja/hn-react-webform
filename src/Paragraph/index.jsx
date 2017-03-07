import React from 'react';

class Paragraph extends React.Component {
  render() {
    return (
      <p>{this.props.field['#message_message']}</p>
    );
  }
}

export default Paragraph;

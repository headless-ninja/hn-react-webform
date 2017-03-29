import React from 'react';

class ParagraphField extends React.Component {
  static propTypes = {
    field: React.PropTypes.shape({
      '#message_message': React.PropTypes.string,
    }).isRequired,
  };

  render() {
    return (
      <p>{this.props.field['#message_message']}</p>
    );
  }
}

export default ParagraphField;

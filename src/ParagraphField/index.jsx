import React from 'react';

class ParagraphField extends React.Component {
  static propTypes = {
    field: React.PropTypes.shape({
      '#message_message': React.PropTypes.string,
    }).isRequired,
  };

  getFormattedMarkup() {
    return this.props.field['#message_message'];
  }

  render() {
    return (
      <p>{this.getFormattedMarkup()}</p>
    );
  }
}

export default ParagraphField;

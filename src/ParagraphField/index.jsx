import React, { Component, PropTypes } from 'react';

class ParagraphField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#message_message': PropTypes.string,
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

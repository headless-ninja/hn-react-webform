import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Parser from '../Parser';

class ParagraphField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#message_message': PropTypes.string,
    }).isRequired,
  };

  getFormattedMarkup() {
    return Parser(this.props.field['#message_message']);
  }

  render() {
    return (
      <p>{this.getFormattedMarkup()}</p>
    );
  }
}

export default ParagraphField;

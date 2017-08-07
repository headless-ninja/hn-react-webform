import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import Parser, { template } from '../Parser';
import FormStore from '../Observables/Form';

@inject('formStore')
@observer
class ParagraphField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#message_message': PropTypes.string,
    }).isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
  };

  getFormattedMarkup() {
    return Parser(template(this.props.formStore, this.props.field['#message_message']));
  }

  render() {
    return (
      <p>{this.getFormattedMarkup()}</p>
    );
  }
}

export default ParagraphField;

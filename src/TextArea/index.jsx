import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WebformElement from '../WebformElement';
// styled
import StyledTextArea from './styled/text-area';
import ValidationIcon from './styled/validation-icon';

class TextArea extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#required': PropTypes.bool,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    state: PropTypes.shape({
      required: PropTypes.bool.isRequired,
      enabled: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    value: null,
  };

  getLabelPosition() {
    return this.props.webformElement.getLabelDisplay();
  }

  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (
      <div>
        <StyledTextArea
          labelDisplay={this.getLabelPosition()}
          success={this.props.webformElement.isValid()}
          onBlur={this.props.onBlur}
          onChange={this.props.onChange}
          value={this.props.value}
          name={this.props.field['#webform_key']}
          id={this.props.field['#webform_key']}
          disabled={!this.props.state.enabled}
          required={!this.props.state.required}
          {...attrs}
        />
        <ValidationIcon success={this.props.webformElement.isSuccess()} />
      </div>
    );
  }
}

export default TextArea;

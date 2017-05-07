import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@CSSModules(styles)
class TextArea extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#required': PropTypes.bool,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.boolean,
    ]),
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };


    return (
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName='textarea'
        disabled={!this.props.webformElement.state.enabled}
        {...attrs}
      />
    );
  }
}

export default TextArea;

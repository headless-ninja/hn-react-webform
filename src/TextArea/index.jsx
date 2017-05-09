import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@CSSModules(styles, { allowMultiple: true })
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

  getLabelClass() {
    const labelClass = this.props.webformElement.getLabelClass();
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (<div>
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName={`textarea ${this.getLabelClass()} ${this.props.webformElement.isValid() ? '' : 'validate-error'}`}
        disabled={!this.props.webformElement.state.enabled}
        {...attrs}
      />
      <span styleName={`validation-icon ${this.props.webformElement.isSuccess() ? 'validate-success' : ''}`} />
    </div>);
  }
}

export default TextArea;

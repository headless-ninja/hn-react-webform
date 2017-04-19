import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import InputMask from 'react-input-mask';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@CSSModules(styles, { allowMultiple: true })
class Input extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#type': PropTypes.string.isRequired,
      '#placeholder': PropTypes.string,
      '#webform_key': PropTypes.string.isRequired,
      '#required': PropTypes.bool,
      '#mask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#alwaysShowMask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#min': PropTypes.string,
      '#max': PropTypes.string,
    }).isRequired,
    className: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    type: PropTypes.string,
    id: PropTypes.number,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  };

  static defaultProps = {
    id: 0,
    className: null,
    type: 'text',
  };

  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    let InputComponent = 'input'; // Input HTML element is 'input' by default

    // When there is a mask from Drupal.
    if(this.props.field['#mask']) {
      InputComponent = InputMask; // Use InputMask element instead.
      attrs.mask = this.props.field['#mask'];
      attrs.alwaysShowMask = this.props.field['#alwaysShowMask'] || true;
    }

    return (<div>
      <InputComponent
        type={this.props.type}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.id || this.props.field['#webform_key']}
        placeholder={this.props.field['#placeholder']}
        styleName={`input ${this.props.webformElement.isValid() ? '' : 'validate-error'}`}
        className={this.props.className ? this.props.className : ''}
        disabled={!this.props.webformElement.state.enabled}
        min={this.props.field['#min']}
        max={this.props.field['#max']}
        {...attrs}
      />
      <span styleName={`validation-icon ${this.props.webformElement.isSuccess() ? 'validate-success' : ''}`} />
    </div>);
  }
}

export default Input;

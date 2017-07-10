import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import InputMask from 'react-input-mask';
import { observer } from 'mobx-react';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@observer
@CSSModules(styles, { allowMultiple: true })
class BaseInput extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#type': PropTypes.string.isRequired,
      '#placeholder': PropTypes.string,
      '#field_prefix': PropTypes.string,
      '#field_suffix': PropTypes.string,
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
      '#step': PropTypes.string,
      '#attributes': PropTypes.shape({
        autoComplete: PropTypes.string,
      }),
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
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
    onKeyDown: PropTypes.func,
    parentRef: PropTypes.func,
    state: PropTypes.shape({
      required: PropTypes.bool.isRequired,
      enabled: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    id: 0,
    className: null,
    type: 'text',
    autoComplete: '',
    onFocus: () => {},
    onClick: () => {},
    onKeyDown: () => {},
    parentRef: () => {},
  };

  render() {
    const fieldAttrs = this.props.field['#attributes'];
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.state.required ? true : null,
      autoComplete: fieldAttrs ? fieldAttrs.autoComplete : null,
    };

    let InputComponent = 'input'; // Input HTML element is 'input' by default

    // When there is a mask from Drupal.
    if(this.props.field['#mask']) {
      InputComponent = InputMask; // Use InputMask element instead.
      attrs.mask = this.props.field['#mask'];
      attrs.alwaysShowMask = this.props.field['#alwaysShowMask'] || true;
    }

    return (
      <InputComponent
        type={this.props.type}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.id || this.props.field['#webform_key']}
        placeholder={this.props.field['#placeholder']}
        styleName={`input ${this.props.webformElement.isValid() ? '' : 'validate-error'}`}
        className={this.props.className ? this.props.className : ''}
        min={this.props.field['#min']}
        max={this.props.field['#max']}
        step={this.props.field['#step']}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onFocus={this.props.onFocus}
        onClick={this.props.onClick}
        onKeyDown={this.props.onKeyDown}
        ref={this.props.parentRef}
        disabled={!this.props.state.enabled}
        required={this.props.state.required}
        {...attrs}
      />);
  }
}

export default BaseInput;

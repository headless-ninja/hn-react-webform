import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import getNested from 'get-nested';
import WebformElement from '../WebformElement';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class RadioField extends Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#required': PropTypes.bool,
      '#options': PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.node,
        text: PropTypes.node,
      })),
      '#webform_key': PropTypes.string.isRequired,
      '#title_display': PropTypes.string,
      '#options_display': PropTypes.string,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
  };

  onChange(e) {
    this.props.onChange(e);
    this.props.onBlur(e);
  }

  getOptionPositionClass() {
    const optionClass = `radio-display-${this.props.field['#options_display']}`;
    if(styles[optionClass]) {
      return optionClass;
    }
    return '';
  }

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  render() {
    const cssClassesWrapper = `input-wrapper ${this.getLabelPositionClass()}`;
    const cssClassesRadio = `radio-label ${this.getOptionPositionClass()}`;

    const wrapperAttrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (
      <div styleName={cssClassesWrapper} role='radiogroup' {...wrapperAttrs}>
        {
          getNested(() => this.props.field['#options'], []).map((option, index) => {
            const labelKey = `${this.props.field['#webform_key']}_${index}`;
            return (
              <label key={option.value} styleName={cssClassesRadio} htmlFor={labelKey}>
                <input
                  type='radio'
                  onChange={e => this.onChange(e)}
                  value={option.value}
                  name={this.props.field['#webform_key']}
                  styleName='radio'
                  id={labelKey}
                  disabled={!this.props.webformElement.state.enabled}
                  checked={this.props.value === option.value}
                />
                <span styleName='indicator' />
                { option.text }
              </label>
            );
          })
        }
      </div>
    );
  }
}

export default RadioField;

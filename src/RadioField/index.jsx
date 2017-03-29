import React from 'react';
import CSSModules from 'react-css-modules';
import WebformElement from '../WebformElement';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class RadioField extends React.Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
  };

  static propTypes = {
    field: React.PropTypes.shape({
      '#required': React.PropTypes.bool,
      '#options': React.PropTypes.object,
      '#webform_key': React.PropTypes.string.isRequired,
    }).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
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

    const wrapperAttrs = {};
    this.props.webformElement.state.errors.length > 0 ? wrapperAttrs['aria-invalid'] = 'true' : null;
    this.props.field['#required'] ? wrapperAttrs['aria-required'] = 'true' : null;

    return (
      <div styleName={cssClassesWrapper} role='radiogroup' {...wrapperAttrs}>
        {
          this.props.field && Object.keys(this.props.field['#options']).map((option, index) => {
            const labelKey = `${this.props.field['#webform_key']}_${index}`;
            return (
              <label key={option} styleName={cssClassesRadio} htmlFor={labelKey}>
                <input
                  type='radio'
                  onChange={this.onChange.bind(this)}
                  value={option}
                  name={this.props.field['#webform_key']}
                  styleName='radio'
                  id={labelKey}
                  disabled={!this.props.webformElement.state.enabled}
                />
                <span styleName='indicator' />
                { this.props.field['#options'][option]}
              </label>
            );
          })
        }
      </div>
    );
  }
}

export default RadioField;

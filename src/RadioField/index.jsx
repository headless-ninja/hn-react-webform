import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

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
      '#title_display': React.PropTypes.string,
      '#options_display': React.PropTypes.string,
    }).isRequired,
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  getOptionPositionClass() {
    const optionClass = `radio-display-${this.props.field['#options_display']}`;
    if(styles[optionClass]) {
      return optionClass;
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
          this.props.field && Object.keys(this.props.field['#options']).map((option, index) => {
            const labelKey = `${this.props.field['#webform_key']}_${index}`;
            return (
              <label key={option} styleName={cssClassesRadio} htmlFor={labelKey}>
                <input
                  type='radio'
                  onChange={this.props.onChange}
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

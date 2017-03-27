import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class RadioField extends React.Component {
  static meta = {
    wrapper: <fieldset role='radiogroup' />,
    label: <legend />,
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
    var cssClassesWrapper = 'input-wrapper ' + this.getLabelPositionClass();
    var cssClassesRadio = 'radio-label ' + this.getOptionPositionClass();

    var attrs = {};
    this.props.webformElement.state.errors.length > 0 ? attrs['aria-invalid'] = 'true' : null;
    this.props.field['#required'] ? attrs['aria-required'] = 'true' : null;

    return (
      <div styleName={cssClassesWrapper}>
        {
          /* TODO: radio-options-sidebyside should be loaded from json option #options_display */
          this.props.field && Object.keys(this.props.field['#options']).map(option =>
            <label key={option} styleName={cssClassesRadio}>
              <input
                type='radio'
                onChange={this.props.onChange}
                value={option}
                name={this.props.field['#webform_key']}
                styleName='radio'
                {...attrs}
              />
              <div styleName='indicator' />
              { this.props.field['#options'][option]}
            </label>,
          )
        }
      </div>
    );
  }
}

export default RadioField;

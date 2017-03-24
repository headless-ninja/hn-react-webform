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

  render() {
    var cssClasses = 'input-wrapper ' + this.getLabelPositionClass();

    return (
      <div styleName={cssClasses}>
        {
          /* TODO: radio-options-sidebyside should be loaded from json option #options_display */
          this.props.field && Object.keys(this.props.field['#options']).map(option =>
            <label key={option} styleName='radio-options-side_by_side'>
              <input
                type='radio'
                onChange={this.props.onChange}
                value={option}
                name={this.props.field['#webform_key']}
                styleName='radio'
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

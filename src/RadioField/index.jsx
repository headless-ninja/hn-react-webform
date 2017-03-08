import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles, {allowMultiple:true})
class RadioInput extends React.Component {
  render() {
    return (
      <div>
        {
          /* TODO: radio-options-sidebyside should be loaded from json option #options_display */

          this.props.field && Object.keys(this.props.field['#options']).map((option) =>
            <label key={option} styleName="radio-options-side_by_side">
              <input
                type='radio'
                onChange={this.props.onChange}
                value={option}
                name={this.props.field['#webform_key']}
                id={this.props.field['#webform_key']}
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

export default RadioInput;

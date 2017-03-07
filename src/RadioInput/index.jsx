import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles)
class RadioInput extends React.Component {
  render() {
    return (
      <div styleName='radio-options'>
        {
          this.props.field && Object.keys(this.props.field['#options']).map((option) =>
            <label key={option}>
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

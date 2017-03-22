import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

@CSSModules(styles)
class CheckboxField extends React.Component {
  static meta = {
    wrapper: 'fieldset',
    label: 'legend',
    field_display: {
      '#description': 'NO_DESCRIPTION',
    },
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.checked);
  }

  render() {
    return (
      <label htmlFor={this.key} styleName='checkbox-label'>
        <Input
          {...this.props}
          onChange={this.onChange}
          type='checkbox'
          styleName='checkbox'
        />
        <div styleName='indicator' />
        {this.props.field['#description']}
      </label>
    );
  }
}

export default CheckboxField;

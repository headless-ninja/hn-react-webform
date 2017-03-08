import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';
import Input from '../Input';

@CSSModules(styles)
class CheckboxInput extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.checked);
  }

  render() {
    return (
      <label htmlFor={this.key}>
        <Input
          {...this.props}
          onChange={this.onChange}
          type='checkbox'
          styleName='checkbox'
        />
        <div styleName='indicator' />
        {this.props.label || this.props.field['#title']}
      </label>
    );
  }
}

export default CheckboxInput;

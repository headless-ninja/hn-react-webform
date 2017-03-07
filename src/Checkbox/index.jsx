import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles)
class Checkbox extends React.Component {
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
        <input
          type='checkbox'
          onChange={this.onChange}
          value={this.props.value}
          name={this.props.field['#webform_key']}
          id={this.props.field['#webform_key']}
          styleName='checkbox'
        />
        <div styleName='indicator' />
        {this.props.label || this.props.field['#title']}
      </label>
    );
  }
}

export default Checkbox;

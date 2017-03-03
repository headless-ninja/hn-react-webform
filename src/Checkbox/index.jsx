import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles)
class CheckboxFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ value: e.target.checked });
    this.props.onChange(e.target.checked, false);
  }

  render() {
    return (
      <label htmlFor={this.key}>
        <input
          type="checkbox"
          onChange={this.onChange}
          value={this.props.value}
          name={this.props.field['#webform_key']}
          id={this.props.field['#webform_key']}
          styleName="checkbox"
        />
        <div styleName="indicator"></div>
        {this.props.label || this.props.field['#title']}
      </label>
    );
  }
}

export default CheckboxFormComponent;

import React from 'react';
import Validation from 'react-validation';
import styles from './styles.scss';
import CSSModules from 'react-css-modules';

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
      <input
        type="checkbox"
        onChange={this.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        styleName="checkbox"
      />
    );
  }
}

export default CheckboxFormComponent;

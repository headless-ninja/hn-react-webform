import React from 'react';
import Validation from 'react-validation';
import styles from './styles.css';
import CSSModules from 'react-css-modules';

@CSSModules(styles)
class CheckboxFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: false,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.state.value) {
      // this.setState({ value: nextProps.value });
    }
  }

  onChange(e) {
    this.setState({ value: e.target.checked });
    this.props.onChange(e.target.checked, false);
  }

  render() {
    return (
      <Validation.components.Input
        type="checkbox"
        onChange={this.onChange}
        value={this.state.value}
        name={this.props.name}
        validations={this.props.validations}
        styleName="checkbox"
      />
    );
  }
}

export default CheckboxFormComponent;

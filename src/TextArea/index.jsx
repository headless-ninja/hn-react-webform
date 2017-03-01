import React from 'react';
import Validation from 'react-validation';

class TextAreaFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'example@example.com',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.state.value) {
      // this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <Validation.components.Textarea onChange={this.props.onChange} value={this.state.value} name={this.props.name} validations={this.props.validations.filter(a => a !== null)} />
    );
  }
}

export default TextAreaFormComponent;

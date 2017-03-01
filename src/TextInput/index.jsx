import React from 'react';
import Validation from 'react-validation';

class TextFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'Example text',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.state.value) {
      // this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <Validation.components.Input
        onChange={this.props.onChange}
        value={this.state.value}
        name={this.props.name}
        validations={this.props.validations}
        style={{padding: this.props.settings.padding}}
      />
    );
  }
}

export default TextFormComponent;

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
       <p>{this.props.props['#message_message']}</p>
    );
  }
}

export default TextFormComponent;

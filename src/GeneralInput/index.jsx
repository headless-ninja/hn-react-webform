import React from 'react';

class GeneralInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'Example text',
    };
  }

  render() {
    return (
      <input
        type='text'
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
      />
    );
  }
}

export default GeneralInput;

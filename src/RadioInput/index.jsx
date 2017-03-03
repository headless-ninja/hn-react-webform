import React from 'react';

class RadioFormComponent extends React.Component {
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
        type='radio'
        onChange={this.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
      />
    );
  }
}

export default RadioFormComponent;

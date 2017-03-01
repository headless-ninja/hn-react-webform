import React from 'react';
import Validation from 'react-validation';
import validator from 'validator';

class EmailFormComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'example@example.com',
    };

    Validation.rules = Object.assign(Validation.rules, {
      email: {
        // Example usage with external 'validator'
        rule: value => validator.isEmail(value),
        hint: value => <span className="form-error is-visible">{value} isnt an Email.</span>,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value && nextProps.value !== this.state.value) {
      // this.setState({ value: nextProps.value });
    }
  }

  render() {
    return (
      <Validation.components.Input type="email" onChange={this.props.onChange} value={this.state.value} name={this.props.name} validations={['email', ...this.props.validations]} />
    );
  }
}

export default EmailFormComponent;

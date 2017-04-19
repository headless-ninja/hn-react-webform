import React, { Component, PropTypes } from 'react';
import Fieldset from '../Fieldset';
import Input from '../Input';

class Date extends Component {
  static propTypes = {
    field: PropTypes.shape({
      composite_elements: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
      ]),
      '#default_value': PropTypes.string,
      '#min': PropTypes.string,
      '#max': PropTypes.string,
      '#mask': PropTypes.string,
    }).isRequired,
  };


  constructor(props) {
    super(props);

    this.state = {
      showPicker: false,
    };
  }

  render() {
    const field = this.props.field;
    field['#min'] = Fieldset.getValue(field, 'min');
    field['#max'] = Fieldset.getValue(field, 'max');
    field['#mask'] = Fieldset.getValue(field, 'mask');

    return (
      <Input
        {...this.props}
        field={field}
        parent={this}
      />
    );
  }
}

export default Date;

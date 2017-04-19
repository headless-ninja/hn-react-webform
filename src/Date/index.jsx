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
      '#min': PropTypes.string.isRequired,
      '#default_value': PropTypes.string,
      '#max': PropTypes.string.isRequired,
    }).isRequired,
  };

  //
  // constructor(props) {
  //   super(props);
  //
  //
  // }

  render() {
    const props = Object.assign({}, this.props);
    const field = props.field;
    field['#min'] = Fieldset.getValue(field, 'min');
    field['#max'] = Fieldset.getValue(field, 'max');
    field['#mask'] = Fieldset.getValue(field, 'mask');

    return (
      <Input
        {...this.props}
        parent={this}
      />
    );
  }
}

export default Date;

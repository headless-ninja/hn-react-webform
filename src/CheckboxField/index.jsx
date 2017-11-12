import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Parser from '../Parser';
import Fieldset from '../Fieldset';
// styled
import Wrapper from './styled/wrapper';
import Label from './styled/label';
import Checkbox from './styled/checkbox';
import Indicator from './styled/indicator';
import InnerLabel from './styled/inner-label';

@observer
class CheckboxField extends Component {
  static meta = {
    wrapper: Fieldset.meta.wrapper,
    label: Fieldset.meta.label,
    wrapperProps: Fieldset.meta.wrapperProps,
    field_display: {
      '#description': 'NO_DESCRIPTION',
    },
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#title_display': PropTypes.string,
      '#description': PropTypes.string,
      '#required': PropTypes.bool,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    id: PropTypes.number,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    state: PropTypes.shape({
      required: PropTypes.bool.isRequired,
      enabled: PropTypes.bool.isRequired,
    }).isRequired,
  };

  static defaultProps = {
    id: 0,
  };

  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.props.onChange(e.target.checked);
    this.props.onBlur(e);
  }

  getValue() {
    return this.props.value === '1' || this.props.value === true ? 'checked' : false;
  }

  render() {
    const value = this.getValue();
    return (
      <Wrapper labelDisplay={this.props.field['#title_display']}>
        <Label htmlFor={this.key}>
          <Checkbox
            type='checkbox'
            onChange={this.onChange}
            value={value}
            checked={value}
            name={this.props.field['#webform_key']}
            id={this.props.id || this.props.field['#webform_key']}
            disabled={!this.props.state.enabled}
            required={this.props.state.required}
          />
          <Indicator />
          <InnerLabel className='hrw-inner-label'>
            {Parser(this.props.field['#description'])}
          </InnerLabel>
        </Label>
      </Wrapper>
    );
  }
}

export default CheckboxField;

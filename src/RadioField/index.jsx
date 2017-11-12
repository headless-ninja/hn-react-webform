import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getNested from 'get-nested';
import Parser from '../Parser';
import WebformElement from '../WebformElement';
import Field from '../Observables/Field';
import Fieldset from '../Fieldset';
// styled
import Wrapper from './styled/wrapper';
import RadioLabel from './styled/radio-label';
import Radio from './styled/radio';
import Indicator from './styled/indicator';

class RadioField extends Component {
  static meta = {
    wrapper: Fieldset.meta.wrapper,
    label: Fieldset.meta.label,
    wrapperProps: Fieldset.meta.wrapperProps,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#required': PropTypes.bool,
      '#options': PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.node,
        text: PropTypes.node,
      })),
      '#webform_key': PropTypes.string.isRequired,
      '#title_display': PropTypes.string,
      '#options_display': PropTypes.string,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    state: PropTypes.instanceOf(Field).isRequired,
  };

  getOptionPositionDisplay() {
    return this.props.field['#options_display'];
  }

  getLabelPositionDisplay() {
    return this.props.field['#title_display'];
  }

  render() {
    const wrapperAttrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (
      <Wrapper
        role='radiogroup'
        {...wrapperAttrs}
        labelDisplay={this.getLabelPositionDisplay()}
      >
        {
          getNested(() => this.props.field['#options'], []).map((option, index) => {
            const labelKey = `${this.props.field['#webform_key']}_${index}`;
            return (
              <RadioLabel
                key={option.value}
                htmlFor={labelKey}
                optionDisplay={this.getOptionPositionDisplay()}
              >
                <Radio
                  type='radio'
                  onChange={this.props.onChange}
                  onBlur={this.props.onBlur}
                  value={option.value}
                  name={this.props.field['#webform_key']}
                  id={labelKey}
                  disabled={!this.props.state.enabled}
                  checked={this.props.value === option.value.toString()}
                />
                <Indicator />
                {Parser(option.text)}
              </RadioLabel>
            );
          })
        }
      </Wrapper>
    );
  }
}

export default RadioField;

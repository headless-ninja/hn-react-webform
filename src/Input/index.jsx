import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Parser from '../Parser';
import BaseInput from '../BaseInput';
import WebformElement from '../WebformElement';
// styled
import Wrapper from './styled/wrapper';
import InnerWrapper from './styled/inner-wrapper';
import Prefix from './styled/prefix';
import Suffix from './styled/suffix';
import ValidationIcon from './styled/validation-icon';

@observer
class Input extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#type': PropTypes.string.isRequired,
      '#placeholder': PropTypes.string,
      '#field_prefix': PropTypes.string,
      '#field_suffix': PropTypes.string,
      '#webform_key': PropTypes.string.isRequired,
      '#required': PropTypes.bool,
      '#mask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#alwaysShowMask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#min': PropTypes.string,
      '#max': PropTypes.string,
      '#step': PropTypes.string,
      '#attributes': PropTypes.oneOfType([
        PropTypes.shape({
          autoComplete: PropTypes.string,
        }),
        PropTypes.array,
      ]),
    }).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
  };

  getLabelDisplay() {
    return this.props.webformElement.getLabelDisplay();
  }

  renderTextContent(selector) {
    const value = this.props.field[`#field_${selector}`];
    if(value) {
      const TextContent = selector === 'prefix' ? Prefix : Suffix;

      return <TextContent>{Parser(value)}</TextContent>;
    }
    return null;
  }

  render() {
    return (
      <div>
        <Wrapper labelDisplay={this.getLabelDisplay()}>
          <InnerWrapper>
            {this.renderTextContent('prefix')}
            <BaseInput
              {...this.props}
              field={this.props.field}
            />
            {this.renderTextContent('suffix')}
          </InnerWrapper>
        </Wrapper>
        <ValidationIcon success={this.props.webformElement.isSuccess()} />
      </div>
    );
  }
}

export default Input;

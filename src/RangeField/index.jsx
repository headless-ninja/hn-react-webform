import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WebformElement from '../WebformElement';
// styled
import Wrapper from './styled/wrapper';
import Range from './styled/range';
import RangeValueWrapper from './styled/range-value-wrapper';
import RangeValue from './styled/range-value';
import ValidationIcon from './styled/validation-icon';

class RangeField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#title_display': PropTypes.string,
      '#min': PropTypes.string,
      '#max': PropTypes.string,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
  };

  componentDidMount() {
    // rewrite to 0 if not numeric
    const value = !isNaN(parseFloat(this.props.value)) && isFinite(this.props.value) ? this.props.value : 0;
    this.props.onChange(value);
  }

  getLabelPosition() {
    return this.props.field['#title_display'];
  }

  getPercentageValue() {
    const minValue = parseFloat(this.props.field['#min']);
    const range = parseFloat(this.props.field['#max']) - minValue;
    let rangeValue = (this.props.value - minValue) / range;
    rangeValue = isFinite(rangeValue) ? rangeValue : 0;
    rangeValue = rangeValue > 0 ? rangeValue : 0;

    return rangeValue * 100;
  }

  render() {
    return (
      <div>
        <Wrapper labelDisplay={this.getLabelPosition()}>
          <Range
            {...this.props}
            type='range'
          />
          <RangeValueWrapper labelDisplay={this.getLabelPosition()}>
            <RangeValue style={{ left: `${this.getPercentageValue()}%` }}>{this.props.value}</RangeValue>
          </RangeValueWrapper>
          <ValidationIcon success={this.props.webformElement.isSuccess()} className='hrw-validation-icon' />
        </Wrapper>
      </div>
    );
  }
}

export default RangeField;

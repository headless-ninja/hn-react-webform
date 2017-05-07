import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

@CSSModules(styles, { allowMultiple: true })
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
  };

  componentDidMount() {
    // rewrite to 0 if not numeric
    const value = !isNaN(parseFloat(this.props.value)) && isFinite(this.props.value) ? this.props.value : 0;
    this.props.onChange(value);
  }

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
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
    const cssClassesWrapper = `input-wrapper ${this.getLabelPositionClass()}`;

    return (
      <div styleName={cssClassesWrapper}>
        <Input
          {...this.props}
          type='range'
          styleName='range'
        />
        <span styleName={`range-value-wrapper ${this.getLabelPositionClass()}`}><span styleName='range-value' style={{ left: `${this.getPercentageValue()}%` }}>{this.props.value}</span></span>
      </div>
    );
  }
}

export default RangeField;

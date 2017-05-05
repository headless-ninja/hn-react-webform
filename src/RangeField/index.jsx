import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';

@CSSModules(styles, { allowMultiple: true })
class RangeField extends Component {

  static propTypes = {
    field: PropTypes.shape({
      '#title_display': PropTypes.string,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.props.onChange(this.getNumericValue());
  }

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  getNumericValue() {
    // rewrite to 0 if not numeric
    return !isNaN(parseFloat(this.props.value)) && isFinite(this.props.value) ? this.props.value : 0;
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
        <span styleName={`range-value-wrapper ${this.getLabelPositionClass()}`}><span styleName='range-value' style={{ left: `${this.getNumericValue()}%` }}>{this.getNumericValue()}</span></span>
      </div>
    );
  }
}

export default RangeField;

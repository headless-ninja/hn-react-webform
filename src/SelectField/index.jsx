import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
// eslint-disable-next-line import/no-unresolved,import/no-webpack-loader-syntax
import '!style!css!postcss!react-select/dist/react-select.css';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

/**
 * Select2
 * @source https://github.com/JedWatson/react-select
 */

@CSSModules(styles, { allowMultiple: true })
class SelectField extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#title_display': PropTypes.string.string,
      '#options': PropTypes.object,
      '#webform_key': PropTypes.string.isRequired,
      '#multiple': PropTypes.bool,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  handleChange(value) {
    const newValue = value || '';
    if(newValue && newValue.value) {
      return this.props.onChange(newValue.value, false);
    }
    return this.props.onChange(newValue, false);
  }

  render() {
    const cssClassesWrapper = `select-wrapper ${this.getLabelPositionClass()} ${this.props.webformElement.isValid() ? 'validate-success' : 'validate-error'}`;
    const options = this.props.field['#options'] || {};
    const mappedOptions = Object.keys(options).map((optionKey) => {
      const option = options[optionKey];
      return {
        label: option,
        value: optionKey,
      };
    });
    return (
      <div styleName={cssClassesWrapper}>
        <Select
          name={this.props.field['#webform_key']}
          id={this.props.field['#webform_key']}
          value={this.props.value}
          multi={this.props.field['#multiple']}
          options={mappedOptions}
          onChange={this.handleChange}
          disabled={!this.props.webformElement.state.enabled}
        />
      </div>
    );
  }
}

export default SelectField;

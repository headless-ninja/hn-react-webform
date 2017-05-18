import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
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
      '#options': PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.node,
        text: PropTypes.node,
      })),
      '#webform_key': PropTypes.string.isRequired,
      '#multiple': PropTypes.bool,
      '#empty_option': PropTypes.string,
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    state: PropTypes.shape({
      required: PropTypes.bool.isRequired,
      enabled: PropTypes.bool.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  getLabelPositionClass() {
    const labelClass = this.props.webformElement.getLabelClass();
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  handleChange(value) {
    const newValue = value || '';
    if(newValue && newValue.value) {
      this.props.onChange(newValue.value);
    } else {
      this.props.onChange(newValue);
    }
  }

  render() {
    const cssClassesWrapper = `select-wrapper ${this.getLabelPositionClass()} ${this.props.webformElement.isValid() ? '' : 'validate-error'}`;
    const options = this.props.field['#options'] || {};
    const mappedOptions = options.map(option => ({
      label: option.text,
      value: option.value,
    }));
    return (
      <div styleName={cssClassesWrapper}>
        <Select
          name={this.props.field['#webform_key']}
          id={this.props.field['#webform_key']}
          value={this.props.value}
          multi={this.props.field['#multiple']}
          options={mappedOptions}
          onChange={this.handleChange}
          onBlur={this.props.onBlur}
          disabled={!this.props.state.enabled}
          required={this.props.state.required}
          autoBlur
          placeholder={this.props.field['#empty_option'] || 'Selecteer...'}
          openAfterFocus
        />
        <span styleName={`validation-icon ${this.props.webformElement.isSuccess() ? 'validate-success' : ''}`} />
      </div>
    );
  }
}

export default SelectField;

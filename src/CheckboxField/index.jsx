import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import Parser from '../Parser';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class CheckboxField extends Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
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

  getLabelPositionClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  getValue() {
    return this.props.value === '1' || this.props.value === true ? 'checked' : false;
  }

  render() {
    const cssClasses = `input-wrapper ${this.getLabelPositionClass()}`;
    const value = this.getValue();
    return (
      <div styleName={cssClasses}>
        <label htmlFor={this.key} styleName='checkbox-label'>
          <input
            type='checkbox'
            styleName='checkbox'
            onChange={this.onChange}
            value={value}
            checked={value}
            name={this.props.field['#webform_key']}
            id={this.props.id || this.props.field['#webform_key']}
            disabled={!this.props.state.enabled}
            required={this.props.state.required}
          />
          <span styleName='indicator' />
          {Parser(this.props.field['#description'])}
        </label>
      </div>
    );
  }
}

export default CheckboxField;

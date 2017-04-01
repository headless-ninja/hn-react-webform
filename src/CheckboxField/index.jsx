import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@CSSModules(styles, { allowMultiple: true })
class CheckboxField extends React.Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
    field_display: {
      '#description': 'NO_DESCRIPTION',
    },
  };

  static propTypes = {
    field: React.PropTypes.shape({
      '#webform_key': React.PropTypes.string.isRequired,
      '#title_display': React.PropTypes.string,
      '#description': React.PropTypes.string,
      '#required': React.PropTypes.bool,
    }).isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.bool,
    ]).isRequired,
    id: React.PropTypes.number,
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
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
            disabled={!this.props.webformElement.state.enabled}
          />
          <span styleName='indicator' />
          {this.props.field['#description']}
        </label>
      </div>
    );
  }
}

export default CheckboxField;

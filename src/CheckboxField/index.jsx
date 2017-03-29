import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Input from '../Input';
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
      '#title_display': React.PropTypes.string,
      '#description': React.PropTypes.string,
      '#required': React.PropTypes.bool,
    }).isRequired,
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
    onChange: React.PropTypes.func.isRequired,
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

  render() {
    const cssClasses = `input-wrapper ${this.getLabelPositionClass()}`;
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (
      <div styleName={cssClasses}>
        <label htmlFor={this.key} styleName='checkbox-label'>
          <Input
            {...this.props}
            onChange={this.onChange}
            type='checkbox'
            styleName='checkbox'
            {...attrs}
          />
          <span styleName='indicator' />
          {this.props.field['#description']}
        </label>
      </div>
    );
  }
}

export default CheckboxField;

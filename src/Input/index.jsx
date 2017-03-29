import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@CSSModules(styles, { allowMultiple: true })
class Input extends React.Component {
  static propTypes = {
    field: React.PropTypes.shape({
      '#type': React.PropTypes.string.isRequired,
      '#placeholder': React.PropTypes.string,
      '#webform_key': React.PropTypes.string.isRequired,
      '#required': React.PropTypes.bool,
    }).isRequired,
    className: React.PropTypes.string,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.boolean,
    ]),
    type: React.PropTypes.string,
    id: React.PropTypes.number,
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
    onChange: React.PropTypes.func.isRequired,
    onBlur: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
    id: null,
    className: null,
    type: 'text',
  };

  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };

    return (
      <input
        type={this.props.type}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.id || this.props.field['#webform_key']}
        placeholder={this.props.field['#placeholder']}
        styleName={`input ${this.props.webformElement.isValid() ? 'validate-success' : 'validate-error'}`}
        className={this.props.className ? this.props.className : ''}
        disabled={!this.props.webformElement.state.enabled}
        {...attrs}
      />
    );
  }
}

export default Input;

import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';

@CSSModules(styles)
class TextArea extends React.Component {
  static propTypes = {
    field: React.PropTypes.shape({
      '#webform_key': React.PropTypes.string.isRequired,
      '#required': React.PropTypes.bool,
    }).isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.boolean,
    ]),
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
    onChange: React.PropTypes.func.isRequired,
  };

  static defaultProps = {
    value: null,
  };

  render() {
    const attrs = {
      'aria-invalid': this.props.webformElement.isValid() ? null : true,
      'aria-required': this.props.field['#required'] ? true : null,
    };


    return (
      <textarea
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName='textarea'
        disabled={!this.props.webformElement.state.enabled}
        {...attrs}
      />
    );
  }
}

export default TextArea;

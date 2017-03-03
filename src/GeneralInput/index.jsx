import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles)
class GeneralInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'Example text',
    };
  }

  render() {
    return (
      <input
        type='text'
        onChange={this.props.onChange}
        value={this.props.value}
        name={this.props.field['#webform_key']}
        id={this.props.field['#webform_key']}
        styleName="input"
      />
    );
  }
}

export default GeneralInput;

import React from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles)
class SubmitButton extends React.Component {
  render() {
    const settings = this.props.form.settings;
    return (
      <div>
        <button styleName='button' {...settings.form_submit_attributes}>{settings.form_submit_label}</button>
      </div>
    );
  }
}

export default SubmitButton;

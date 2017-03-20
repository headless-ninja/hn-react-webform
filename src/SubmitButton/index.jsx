import React from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

@CSSModules(styles)
class SubmitButton extends React.Component {
  render() {
    const settings = this.props.form.settings;
    let disabled = this.props.status === 'pending';

    return (
      <div>
        <button styleName='button' disabled={disabled} {...settings.form_submit_attributes}>{settings.form_submit_label}</button>
      </div>
    );
  }
}

export default SubmitButton;

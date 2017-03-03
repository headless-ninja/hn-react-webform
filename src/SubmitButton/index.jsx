import React from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import styles from './styles.css';

@CSSModules(styles)
class SubmitButtonComponent extends React.Component {
  render() {
    const settings = getNested(() => this.props.form.settings, {});
    return (
      <div>
        {settings &&
          <button styleName="button" {...settings.form_submit_attributes}>{settings.form_submit_label}</button>
        }
      </div>
    );
  }
}

export default SubmitButtonComponent;

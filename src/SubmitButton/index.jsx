import React from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';
import Webform from '../Webform';

@CSSModules(styles)
class SubmitButton extends React.Component {
  static propTypes = {
    form: React.PropTypes.shape({
      settings: React.PropTypes.object.isRequired,
    }).isRequired,
    status: React.PropTypes.string.isRequired,
  };

  render() {
    const settings = this.props.form.settings;
    const disabled = this.props.status === Webform.formStates.PENDING;

    return (
      <div>
        <button
          styleName='button'
          disabled={disabled}
          {...settings.form_submit_attributes}
        >
          {settings.form_submit_label}
        </button>
      </div>
    );
  }
}

export default SubmitButton;

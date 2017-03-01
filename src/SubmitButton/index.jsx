import React from 'react';
import Validation from 'react-validation';

class SubmitButtonComponent extends React.Component {

  render() {
    const settings = this.props.form ? this.props.form.settings : {};
    return (
      <div>
        {settings &&
          <Validation.components.Button {...settings.form_submit_attributes}>{settings.form_submit_label}</Validation.components.Button>
        }
      </div>
    );
  }
}

export default SubmitButtonComponent;

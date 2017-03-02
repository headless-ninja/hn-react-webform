import React from 'react';
import getNested from 'get-nested';

class SubmitButtonComponent extends React.Component {
  render() {
    const settings = getNested(() => this.props.form.settings, {});
    return (
      <div>
        {settings &&
        <button {...settings.form_submit_attributes}>{settings.form_submit_label}</button>
        }
      </div>
    );
  }
}

export default SubmitButtonComponent;

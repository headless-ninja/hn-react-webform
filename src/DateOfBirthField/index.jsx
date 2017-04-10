import React from 'react';
import Fieldset from '../Fieldset';
import FormStore from '../Webform/FormStore';
import WebformElement from '../WebformElement';

class DateOfBirthField extends React.Component {

  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
  };

  static propTypes = {
    field: React.PropTypes.shape({
      composite_elements: React.PropTypes.oneOfType([
        React.PropTypes.array,
        React.PropTypes.object,
      ]),
      '#type': React.PropTypes.string.isRequired,
      '#default_value': React.PropTypes.string,
      '#webform_key': React.PropTypes.string.isRequired,
      '#required': React.PropTypes.bool,
      '#pattern': React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.instanceOf(RegExp),
      ]),
      '#requiredError': React.PropTypes.string,
      '#patternError': React.PropTypes.string,
      // '#emailError': React.PropTypes.string,
      '#title': React.PropTypes.string,
      '#states': React.PropTypes.object,
      '#options': React.PropTypes.object,
      '#title_display': React.PropTypes.string,
      // '#options_display': React.PropTypes.string,
      '#mask': React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool,
      ]),
      '#alwaysShowMask': React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool,
      ]),
    }).isRequired,
    formStore: React.PropTypes.instanceOf(FormStore).isRequired,
    webformElement: React.PropTypes.instanceOf(WebformElement).isRequired,
  };


  constructor(props) {
    super(props);

    // To-Do: might not be the most efficient way
    // map object to the expected array format, using the object name as array key
    const formElementsObject = this.props.field.composite_elements || {};
    const formElementsArray = [];
    Object.keys(formElementsObject).forEach((key) => {
      formElementsObject[key]['#webform_key'] = key;
      formElementsArray.push(formElementsObject[key]);
    });
    this.props.field.composite_elements = formElementsArray;
  }

  render() {
    return (
      <Fieldset
        key={this.props.field['#webform_key']}
        field={this.props.field}
        formStore={this.props.formStore}
        parent={this}
      />
    );
  }
}

export default DateOfBirthField;

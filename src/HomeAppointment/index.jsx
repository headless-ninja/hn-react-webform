import React, { Component } from "react";
import PropTypes from "prop-types";
import FormStore from "../Observables/Form";

function composeHomeAppointment(HomeAppointmentComponent) {
  return class extends Component {
    static propTypes = {
      formStore: PropTypes.instanceOf(FormStore).isRequired,
      field: PropTypes.shape({
        "#webform_key": PropTypes.string.isRequired,
        composite_elements: PropTypes.arrayOf(
          PropTypes.shape({
            "#webform_key": PropTypes.string.isRequired,
            "#default_value": PropTypes.string
          })
        )
      }).isRequired,
      onBlur: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);

      this.formKeySuffix = `-${props.field["#webform_key"]}`;
    }

    static meta = HomeAppointmentComponent.meta || {};

    render() {
      return (
        <HomeAppointmentComponent
          {...this.props}
          {...this.state}
          formKeySuffix={this.formKeySuffix}
        />
      );
    }
  };
}

export default composeHomeAppointment;

import React, { Component } from 'react';
import getNested from 'get-nested';
import PropTypes from 'prop-types';
import composeLookUp from '../LookUp';
import Fieldset from '../Fieldset';
import FormStore from '../Webform/FormStore';

class Address extends Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
    labelVisibility: Fieldset.meta.labelVisibility,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      composite_elements: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    getField: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    settings: PropTypes.shape().isRequired,
    formKeySuffix: PropTypes.string.isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
  };

  constructor(props) {
    super(props);

    this.lookUpFields = {
      street: {
        formKey: `address_street${props.formKeySuffix}`,
        apiValue: address => address.street,
        hideField: true,
      },
      postcode: {
        formKey: `address_postcode${props.formKeySuffix}`,
        apiValue: () => false,
        triggerLookup: true,
      },
      number: {
        formKey: `address_number${props.formKeySuffix}`,
        apiValue: () => false,
        triggerLookup: true,
      },
      addition: {
        formKey: `address_number_add${props.formKeySuffix}`,
        apiValue: () => false,
        triggerLookup: true,
      },
      city: {
        formKey: `address_city${props.formKeySuffix}`,
        apiValue: address => address.city.label,
        hideField: true,
      },
      locationLat: {
        formKey: `address_location_lat${props.formKeySuffix}`,
        apiValue: address => address.geo.center.wgs84.coordinates[1],
      },
      locationLng: {
        formKey: `address_location_lng${props.formKeySuffix}`,
        apiValue: address => address.geo.center.wgs84.coordinates[0],
      },
    };

    this.lookUpBase = 'https://postcode-api.apiwise.nl/v2/addresses';
  }

  prepareLookUp(fields) {
    const postCodeField = this.props.getField('postcode').field;

    if(!fields.postcode || !postCodeField || !postCodeField.component.isValid()) {
      return false;
    }

    const query = `?postcode=${fields.postcode}${fields.number ? `&number=${fields.number}${fields.addition || ''}` : ''}`;

    return {
      query,
      // eslint-disable-next-line no-underscore-dangle
      checkResponse: json => getNested(() => json._embedded.addresses[0]),
      headers: {
        'X-Api-Key': getNested(() => this.props.field.composite_elements
          .find(element =>
            element['#webform_key'].includes('postcode_api_key'))['#default_value']) || this.props.formStore.settings.postcodeApiKey,
      },
    };
  }

  render() {
    return (
      <Fieldset
        {...this.props}
        onBlur={this.props.onBlur}
      />
    );
  }
}

export default composeLookUp(Address);

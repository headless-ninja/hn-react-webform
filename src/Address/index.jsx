import React from 'react';
import getNested from 'get-nested';
import LookUp from '../LookUp';
import Fieldset from '../Fieldset';

class Address extends LookUp {
  constructor(props) {
    super(props);

    this.lookUpFields = {
      street: {
        formKey: `address_street${this.formKeySuffix}`,
        apiValue: address => address.street,
        hideField: true,
      },
      postcode: {
        formKey: `address_postcode${this.formKeySuffix}`,
        apiValue: () => false,
        triggerLookup: true,
      },
      number: {
        formKey: `address_number${this.formKeySuffix}`,
        apiValue: () => false,
        triggerLookup: true,
      },
      addition: {
        formKey: `address_number_add${this.formKeySuffix}`,
        apiValue: () => false,
        triggerLookup: true,
      },
      city: {
        formKey: `address_city${this.formKeySuffix}`,
        apiValue: address => address.city.label,
        hideField: true,
      },
      locationLat: {
        formKey: `address_location_lat${this.formKeySuffix}`,
        apiValue: address => address.geo.center.wgs84.coordinates[1],
      },
      locationLng: {
        formKey: `address_location_lng${this.formKeySuffix}`,
        apiValue: address => address.geo.center.wgs84.coordinates[0],
      },
    };

    this.lookUpBase = 'https://postcode-api.apiwise.nl/v2/addresses';
  }

  prepareLookUp(fields) {
    const postCodeField = this.getField('postcode').field;

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
        onBlur={this.onBlur}
      />
    );
  }
}

export default Address;

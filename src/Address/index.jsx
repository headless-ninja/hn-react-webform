import React, { Component } from 'react';
import PropTypes from 'prop-types';
import composeLookUp from '../LookUp';
import Fieldset from '../Fieldset';

class Address extends Component {
  static meta = {
    wrapper: <fieldset />,
    label: <legend />,
    labelVisibility: Fieldset.meta.labelVisibility,
  };

  static propTypes = {
    getField: PropTypes.func.isRequired,
    webformSettings: PropTypes.shape({
      cmsBaseUrl: PropTypes.string.isRequired,
    }).isRequired,
    onBlur: PropTypes.func.isRequired,
    formKeySuffix: PropTypes.string.isRequired,
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

    this.lookUpBase = `${props.webformSettings.cmsBaseUrl}/postcode-api/address?_format=json`;
  }

  prepareLookUp(fields) {
    const postCodeField = this.props.getField('postcode').field;

    if(!fields.postcode || !postCodeField || !postCodeField.component.isValid()) {
      return false;
    }

    const query = `&postcode=${fields.postcode}${fields.number ? `&number=${fields.number}${fields.addition || ''}` : ''}`;

    return {
      query,
      // eslint-disable-next-line no-underscore-dangle
      checkResponse: json => json,
      isSuccessful: json => (!!json.id),
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

import React, { Component, PropTypes } from 'react';
import fetch from 'fetch-everywhere';
import getNested from 'get-nested';
import Fieldset from '../Fieldset';
import FormStore from '../Webform/FormStore';
import WebformElement from '../WebformElement';

class Address extends Component {
  static meta = {
    labelVisibility: Fieldset.meta.labelVisibility,
  };

  static propTypes = {
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      composite_elements: PropTypes.arrayOf(PropTypes.shape({
        '#webform_key': PropTypes.string.isRequired,
        '#default_value': PropTypes.string,
      })),
    }).isRequired,
  };

  static addressFields = {
    street: {
      formKey: 'address-street',
      apiValue: address => address.street,
      hideField: true,
    },
    postcode: {
      formKey: 'address-postcode',
      apiValue: () => false,
      triggerLookup: true,
    },
    number: {
      formKey: 'address-number',
      apiValue: () => false,
      triggerLookup: true,
    },
    addition: {
      formKey: 'address-number-add',
      apiValue: () => false,
      triggerLookup: true,
    },
    city: {
      formKey: 'address-city',
      apiValue: address => address.city.label,
      hideField: true,
    },
    locationLat: {
      formKey: 'address-location-lat',
      apiValue: address => address.geo.center.wgs84.coordinates[1],
    },
    locationLng: {
      formKey: 'address-location-lng',
      apiValue: address => address.geo.center.wgs84.coordinates[0],
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      query: '',
    };

    this.onBlur = this.onBlur.bind(this);
  }

  componentDidMount() {
    this.setFieldVisibility(false);
  }

  onBlur(e) {
    const triggerElement = Object.values(Address.addressFields).find(element => `${element.formKey}-${this.props.field['#webform_key']}` === e.target.name);
    if(!triggerElement || !triggerElement.triggerLookup) {
      return;
    }

    const addressFields = {};
    this.addressFieldIterator((field, element) => {
      const value = field.getValue();
      if(!WebformElement.isEmpty(field.props, value)) {
        addressFields[element.elementKey] = value;
      }
    });

    const postCodeField = this.getAddressField('postcode').field;

    if(!addressFields.postcode || !postCodeField || !postCodeField.component.isValid()) {
      return;
    }

    const query = `?postcode=${addressFields.postcode}${addressFields.number ? `&number=${addressFields.number}${addressFields.addition || ''}` : ''}`;

    if(query !== this.state.query) {
      this.lookUp(query);
    }
  }

  setFieldVisibility(set) {
    this.addressFieldIterator((field, element) => {
      if(element.hideField) {
        field.component.setState({ visible: set === null ? !field.component.state.visible : set });
      }
    });
  }

  getAddressField(elementKey) {
    const element = Address.addressFields[elementKey];
    element.elementKey = elementKey;
    const field = this.props.formStore.getField(`${element.formKey}-${this.props.field['#webform_key']}`);
    return {
      element,
      field,
    };
  }

  addressFieldIterator(cb) {
    Object.keys(Address.addressFields).forEach((elementKey) => {
      const { element, field } = this.getAddressField(elementKey);
      if(field) {
        cb(field, element);
      }
    });
  }

  lookUp(query) {
    this.setState({ query });

    // eslint-disable-next-line no-undef
    const headers = new Headers({
      'X-Api-Key': getNested(() => this.props.field.composite_elements
        .find(element =>
          element['#webform_key'].includes('postcode-api-key'))['#default_value']) || this.props.formStore.settings.postcodeApiKey,
    });

    fetch(`https://postcode-api.apiwise.nl/v2/addresses${query}`, {
      headers,
    })
      .then(res => res.json())
      .then((json) => {
        if(this.state.query !== query) {
          this.setFieldVisibility(true);
          return;
        }

        if(json.error) {
          console.error(json.error);
          return;
        }

        // eslint-disable-next-line no-underscore-dangle
        if(getNested(() => json._embedded.addresses, []).length) {
          // eslint-disable-next-line no-underscore-dangle
          const address = json._embedded.addresses[0];

          this.addressFieldIterator((field, element) => {
            const value = getNested(() => element.apiValue(address));
            if(value) {
              field.setStorage({ value });
              field.component.validate(true);
            }
          });

          this.setFieldVisibility(true);

          this.props.formStore.checkConditionals();
        }
      });
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

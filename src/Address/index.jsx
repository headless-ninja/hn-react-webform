import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { get } from 'mobx';
import composeLookUp from '../LookUp';
import Fieldset from '../Fieldset';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';
import WebformUtils from '../WebformUtils';
import FormStore from '../Observables/Form';

// styled
import FieldsetFormRow from '../Fieldset/styled/wrapper';
import ValidationMessage from '../LookUp/styled/validation-message';

@observer
class Address extends Component {
  static meta = {
    wrapper: FieldsetFormRow,
    label: Fieldset.meta.label,
    wrapperProps: Fieldset.meta.wrapperProps,
    labelVisibility: Fieldset.meta.labelVisibility,
    validations: [el => `address_${el.key}`],
    hasValue: false,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#addressError': PropTypes.string,
      composite_elements: PropTypes.arrayOf(PropTypes.shape()),
      parent: PropTypes.shape({
        props: PropTypes.shape({
          field: PropTypes.shape(),
        }),
      }),
    }).isRequired,
    getField: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    formKeySuffix: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    settings: PropTypes.shape().isRequired,
    registerLookUp: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const field = props.formStore.getField(props.field['#webform_key']);

    const lookUpIsBlocking = field.element['#address_validation'] || (
      field.parent && field.parent.element['#address_validation']);

    this.lookUpFields = {
      street: {
        elementKey: 'street',
        formKey: `address_street${props.formKeySuffix}`,
        apiValue: address => address.street,
        hideField: true,
        disableField: lookUpIsBlocking,
      },
      postcode: {
        elementKey: 'postcode',
        formKey: `address_postcode${props.formKeySuffix}`,
        apiValue: address => (address.postcode || '').toUpperCase(),
        triggerLookUp: true,
      },
      number: {
        elementKey: 'number',
        formKey: `address_number${props.formKeySuffix}`,
        apiValue: () => false,
        triggerLookUp: true,
      },
      addition: {
        elementKey: 'addition',
        formKey: `address_number_add${props.formKeySuffix}`,
        apiValue: () => false,
        triggerLookUp: true,
      },
      city: {
        elementKey: 'city',
        formKey: `address_city${props.formKeySuffix}`,
        apiValue: address => address.city.label,
        hideField: true,
        disableField: lookUpIsBlocking,
      },
      locationLat: {
        elementKey: 'locationLat',
        formKey: `address_location_lat${props.formKeySuffix}`,
        apiValue: address => address.geo.center.wgs84.coordinates[1],
      },
      locationLng: {
        elementKey: 'locationLng',
        formKey: `address_location_lng${props.formKeySuffix}`,
        apiValue: address => address.geo.center.wgs84.coordinates[0],
      },
      manualOverride: {
        elementKey: 'manualOverride',
        formKey: `address_manual_override${props.formKeySuffix}`,
        apiValue: () => false,
      },
    };


    this.lookUpBase = `${props.url}/postcode-api/address?_format=json`;

    const lookUpKey = this.getLookUpKey(props);

    rules.set(`address_${props.field['#webform_key']}`, {
      rule: () => {
        const lookUp = get(field.lookUps, lookUpKey);
        return !lookUpIsBlocking || !lookUp || !lookUp.lookUpSent || (
          lookUp.lookUpSent && lookUp.lookUpSuccessful
        );
      },
      hint: () => null,
      shouldValidate: () => props.fields.reduce(
          (shouldValidate, item) =>
            shouldValidate && !item.isEmpty && item.isBlurred && item.valid,
          true,
        ),
    });

    props.registerLookUp(lookUpKey, this.lookUpFields);
  }

  getLookUpKey(props) {
    return `${(
      props || this.props
    ).field['#webform_key']}-address`;
  }

  prepareLookUp(fields) {
    const postCodeField = this.props.getField('postcode').field;

    if(!fields.postcode || !postCodeField || !postCodeField.valid) {
      return false;
    }

    const query = `&postcode=${fields.postcode.toUpperCase()}${fields.number ? `&number=${fields.number}` : ''}`;

    return {
      query,
      // eslint-disable-next-line no-underscore-dangle
      checkResponse: json => json,
      isSuccessful: json => (!!json.id),
    };
  }

  render() {
    const field = this.props.formStore.getField(this.lookUpFields.postcode.formKey);
    const lookUpKey = this.getLookUpKey();
    const lookUp = get(field.lookUps, lookUpKey);

    return (
      <Fieldset {...this.props}>
        {lookUp && lookUp.lookUpSent && !lookUp.lookUpSuccessful && (
          <RuleHint
            component={<ValidationMessage />}
            key={`address_${this.props.field['#webform_key']}`}
            hint={WebformUtils.getCustomValue(this.props.field, 'addressError', this.props.settings) ||
                    WebformUtils.getErrorMessage(this.props.field, '#required_error') ||
                    'We don\'t recognise this address. Please check again, or proceed anyway.'}
          />
        )}
      </Fieldset>
    );
  }
}

export default composeLookUp(Address);

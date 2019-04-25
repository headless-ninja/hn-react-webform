import React, { Component } from 'react';
import getNested from 'get-nested';
import PropTypes from 'prop-types';
import { site } from 'hn-react';
import { observer } from 'mobx-react';
import { get } from 'mobx';
import composeLookUp from '../LookUp';
import Fieldset from '../Fieldset';
import RuleHint from '../RuleHint';
import rules from '../Webform/rules';
import FormStore from '../Observables/Form';
import WebformUtils from '../WebformUtils';
// styled
import ValidationMessage from '../LookUp/styled/validation-message';

@observer
class Relation extends Component {
  static meta = {
    labelVisibility: Fieldset.meta.labelVisibility,
    validations: [el => `relation_membership_${el.key}`],
    hasValue: false,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#relationError': PropTypes.string,
      '#membership_validation': PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.bool,
      ]),
      composite_elements: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onBlur: PropTypes.func.isRequired,
    formKeySuffix: PropTypes.string.isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    settings: PropTypes.shape().isRequired,
    registerLookUp: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.lookUpFields = {
      relation_number: {
        elementKey: 'relation_number',
        formKey: `relation_number${props.formKeySuffix}`,
        triggerLookUp: true,
        apiValue: () => false,
        required: true,
      },
      postcode: {
        elementKey: 'postcode',
        formKey: `address_postcode${this.fullAddressLookUp() ? `-${this.fullAddressLookUp()}` : props.formKeySuffix}`,
        triggerLookUp: true,
        apiValue: () => false,
        required: true,
      },
    };

    this.lookUpBase = `${props.url}/salesforce-lookup/contact?_format=json`;

    const lookUpKey = this.getLookUpKey(props);
    const field = props.formStore.getField(props.field['#webform_key']);

    rules.set(`relation_membership_${props.field['#webform_key']}`, {
      rule: () => {
        const lookup = get(field.lookups, lookUpKey);
        return !field.element['#membership_validation'] || !lookup || !lookup.lookupSent || (
          lookup.lookupSent && lookup.lookupSuccessful
        );
      },
      hint: () => null,
      shouldValidate: () => props.fields.reduce((shouldValidate, item) =>
        shouldValidate && !item.isEmpty && item.isBlurred && item.valid,
        true,
      ),
    });

    props.registerLookUp(lookUpKey, this.lookUpFields);
  }

  getLookUpKey(props) {
    return `${(
      props || this.props
    ).field['#webform_key']}-relation`;
  }

  /**
   * If Relation field has full address element, get its webform key to add as suffix to fields.
   * @returns {bool|string} Returns false if not full address field (i.e. postcode only) or string of address webform key.
   */
  fullAddressLookUp() {
    return getNested(() => this.props.field.composite_elements.find(element => element['#type'] === 'webform_address_custom' || element['#type'] === 'dutch_address')['#webform_key']);
  }

  prepareLookUp(fields) {
    const performLookUp = this.props.fields.reduce((shouldValidate, item) =>
      shouldValidate && !item.isEmpty && item.isBlurred && item.valid,
      true,
    );

    if(!performLookUp) {
      return false;
    }

    const query = `&relation=${fields.relation_number}&postal_code=${fields.postcode}`;

    return {
      query,
      checkResponse: json => (json.Id && (!this.props.field['#membership_validation'] || parseInt(json.Aantal_lidmaatschappen__c, 10) > 0)) || false,
      isSuccessful: response => (!!response),
    };
  }

  render() {
    const field = this.props.formStore.getField(this.lookUpFields.relation_number.formKey);
    const lookUpKey = this.getLookUpKey();
    const lookup = get(field.lookups, lookUpKey);

    return (
      <Fieldset {...this.props}>
        {lookup && lookup.lookupSent && !lookup.lookupSuccessful && (
          <RuleHint component={<ValidationMessage />} key={`relation_${lookUpKey}`} hint={WebformUtils.getCustomValue(this.props.field, 'relationError', this.props.settings) || WebformUtils.getErrorMessage(this.props.field, '#required_error') || 'We don\'t recognise this combination of relation number and postal code. Please check again, or proceed anyway.'} />
        )}
      </Fieldset>
    );
  }
}

export default composeLookUp(Relation);

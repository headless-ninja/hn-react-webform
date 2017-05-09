import React, { Component } from 'react';
import getNested from 'get-nested';
import PropTypes from 'prop-types';
import composeLookUp from '../LookUp';
import Fieldset from '../Fieldset';
import RuleHint from '../RuleHint';

class Relation extends Component {
  static meta = {
    labelVisibility: Fieldset.meta.labelVisibility,
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string.isRequired,
      '#relationError': PropTypes.string,
      composite_elements: PropTypes.arrayOf(PropTypes.shape()),
    }).isRequired,
    webformSettings: PropTypes.shape({
      cmsBaseUrl: PropTypes.string.isRequired,
    }).isRequired,
    fieldIterator: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    sent: PropTypes.bool.isRequired,
    successful: PropTypes.bool.isRequired,
    formKeySuffix: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.lookUpFields = {
      relation_number: {
        formKey: `relation_number${props.formKeySuffix}`,
        triggerLookup: true,
        apiValue: () => false,
        required: true,
      },
      postcode: {
        formKey: `address_postcode${this.fullAddressLookUp() ? `-${this.fullAddressLookUp()}` : props.formKeySuffix}`,
        triggerLookup: true,
        apiValue: () => false,
        required: true,
      },
    };

    this.lookUpBase = `${props.webformSettings.cmsBaseUrl}/salesforce-lookup/contact?_format=json`;
  }

  /**
   * If Relation field has full address element, get its webform key to add as suffix to fields.
   * @returns {bool|string} Returns false if not full address field (i.e. postcode only) or string of address webform key.
   */
  fullAddressLookUp() {
    return getNested(() => this.props.field.composite_elements.find(element => element['#type'] === 'webform_address_custom')['#webform_key']);
  }

  prepareLookUp(fields) {
    let performLookUp = true;
    this.props.fieldIterator((field, element) => {
      if(element.required && (!fields[element.elementKey] || !field.component.isValid(true))) {
        performLookUp = false;
        return false;
      }
      return true;
    });

    if(!performLookUp) {
      return false;
    }

    const query = `&relation=${fields.relation_number}&postal_code=${fields.postcode}`;

    return {
      query,
      checkResponse: json => json.Id || false,
      isSuccessful: response => (!!response),
    };
  }

  render() {
    return (
      <Fieldset
        {...this.props}
        onBlur={this.props.onBlur}
      >
        {this.props.sent && !this.props.successful &&
        <RuleHint key={`relation_${this.props.field['#webform_key']}`} hint={this.props.field['#relationError'] || 'We don\'t recognise this combination of relation number and postal code. Please check again, or proceed anyway.'} />
        }
      </Fieldset>
    );
  }
}

export default composeLookUp(Relation);

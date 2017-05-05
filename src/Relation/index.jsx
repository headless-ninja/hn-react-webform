import React from 'react';
import getNested from 'get-nested';
import LookUp from '../LookUp';
import Fieldset from '../Fieldset';
import RuleHint from '../RuleHint';

class Relation extends LookUp {
  constructor(props) {
    super(props);

    this.lookUpFields = {
      relation_number: {
        formKey: `relation_number${this.formKeySuffix}`,
        triggerLookup: true,
        apiValue: () => false,
        required: true,
      },
      postcode: {
        formKey: `address_postcode${this.fullAddressLookUp() ? `-${this.fullAddressLookUp()}` : this.formKeySuffix}`,
        triggerLookup: true,
        apiValue: () => false,
        required: true,
      },
    };

    this.lookUpBase = '/services/data/v37.0/query/?q=SELECT+Id,name,otherstreet,othercity,otherpostalcode,othercountry,Is_Lid__c,email,phone,Primaire_Lidmaatschap__c+from+Contact+where+';

    this.state = {
      sent: false,
      successful: false,
    };
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
    this.fieldIterator((field, element) => {
      if(element.required && (!fields[element.elementKey] || !field.component.isValid())) {
        performLookUp = false;
        return false;
      }
      return true;
    });

    if(!performLookUp) {
      return false;
    }

    const query = `relatienummer__c='${fields.relation_number}'+AND+OtherPostalCode='${fields.postcode}'`;

    return {
      query,
      checkResponse: json => (json.done ? json : false),
      headers: {
        'X-Api-Key': getNested(() => this.props.field.composite_elements
          .find(element =>
            element['#webform_key'].includes('relation_api_key'))['#default_value']) || this.props.formStore.settings.postcodeApiKey,
      },
    };
  }

  lookUpCallback(response) {
    this.setState({
      sent: true,
      successful: response.totalSize > 0,
    });
  }

  render() {
    return (
      <Fieldset
        {...this.props}
        onBlur={this.onBlur}
      >
        {this.state.sent && !this.state.successful &&
        <RuleHint key={`relation_${this.props.field['#webform_key']}`} hint={this.props.field['#relationError'] || 'We don\'t recognise this combination of relation number and postal code. Please check again, or proceed anyway.'} />
        }
      </Fieldset>
    );
  }
}

export default Relation;

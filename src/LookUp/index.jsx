import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'fetch-everywhere';
import getNested from 'get-nested';
import { get, set } from 'mobx';
import FormStore from '../Observables/Form';

function composeLookUp(LookUpComponent) {
  return class extends Component {
    static meta = LookUpComponent.meta || {};

    static propTypes = {
      formStore: PropTypes.instanceOf(FormStore).isRequired,
      field: PropTypes.shape({
        '#webform_key': PropTypes.string.isRequired,
        composite_elements: PropTypes.arrayOf(PropTypes.shape({
          '#webform_key': PropTypes.string.isRequired,
          '#default_value': PropTypes.string,
        })),
      }).isRequired,
      onBlur: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
    };

    static rewriteValue = LookUpComponent.rewriteValue;

    constructor(props) {
      super(props);

      this.formKeySuffix = `-${props.field['#webform_key']}`;

      /**
       * Example: {
       *  street: {
       *    formKey: 'street', // #webform_key in Drupal
       *    apiValue: response => response.street, // Method that receives the response object, and returns the value to pre-fill or false if not to pre-fill.
       *    hideField: true, // Boolean to determine default state of field.
       *    triggerLookUp: false, // Boolean to determine whether blurring this field should trigger the look-up.
       *  },
       * }
       */
      this.lookUpFields = {};

      this.lookUpOnBlurOnly = false;

      this.lookUpBase = null;
      this.el = null;

      this.state = {
        query: '',
      };

      this.onChange = this.onChange.bind(this);
      this.onBlur = this.onBlur.bind(this);
      this.onMount = this.onMount.bind(this);
      this.getField = this.getField.bind(this);
      this.getState = this.getState.bind(this);
      this.fieldIterator = this.fieldIterator.bind(this);
      this.triggerLookUp = this.triggerLookUp.bind(this);
      this.registerLookUp = this.registerLookUp.bind(this);
    }

    componentDidMount() {
      this.setFieldVisibility(true);
      this.setManualOverride(false);
    }

    onMount(el) {
      if(el) {
        this.el = el;
        this.lookUpBase = el.lookUpBase;
        this.lookUpFields = el.lookUpFields || {};
      }
    }

    onBlur(e) {
      const triggerElement = Object.values(this.lookUpFields).find(element => element.formKey === e.target.name);
      if(!triggerElement || !triggerElement.triggerLookUp) {
        return;
      }

      this.triggerLookUp();

      this.props.onBlur(e);
    }

    onChange(e) {
      const triggerElement = Object.values(this.lookUpFields).find(element => element.formKey === e.target.name);
      if(triggerElement && !triggerElement.triggerLookUp) {
        this.setManualOverride(true);
      }
      this.props.onChange(e);

      if(!triggerElement || this.lookUpOnBlurOnly) return;

      const field = this.props.formStore.getField(triggerElement.formKey);

      if(!field) return;

      const lookUpKey = this.el.getLookUpKey();
      const lookUp = get(field.lookUps, lookUpKey);
      if(lookUp && lookUp.lookUpSent) this.triggerLookUp();
    }

    setFieldVisibility() {
      const lookUpKey = this.el.getLookUpKey();
      this.fieldIterator((field, element) => {
        const lookUp = get(field.lookUps, lookUpKey);
        if(lookUp) {
          set(field.lookUps, lookUpKey, {
            ...lookUp,
            lookUpHide: !!element.hideField,
            lookUpDisabled: !!element.disableField,
          });
        }
      });
    }

    setManualOverride(override) {
      const { field } = this.getField('manualOverride');
      if(field) {
        field.value = override.toString();
      }
    }

    /**
     * @param elementKey
     * @returns {Boolean | {field: Field, element}}
     */
    getField(elementKey) {
      if(!this.lookUpFields) {
        return false;
      }
      const element = this.lookUpFields[elementKey];
      if(!element) {
        return false;
      }
      const field = this.props.formStore.getField(element.formKey);
      return {
        element,
        field,
      };
    }

    getFields() {
      if(!this.lookUpFields) {
        return [];
      }
      return Object.values(this.lookUpFields).map(element => this.props.formStore.getField(element.formKey));
    }

    getState() {
      return this.state;
    }

    registerLookUp(lookUpKey, lookUpFields, lookUpOnBlurOnly = false) {
      this.lookUpFields = lookUpFields;
      this.lookUpOnBlurOnly = lookUpOnBlurOnly;
      this.fieldIterator((field, element) => {
        set(field.lookUps, lookUpKey, {
          lookUpSent: false,
          lookUpSuccessful: true,
          lookUpHide: element.lookUps,
          lookUpDisabled: false,
        });
      });
    }

    triggerLookUp() {
      const fields = {};
      this.fieldIterator((field, element) => {
        const value = field.value;
        if(!field.empty) {
          fields[element.elementKey] = value;
        }
      });

      const lookUpObject = this.el.prepareLookUp ? this.el.prepareLookUp(fields) : false;
      if(lookUpObject && lookUpObject.query !== this.state.query) {
        this.lookUp(lookUpObject);
      }
    }

    fieldIterator(cb) {
      let stop = false;
      if(!this.lookUpFields) {
        return false;
      }
      Object.keys(this.lookUpFields).forEach((elementKey) => {
        if(stop === true) {
          return;
        }
        const { element, field } = this.getField(elementKey);
        if(field) {
          stop = cb(field, element) === false;
        }
      });
      return true;
    }

    lookUp(request) {
      const { query, headers = {} } = request;
      this.setState({ query });

      // eslint-disable-next-line no-undef
      const headersObject = new Headers(headers);

      fetch(`${this.lookUpBase}${query}`, {
        headers: headersObject,
      })
        .then(res => res.json())
        .then(response => this.processResponse(response, request))
        .catch(response => this.processResponse(response, request));
    }

    processResponse(jsonResponse, {
      query,
      checkResponse = () => false,
      isSuccessful = () => true,
    }) {
      if(this.state.query !== query) {
        console.warn('A lookUp query was returned, but we already fired another one. Ignoring this result.', query, jsonResponse);
        return;
      }

      const response = checkResponse(jsonResponse);
      const successful = isSuccessful(response);

      const lookUpKey = this.el.getLookUpKey();
      const lookUpField = this.props.formStore.getField(this.props.field['#webform_key']);

      set(lookUpField.lookUps, lookUpKey, {
        ...get(lookUpField.lookUps, lookUpKey),
        lookUpSent: true,
        lookUpSuccessful: successful,
      });

      // Let every field know the lookUp was sent, and if it was successful
      Object.keys(this.lookUpFields).forEach((elementKey) => {
        const { field } = this.getField(elementKey);
        if(field) {
          set(field.lookUps, lookUpKey, {
            ...get(field.lookUps, lookUpKey),
            lookUpSent: true,
            lookUpSuccessful: successful,
          });
        }
      });

      this.fieldIterator((field, element) => {
        const value = getNested(() => element.apiValue(response));
        if(value) {
          field.value = value;
          field.isBlurred = true;
        }
      });

      this.setManualOverride(!successful); // If successful, set to false since values are overridden

      if(this.el.lookUpCallback) {
        this.el.lookUpCallback(response);
      }
    }

    render() {
      return (
        <LookUpComponent
          {...this.props}
          {...this.state}
          onBlur={this.onBlur}
          onChange={this.onChange}
          ref={this.onMount}
          formKeySuffix={this.formKeySuffix}
          fieldIterator={this.fieldIterator}
          getField={this.getField}
          getState={this.getState}
          fields={this.getFields()}
          registerLookUp={this.registerLookUp}
        />
      );
    }
  };
}

export default composeLookUp;

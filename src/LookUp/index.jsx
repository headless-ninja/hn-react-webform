import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fetch from 'fetch-everywhere';
import getNested from 'get-nested';
import FormStore from '../Webform/FormStore';
import WebformElement from '../WebformElement';

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
    };

    constructor(props) {
      super(props);

      this.formKeySuffix = `-${props.field['#webform_key']}`;

      /**
       * Example: {
       *  street: {
       *    formKey: 'street', // #webform_key in Drupal
       *    apiValue: response => response.street, // Method that receives the response object, and returns the value to pre-fill or false if not to pre-fill.
       *    hideField: true, // Boolean to determine default state of field.
       *    triggerLookup: false, // Boolean to determine whether blurring this field should trigger the look-up.
       *  },
       * }
       */
      this.lookUpFields = {};

      this.lookUpBase = null;
      this.el = null;

      this.state = {
        query: '',
        sent: false,
        successful: true,
      };

      this.onBlur = this.onBlur.bind(this);
      this.onMount = this.onMount.bind(this);
      this.getField = this.getField.bind(this);
      this.getState = this.getState.bind(this);
      this.fieldIterator = this.fieldIterator.bind(this);
    }

    componentDidMount() {
      this.setFieldVisibility(false);
    }

    onBlur(e) {
      const triggerElement = Object.values(this.lookUpFields).find(element => element.formKey === e.target.name);
      if(!triggerElement || !triggerElement.triggerLookup) {
        return;
      }

      const fields = {};
      this.fieldIterator((field, element) => {
        const value = field.getValue();
        if(!WebformElement.isEmpty(field.props, value)) {
          fields[element.elementKey] = value;
        }
      });

      const lookUpObject = this.el.prepareLookUp ? this.el.prepareLookUp(fields) : false;
      if(lookUpObject && lookUpObject.query !== this.state.query) {
        this.lookUp(lookUpObject);
      }

      this.props.onBlur(e);
    }

    onMount(el) {
      if(el) {
        this.el = el;
        this.lookUpBase = el.lookUpBase;
        this.lookUpFields = el.lookUpFields || {};
      }
    }

    setFieldVisibility(set) {
      this.fieldIterator((field, element) => {
        if(element.hideField) {
          field.component.setState({ visible: set === null ? !field.component.state.visible : set });
        }
      });
    }

    getField(elementKey) {
      if(!this.lookUpFields) {
        return false;
      }
      const element = this.lookUpFields[elementKey];
      element.elementKey = elementKey;
      const field = this.props.formStore.getField(element.formKey);
      return {
        element,
        field,
      };
    }

    getState() {
      return this.state;
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

    lookUp({
             query,
             checkResponse = () => false,
             isSuccessful = () => true,
             headers = {},
           }) {
      this.setState({ query });

      // eslint-disable-next-line no-undef
      const headersObject = new Headers(headers);

      fetch(`${this.lookUpBase}${query}`, {
        headers: headersObject,
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

          const response = checkResponse(json);
          if(response) {
            this.setState({
              sent: true,
              successful: isSuccessful(response),
            }, () => {
              this.fieldIterator((field, element) => {
                const value = getNested(() => element.apiValue(response));
                if(value) {
                  field.setStorage({ value });
                }
                field.component.validate(true);
              });

              this.setFieldVisibility(true);

              this.props.formStore.checkConditionals();

              if(this.el.lookUpCallback) {
                this.el.lookUpCallback(response);
              }
            });
          }
        })
        .catch(error => (this.el.lookUpCallback ? this.el.lookUpCallback(error) : null));
    }

    render() {
      return (
        <LookUpComponent
          {...this.props}
          {...this.state}
          onBlur={this.onBlur}
          ref={this.onMount}
          formKeySuffix={this.formKeySuffix}
          fieldIterator={this.fieldIterator}
          getField={this.getField}
          getState={this.getState}
        />
      );
    }
  };
}

export default composeLookUp;

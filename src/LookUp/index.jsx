import React, { Component, PropTypes } from 'react';
import fetch from 'fetch-everywhere';
import getNested from 'get-nested';
import Fieldset from '../Fieldset';
import FormStore from '../Webform/FormStore';
import WebformElement from '../WebformElement';

class LookUp extends Component {
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
    onBlur: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

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
    this.formKeySuffix = `-${props.field['#webform_key']}`;

    this.state = {
      query: '',
    };

    this.onBlur = this.onBlur.bind(this);
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

    const lookUpObject = this.prepareLookUp(fields);

    if(lookUpObject && lookUpObject.query !== this.state.query) {
      this.lookUp(lookUpObject.query, lookUpObject.checkResponse, lookUpObject.headers);
    }

    this.props.onBlur(e);
  }

  setFieldVisibility(set) {
    this.fieldIterator((field, element) => {
      if(element.hideField) {
        field.component.setState({ visible: set === null ? !field.component.state.visible : set });
      }
    });
  }

  getField(elementKey) {
    const element = this.lookUpFields[elementKey];
    element.elementKey = elementKey;
    const field = this.props.formStore.getField(element.formKey);
    return {
      element,
      field,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  prepareLookUp() {
    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  lookUpCallback() {
    return false;
  }

  fieldIterator(cb) {
    let stop = false;
    Object.keys(this.lookUpFields).forEach((elementKey) => {
      if(stop === true) {
        return;
      }
      const { element, field } = this.getField(elementKey);
      if(field) {
        stop = cb(field, element) === false;
      }
    });
  }

  lookUp(query, checkResponse, headers = {}) {
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
          this.fieldIterator((field, element) => {
            const value = getNested(() => element.apiValue(response));
            if(value) {
              field.setStorage({ value });
              field.component.validate(true);
            }
          });

          this.setFieldVisibility(true);

          this.props.formStore.checkConditionals();

          this.lookUpCallback(response);
        }
      })
        .catch(error => this.lookUpCallback(error));
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

export default LookUp;

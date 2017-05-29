import { observable, computed } from 'mobx';
import Field from './Field';

class Form {
  @observable settings = {};
  @observable fields = [];
  @observable formProperties = {
    hasRequiredFields: false,
  };
  key = null;

  constructor(formId, settings, defaults = {}) {
    this.key = formId;
    this.settings = settings;
    this.defaults = defaults;
  }

  checkConditionals(excluded = []) {
    this.fields.forEach(field => field.component.checkConditionals(excluded));
  }

  createField(component, key, props, valid) {
    const existingFieldIndex = this.getFieldIndex(key);

    let defaultValue;
    if(typeof this.defaults[key] !== 'undefined') {
      defaultValue = this.defaults[key];
    }

    const field = new Field(component, key, props, valid, defaultValue);
    if(existingFieldIndex > -1) {
      return field;
    }
    this.fields.push(field);
    return field;
  }

  getField(key) {
    return this.fields.find(field => field.key === key);
  }

  getFieldIndex(key) {
    return this.fields.findIndex(field => field.key === key);
  }

  @computed get valid() {
    return !this.fields.find((field) => {
      const component = field.component;
      const isValid = component.validate(true);
      return !isValid;
    });
  }

  isValid(page) {
    const invalid = this.fields.find(({ component }) => {
      // Only check the current page
      if(component.props.webformPage !== page) return false;

      // Validate the component
      const valid = component.valid;

      // If an error was found, return true
      return !valid;
    });

    // If an error was found, return false
    return !invalid;
  }
}

export default Form;

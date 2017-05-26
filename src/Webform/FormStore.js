import { observable, computed } from 'mobx';
import { formatConditionals } from './conditionals';

class Field {
  key = null;
  component = null;

  @observable valid = true;
  @observable value = null;
  conditionals = false;
  hasChanged = false;
  isBlurred = false;

  constructor(component, key, props = {}, valid = false, defaultValue) {
    if(!component) {
      throw new Error('Element instance reference is required');
    }

    if(!key) {
      throw new Error('Element key is required');
    }

    this.component = component;
    this.key = key;
    this.valid = valid;
    this.value = defaultValue || props['#default_value'] || '';
    this.props = props;
    this.conditionals = formatConditionals(props['#states']);
  }

  getStorage(fields = false) {
    if(Array.isArray(fields)) {
      const data = {};
      fields.forEach((f) => {
        data[f] = this[f];
      }); // Add property from field storage for each field key in fields array.
      return data;
    } else if(typeof fields === 'string') {
      return this[fields];
    }
    return this;
  }

  getValue() {
    return this.value;
  }

  setStorage(patch) {
    Object.keys(patch).forEach((patchKey) => {
      this[patchKey] = patch[patchKey];
    });
  }
}

class FormStore {
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

export default FormStore;

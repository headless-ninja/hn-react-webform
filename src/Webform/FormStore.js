import { observable } from 'mobx';
import { formatConditionals } from './conditionals';

class Field {
  key = null;
  component = null;

  @observable valid = true;
  @observable value = null;
  conditionals = false;

  constructor(component, key, props = {}, valid = false) {
    if(!component) {
      throw new Error('Element instance reference is required');
    }

    if(!key) {
      throw new Error('Element key is required');
    }

    this.component = component;
    this.key = key;
    this.valid = valid;
    this.value = props['#default_value'] || '';
    this.props = props;
    this.conditionals = formatConditionals(props['#states']);
  }
}

class FormStore {
  @observable fields = [];
  @observable formProperties = {
    hasRequiredFields: false,
  };
  key = null;

  constructor(formId) {
    this.key = formId;
  }

  createField(component, key, props, valid) {
    const field = new Field(component, key, props, valid);
    this.fields.push(field);
  }

  getField(key) {
    return this.fields.find(field => field.key === key);
  }

  getFieldIndex(key) {
    return this.fields.findIndex(field => field.key === key);
  }

  getFieldStorage(fields = false, key = this.key) {
    const field = this.getField(key);

    if(field) {
      if(Array.isArray(fields)) {
        const data = {};
        fields.forEach(f => data[f] = field[f]); // Add property from field storage for each field key in fields array.
        return data;
      } else if(typeof fields === 'string') {
        return field[fields];
      }
      return field;
    }

    return false;
  }

  setFieldStorage(patch, key) {
    const index = this.getFieldIndex(key);
    if(index !== false) {
      const fields = this.fields;
      const field = fields[index];
      fields[index] = Object.assign({}, field, patch);
    }
  }
}

export default FormStore;

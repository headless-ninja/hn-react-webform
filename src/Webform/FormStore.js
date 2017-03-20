import { observable } from 'mobx';
import remotedev from 'mobx-remotedev';

class Field {
  key = null;
  component = null;

  @observable valid = true;
  @observable value = null;

  constructor(component, key, value, valid = false) {
    this.component = component;
    this.key = key;
    this.valid = valid;
    this.value = value;
  }
}

@remotedev
class FormStore {
  @observable fields = [];
  key = null;

  constructor(formId) {
    this.key = formId;
  }

  createField(component, key, value = '', valid) {
    const field = new Field(component, key, value, valid);
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
        fields.forEach(f => data[f] = field[f]); // Add property from field storage for each field key in fields array
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

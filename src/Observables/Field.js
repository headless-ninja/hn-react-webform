import { observable } from 'mobx';
import { formatConditionals } from '../Webform/conditionals';

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

export default Field;

import getNested from 'get-nested';

class WebformUtils {

  static getCustomValue(field, key, settings) {
    if(key.startsWith('#')) {
      throw new Error('Please use the field without leading hash.');
    }

    if(field[`#override_${key}`]) {
      return field[`#${key}`];
    }

    return getNested(() => settings.custom_elements[key]['#default_value'], null);
  }

  static getErrorMessage(field, key) {
    const errorMessage = getNested(() => field[key], null);
    return errorMessage && errorMessage !== '' ? errorMessage : null;
  }

  static validateRule(rule, field, force = false) {
    if(!rule) return true;
    else if(force || !rule.shouldValidate || rule.shouldValidate(field)) {
      return rule.rule(field.getValue());
    }
    return true;
  }

  /**
   * @deprecated
   * @param field
   * @param value
   * @returns {boolean}
   */
  static isEmpty(field, value) {
    if(value === '' || value === false) {
      return true;
    }

    if(field && field['#mask']) {
      const mask = field['#mask'].replace(/9|a|A/g, '_');
      return value === mask;
    }

    return false;
  }

}

export default WebformUtils;

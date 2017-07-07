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

  static validateRule(rule, field, force = false) {
    if(force || !rule.shouldValidate || rule.shouldValidate(field)) {
      return rule.rule(field.getValue());
    }
    return true;
  }

}

export default WebformUtils;

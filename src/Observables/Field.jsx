import React from 'react';
import { observable, computed } from 'mobx';
import getNested from 'get-nested';
import { site } from 'hn-react';
import RuleHint from '../RuleHint';
import rules from '../Webform/rules';
import { components } from '../index';
import { formatConditionals, checkConditionals, supportedActions } from '../Webform/conditionals';
import WebformUtils from '../WebformUtils';

class Field {
  key;
  element;

  /**
   * @var Form
   */
  formStore;
  componentClass;
  conditionals;

  /**
   * @var {Field}
   */
  parent;
  /**
   *
   * @type {Array.<Field>}
   */
  parents = [];

  page = 'no-page';

  /**
   * @deprecated
   * Better not use the component at all. All logic should be in this file
   */
  @observable component = null;

  /**
   * By default, the value is ''.
   * This value gets updated in the WebformElement component.
   * @type {string}
   */
  @observable value = '';

  /**
   * As soon as the field was ever blurred or an user tries to submit an page, this value becomes true.
   * It can be used to determine if the field should display a checkmark or errors etc.
   * @type {boolean}
   */
  @observable isBlurred = false;

  @observable lookupSent = false;

  @observable lookupSuccessful = true;

  @observable lookupHide = false;

  constructor(formStore, element, parent) {
    if(!element['#webform_key']) {
      throw new Error('Element key is required');
    }

    this.value = element['#value'] || element['#default_value'] || '';

    this.formStore = formStore;
    this.key = element['#webform_key'];
    this.element = element;
    this.componentClass = components[element['#type']] || components.default;
    this.conditionals = formatConditionals(element['#states']);
    this.parent = parent;
    if(parent) {
      this.parents = [parent, ...this.parent.parents];
    }
    if(element['#type'] === 'webform_wizard_page') {
      this.page = this.key;
    } else if(parent) {
      this.page = this.parent.page;
    }

    rules.set(`${supportedActions.required}_${this.key}`, {
      rule: () => !this.isEmpty &&
      (!this.componentClass.isEmpty || !this.componentClass.isEmpty(this)),
      hint: value =>
        (<RuleHint
          key={`req_${this.key}`}
          hint={WebformUtils.getCustomValue(this.element, 'requiredError', this.formStore.form.settings) || WebformUtils.getErrorMessage(element, '#required_error') || site.t('This field is required')}
          tokens={{
            value,
            name: this.element['#title'],
          }}
        />),
      shouldValidate: field => field.isBlurred,
    });

    const pattern = this.element['#pattern'];
    if(pattern) {
      rules.set(`pattern_${this.key}`, {
        rule: (value = '') => new RegExp(pattern).test(value) || this.isEmpty,
        hint: (value) => {
          const patternError = WebformUtils.getCustomValue(this.element, 'patternError', this.formStore.form.settings);
          const populatedPatternError = getNested(() => this.formStore.form.settings.custom_elements.patternError['#options'][patternError], this.element['#patternError'] || WebformUtils.getErrorMessage(element, '#required_error') || site.t('Please enter a valid value.'));
          return <RuleHint key={`pattern_${this.key}`} hint={populatedPatternError} tokens={{ value }} />;
        },
        shouldValidate: field => field.isBlurred && WebformUtils.validateRule(rules.get(`${supportedActions.required}_${this.key}`), field),
      });
    }
  }

  /**
   * Checks is the field is currently valid.
   * @returns {boolean}
   */
  @computed get valid() {
    return this.errors.length === 0;
  }

  @computed get validations() {
    const validations = [
      this.required ? `${supportedActions.required}_${this.key}` : null,
      this.element['#pattern'] ? `pattern_${this.key}` : null,
    ];

    const populatedValidations = validations.map(validation => rules.get(validation) || null);

    const customValidationKeys = getNested(() => this.componentClass.meta.validations, [])
      .map(validation => validation(this) || null);

    populatedValidations.push(...customValidationKeys.map(k => rules.get(k)).filter(k => k));

    // rules.keys().filter(ruleKey => customValidationKeys.includes(ruleKey)).forEach((ruleKey) => {
    //   if(rules.get(ruleKey)) populatedValidations.push(rules.get(ruleKey));
    // });

    return populatedValidations;
  }

  /**
   * This is used to check if the 'required' validation is met.
   * @returns {boolean}
   */
  @computed get isEmpty() {
    if(this.value === '' || this.value === false) {
      return true;
    }

    if(this.element['#mask']) {
      const mask = this.element['#mask'].replace(/9|a|A/g, '_');
      return this.value === mask;
    }

    return false;
  }

  @computed get errors() {
    const validations = this.validations;
    const field = this;

    // Field is always valid, if there is none, OR the field is invisible, OR a parent is invisible.
    if(!field || !this.visible) {
      return [];
    }

    const errors = [];

    // Check if there is a static 'validate' function on the component class.
    if(typeof field.componentClass.validate === 'function') {
      errors.push(...field.componentClass.validate(this));
    }

    const fails = validations ? validations.filter(validation => !WebformUtils.validateRule(validation, field)) : [];

    errors.push(...fails.map(rule => rule.hint(this.value)));

    return errors;
  }

  @computed get visible() {
    if(this.lookupHide && !this.lookupSent) return false;
    return (this.parent ? this.parent.visible : true) && (typeof this.conditionalLogicResults.visible === 'undefined') ? true : this.conditionalLogicResults.visible;
  }

  @computed get required() {
    return (typeof this.conditionalLogicResults.required === 'undefined') ? !!this.element['#required'] : this.conditionalLogicResults.required;
  }

  @computed get enabled() {
    return (typeof this.conditionalLogicResults.enabled === 'undefined') ? true : this.conditionalLogicResults.enabled;
  }

  @computed get conditionalLogicResults() {
    return checkConditionals(this.formStore, this.key);
  }

  /**
   * @deprecated
   * Use field.value.
   */
  getValue() {
    return this.value;
  }
}

export default Field;

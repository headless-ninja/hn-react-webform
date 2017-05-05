import React, { Component, PropTypes } from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import Parser from '../Parser';
import { components } from '../index';
import FormStore from '../Webform/FormStore';
import rules from '../Webform/rules';
import styles from './styles.pcss';
import RuleHint from '../RuleHint';
import Wrapper from '../Wrapper';
import { checkConditionals, defaultStates, supportedActions } from '../Webform/conditionals';

@CSSModules(styles, { allowMultiple: true })
class WebformElement extends Component {
  static propTypes = {
    field: PropTypes.shape({
      '#type': PropTypes.string.isRequired,
      '#default_value': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.objectOf(PropTypes.string),
      ]),
      '#webform_key': PropTypes.string.isRequired,
      '#required': PropTypes.bool,
      '#pattern': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(RegExp),
      ]),
      '#requiredError': PropTypes.string,
      '#patternError': PropTypes.string,
      '#emailError': PropTypes.string,
      '#title': PropTypes.string,
      '#title_display': PropTypes.string,
      '#options_display': PropTypes.string,
      '#admin': PropTypes.bool,
    }).isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    parent: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    settings: PropTypes.shape({
      custom_elements: PropTypes.shape({
        patternError: PropTypes.shape({
          '#default_value': PropTypes.string,
          '#options': PropTypes.objectOf(PropTypes.string),
        }),
      }),
    }).isRequired,
  };

  static defaultProps = {
    label: false,
    parent: false,
    onChange: () => {
    },
    onBlur: () => {
    },
  };

  static validateRule(rule, field, force = false) {
    if(force || !rule.shouldValidate || rule.shouldValidate(field)) {
      return rule.rule(field.getValue());
    }
    return true;
  }

  static isEmpty(field, value) {
    if(value === '') {
      return true;
    }

    if(field['#mask']) {
      const mask = field['#mask'].replace(/9|a|A/g, '_');
      return value === mask;
    }

    return false;
  }

  static getCustomValue(field, key, settings) {
    if(key.startsWith('#')) {
      throw new Error('Please use the field without leading hash.');
    }

    if(field[`#override_${key}`]) {
      return field[`#${key}`];
    }

    return getNested(() => settings.custom_elements[key]['#default_value'], null);
  }

  constructor(props) {
    super(props);

    this.key = props.field['#webform_key'];

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);

    Object.assign(rules, {
      [`${supportedActions.required}_${this.key}`]: {
        rule: value => !WebformElement.isEmpty(props.field, value),
        hint: value =>
          <RuleHint
            key={`req_${this.key}`}
            hint={WebformElement.getCustomValue(props.field, 'requiredError', props.settings) || 'This field is required'}
            tokens={{
              value,
              name: props.field['#title'],
            }}
          />,
        shouldValidate: field => field.isBlurred,
      },
    });

    const pattern = props.field['#pattern'];
    if(pattern) {
      Object.assign(rules, {
        [`pattern_${this.key}`]: {
          rule: (value = '') => new RegExp(pattern).test(value) || WebformElement.isEmpty(props.field, value),
          hint: (value) => {
            const patternError = WebformElement.getCustomValue(props.field, 'patternError', props.settings);
            const populatedPatternError = getNested(() => props.settings.custom_elements.patternError['#options'][patternError], props.field['#patternError'] || 'The value :value doesn\'t match the right pattern');
            return <RuleHint key={`pattern_${this.key}`} hint={populatedPatternError} tokens={{ value }} />;
          },
          shouldValidate: field => field.isBlurred && WebformElement.validateRule(rules[`${supportedActions.required}_${this.key}`], field),
        },
      });
    }

    this.state = {
      errors: [],
    };

    Object.assign(this.state, defaultStates(props.field));
  }

  componentDidMount() {
    if(this.shouldRender()) {
      this.props.formStore.createField(this, this.key, this.props.field, this.validate());

      if(this.state[supportedActions.required]) {
        this.props.formStore.formProperties.hasRequiredFields = true;
      }

      this.setState({ validations: this.getValidations() });
    }
  }

  onChange(e) {
    // update store value for field
    const value = (e && e.target) ? e.target.value : e; // Check if 'e' is event, or direct value
    const field = this.getField();
    if(!field) {
      return false;
    }
    field.setStorage({ value });
    this.validate();
    this.props.formStore.checkConditionals([field.key]);

    this.props.onChange(e);

    return true;
  }

  onBlur(e) {
    this.getField().setStorage({ isBlurred: true });
    this.validate();

    this.props.onBlur(e);
  }

  getField(key = this.key) {
    return this.props.formStore.getField(key);
  }

  getFormElementComponent() {
    const element = components[this.props.field['#type']] || components.default;
    return element || false;
  }

  getFormElement() {
    if(!this.shouldRender()) {
      return false;
    }

    const ElementComponent = this.getFormElementComponent();
    if(ElementComponent) {
      return {
        class: ElementComponent,
        element: <ElementComponent
          value={this.getValue()}
          name={this.key}
          onChange={this.onChange}
          onBlur={this.onBlur}
          field={this.props.field}
          formStore={this.props.formStore}
          validations={this.state.validations}
          webformElement={this}
          settings={this.props.settings}
        />,
      };
    }
    return false;
  }

  getValidations() {
    const validations = [
      getNested(() => this.state[supportedActions.required]) ? `${supportedActions.required}_${this.key}` : null,
      getNested(() => this.props.field['#pattern']) ? `pattern_${this.key}` : null,
    ];

    const populatedValidations = validations.map(validation => rules[validation] || null);

    populatedValidations.push(...getNested(() => this.getFormElementComponent().meta.validations
      .map(validation => validation(this) || null), []));

    const filteredValidations = populatedValidations.filter(v => v !== null);

    return filteredValidations;
  }

  getValue(key = this.key) {
    const field = this.getField(key);
    if(!field) {
      return false;
    }
    return field.getValue();
  }

  getLabelClass() {
    const labelClass = `label-display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }

    const elementClass = this.getFormElementComponent();
    return `label-display-${getNested(() => elementClass.meta.labelVisibility, 'inline')}`;
  }

  checkConditionals(excluded = []) {
    const newState = checkConditionals(this.props.formStore, this.key, this.state);
    if(newState && !excluded.includes(this.key)) {
      this.setState(newState, () => {
        this.setState({ validations: this.getValidations() }, () => {
          this.validate();
        });
      });
    }
  }

  isValid(key = this.key) {
    const field = this.getField(key);
    if(!field) {
      return true;
    }
    return field.getStorage('valid');
  }

  isVisible() {
    return this.state[supportedActions.visible] && getNested(() => this.props.parent.isVisible(), true);
  }

  validate(force = false) {
    const validations = this.state.validations;
    const field = this.getField();

    // Field is always valid, if there is none, OR the field is invisible, OR a parent is invisible.
    if(!field || !this.isVisible()) {
      return true;
    }

    const fails = validations ? validations.filter(validation => !WebformElement.validateRule(validation, field, force)) : [];

    const errors = fails.map(rule => rule.hint(this.getValue()));
    const valid = errors.length === 0;

    // if(!valid) {
    //   const log = valid ? console.info : console.warn;
    //   log(this.key, '=> is', valid ? 'valid' : 'invalid');
    // }

    field.setStorage({
      valid,
      isBlurred: force ? true : field.isBlurred,
    });

    this.setState({ errors });

    return valid;
  }

  shouldValidate(force = false) {
    if(force) {
      return true;
    }
    const field = this.getField();
    if(!field) {
      return false;
    }
    return field.isBlurred;
  }

  shouldRender() {
    return !this.props.field['#admin'];
  }

  isSuccess() {
    return this.shouldValidate() && this.isValid();
  }

  renderTextContent(selector, checkValue = false, addClass = '') {
    const value = this.props.field[getNested(() => this.getFormElementComponent().meta.field_display[selector], selector)]; // Value in #description field
    const displayValue = this.props.field[`${selector}_display`];
    const cssClass = `${selector.replace(/#/g, '').replace(/_/g, '-')}${checkValue ? `-${checkValue}` : ''}`; // '#field_suffix' and 'suffix' become .field--suffix-suffix

    if(!value || (!!checkValue && checkValue !== displayValue)) {
      if(!(!displayValue && checkValue === 'isUndefined')) {
        return false;
      }
    }

    const className = `${addClass} ${styles[cssClass] ? cssClass : ''}`;

    return (<span styleName={className}>{Parser(value)}</span>);
  }

  renderFieldLabel(element, show = true) {
    /* if the label is a legend, it is supposed to be the first child of the fieldset wrapper.*/

    if(this.props.field['#title'] && show) {
      return (
        <Wrapper
          component={getNested(() => element.class.meta.label, <label htmlFor={this.key} />)}
          styleName={`label ${this.getLabelClass()}`}
        >
          {Parser(this.props.field['#title'])}
          {this.state[supportedActions.required] ? (<small>*</small>) : null}
        </Wrapper>
      );
    }

    return '';
  }

  render() {
    if(!this.shouldRender()) {
      return null;
    }

    const element = this.getFormElement();

    const errors = this.state.errors.length > 0 ? (
      <ul role='alert' styleName={`${this.getLabelClass()} validation-message`}> {this.state.errors} </ul>)
      : null;

    return (
      <Wrapper
        component={getNested(() => element.class.meta.wrapper, <div />)}
        styleName='formrow'
        {...!this.state[supportedActions.visible] ? { hidden: true } : {}}
      >
        { this.renderFieldLabel(element, getNested(() => element.class.meta.label.type) === 'legend') }

        { this.renderTextContent('#description', 'before') }

        { this.renderFieldLabel(element, getNested(() => element.class.meta.label.type) !== 'legend') }

        { this.renderTextContent('#field_prefix') }

        { element.element }

        { this.renderTextContent('#field_suffix') }

        { this.renderTextContent('#description', 'after', this.getLabelClass()) }
        { this.renderTextContent('#description', 'isUndefined', (`${this.getLabelClass()} description-after`)) }

        { errors }
      </Wrapper>
    );
  }
}

export default WebformElement;

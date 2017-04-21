import React, { Component, PropTypes } from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
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
      '#states': PropTypes.object,
      '#options': PropTypes.object,
      '#title_display': PropTypes.string,
      '#options_display': PropTypes.string,
      '#admin': PropTypes.bool,
    }).isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    parent: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.object,
    ]),
  };

  static defaultProps = {
    label: false,
    parent: false,
  };

  constructor(props) {
    super(props);

    this.key = props.field['#webform_key'];

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);

    Object.assign(rules, {
      [`${supportedActions.required}_${this.key}`]: {
        rule: value => value.toString().trim() !== '',
        hint: value =>
          <RuleHint key={`req_${this.key}`} hint={props.field['#requiredError'] || 'This field is required'} tokens={{ value }} />,
        shouldValidate: field => field.isBlurred,
      },
    });

    const pattern = props.field['#pattern'];
    if(pattern) {
      Object.assign(rules, {
        [`pattern_${this.key}`]: {
          rule: (value = '') => new RegExp(pattern).test(value) || value.toString().trim() === '',
          hint: value =>
            <RuleHint key={`pattern_${this.key}`} hint={props.field['#patternError'] || 'The value :value doesn\'t match the right pattern'} tokens={{ value }} />,
          shouldValidate: field => field.isBlurred && field.getValue().toString().trim() !== '',
        },
      });
    }

    this.state = {
      errors: [],
    };

    Object.assign(this.state, defaultStates(props.field));
  }

  componentDidMount() {
    if(this.getFormElementComponent() && !this.props.field['#admin']) {
      this.props.formStore.createField(this, this.key, this.props.field, this.validate());

      if(this.state[supportedActions.required]) {
        this.props.formStore.formProperties.hasRequiredFields = true;
      }

      this.setState({ validations: this.getValidations() });
    }
  }

  onChange(e) {
    // update store value for field
    const value = e.target ? e.target.value : e; // Check if 'e' is event, or direct value
    const field = this.getField();
    if(!field) {
      return false;
    }
    field.setStorage({ value });
    this.validate();
    this.props.formStore.checkConditionals();
    return true;
  }

  onBlur() {
    this.getField().setStorage({ isBlurred: true });
    this.validate();
  }

  getField(key = this.key) {
    return this.props.formStore.getField(key);
  }

  getFormElementComponent() {
    const element = components[this.props.field['#type']] || components.default;
    return element || false;
  }

  getFormElement() {
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
        />,
      };
    }
    return false;
  }

  getValidations() {
    const element = this.getFormElement();

    const validations = [
      getNested(() => this.state[supportedActions.required]) ? `${supportedActions.required}_${this.key}` : null,
      getNested(() => this.props.field['#pattern']) ? `pattern_${this.key}` : null,
    ];

    const populatedValidations = validations.map(validation => rules[validation] || null);

    populatedValidations.push(...getNested(() => element.class.meta.validations.map(validation => validation(this) || null), []));

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
    return 'label-display-inline';
  }

  checkConditionals() {
    const newState = checkConditionals(this.props.formStore, this.key, this.state);
    if(newState) {
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

    const fails = validations ? validations.filter((validation) => {
      if(force || !validation.shouldValidate || validation.shouldValidate(field)) {
        return !validation.rule(this.getValue());
      }
      return false;
    }) : [];

    const errors = fails.map(rule => rule.hint(this.getValue()));
    const valid = errors.length === 0;

    // if(!valid) {
    //   const log = valid ? console.info : console.warn;
    //   log(this.key, '=> is', valid ? 'valid' : 'invalid');
    // }

    field.setStorage({ valid });

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

  isSuccess() {
    return this.shouldValidate() && this.isValid();
  }

  renderTextContent(selector, checkValue = false, addClass = '') {
    const value = this.props.field[getNested(() => this.getFormElement().class.meta.field_display[selector], selector)]; // Value in #description field
    const displayValue = this.props.field[`${selector}_display`];
    const cssClass = `${selector.replace(/#/g, '').replace(/_/g, '-')}${checkValue ? `-${checkValue}` : ''}`; // '#field_suffix' and 'suffix' become .field--suffix-suffix

    if(!value || (!!checkValue && checkValue !== displayValue)) {
      if(!(!displayValue && checkValue === 'isUndefined')) {
        return false;
      }
    }

    const className = `${addClass} ${styles[cssClass] ? cssClass : ''}`;

    return (<span styleName={className}>{value}</span>);
  }

  renderFieldLabel(element, show = true) {
    /* if the label is a legend, it is supposed to be the first child of the fieldset wrapper.*/

    if(this.props.field['#title'] && show) {
      return (
        <Wrapper
          component={getNested(() => element.class.meta.label, <label htmlFor={this.key} />)}
          styleName={`label ${this.getLabelClass()}`}
        >
          {this.props.field['#title']}
          {this.state[supportedActions.required] ? (<small>*</small>) : null}
        </Wrapper>
      );
    }

    return '';
  }

  render() {
    const element = this.getFormElement();
    if(!element) {
      return null;
    }

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

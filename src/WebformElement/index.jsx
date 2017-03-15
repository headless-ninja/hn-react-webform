import React from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import { entries } from '../utils';
import { components } from '../index';
import FormStore from '../Webform/FormStore';
import rules from '../Webform/rules';
import styles from './styles.pcss';
import RuleHint from '../RuleHint';
import Wrapper from '../Wrapper';

@CSSModules(styles, { allowMultiple: true })
class WebformElement extends React.Component {
  static propTypes = {
    field: React.PropTypes.shape({
      '#type': React.PropTypes.string.isRequired,
      '#default_value': React.PropTypes.string,
      '#webform_key': React.PropTypes.string.isRequired,
      '#required': React.PropTypes.bool,
      '#pattern': React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.instanceOf(RegExp),
      ]),
      '#validationError': React.PropTypes.string,
      '#patternError': React.PropTypes.string,
      '#title': React.PropTypes.string,
      '#states': React.PropTypes.object,
      '#options': React.PropTypes.object,
    }).isRequired,
    formStore: React.PropTypes.instanceOf(FormStore).isRequired,
    label: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element,
      React.PropTypes.bool]),
  };

  static defaultProps = {
    label: false,
  };

  static checkConditionType(condition, state, states) {
    switch(state) {
      case 'visible':
        states.visible = condition;
        break;
      case 'invisible':
        states.visible = !condition;
        break;
      case 'enabled':
        states.enabled = condition;
        break;
      case 'disabled':
        states.enabled = !condition;
        break;
      case 'required':
        states.required = condition;
        break;
      case 'optional':
        states.required = !condition;
        break;
      default:
        break;
    }
  }

  constructor(props) {
    super(props);

    this.key = props.field['#webform_key'];
    this.element = {};

    this.onChange = this.onChange.bind(this);

    Object.assign(rules, {
      required: {
        rule: value => value.toString().trim() !== '',
        hint: value =>
          <RuleHint key={`req_${this.key}`} hint={props.field['#validationError'] || 'This field is required'} tokens={{ value }} />,
      },
    });

    const pattern = props.field['#pattern'];
    if(pattern) {
      Object.assign(rules, {
        [`pattern_${this.key}`]: {
          rule: (value = '') => new RegExp(pattern).test(value),
          hint: value =>
            <RuleHint key={`pattern_${this.key}`} hint={props.field['#patternError'] || 'The value :value doesn\'t match the right pattern'} tokens={{ value }} />,
        },
      });
    }

    this.state = {
      visible: true,
      required: props.field['#required'] || false,
      enabled: true,
      errors: [],
      validations: this.getValidations(),
    };
  }

  componentDidMount() {
    this.props.formStore.fields.push({
      id: this.key,
      value: this.props.field['#default_value'] || '',
      valid: this.validate(),
    });
  }

  componentWillReceiveProps() {
    this.checkConditionals();
  }

  onChange(e) {
    // update store value for field
    const value = e.target ? e.target.value : e; // Check if 'e' is event, or direct value
    this.setFieldStorage({ value });
    this.validate();
  }

  getFormElement() {
    const element = getNested(() => components[this.props.field['#type']]);
    if(element) {
      const Component = element;
      return (
        <Component
          value={this.getValue()}
          name={this.key}
          onChange={this.onChange}
          field={this.props.field}
          store={this.formStore}
          validations={this.state.validations}
          webformElement={this}
          ref={component => this.element = component}
        />);
    }

    return false;
  }

  getValidations() {
    const validations = [
      getNested(() => this.props.field['#required']) ? 'required' : null,
      getNested(() => this.props.field['#pattern']) ? `pattern_${this.key}` : null,
    ];

    const populatedValidations = validations
      .map(validation => rules[validation] || null)
      .filter(v => v !== null);

    return populatedValidations;
  }

  getValue(key = this.key) {
    return this.getFieldStorage('value', key);
  }

  getFieldStorage(fields = false, key = this.key) {
    const field = this.props.formStore.fields.find(x => x.id === key);

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

  setFieldStorage(patch, key = this.key) {
    const index = this.props.formStore.fields.findIndex(x => x.id === key);
    if(index !== false) {
      const fields = this.props.formStore.fields;
      const field = fields[index];
      fields[index] = Object.assign({}, field, patch);
    }
  }

  getLabelClass() {
    const labelClass = `display-${this.props.field['#title_display']}`;
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  checkConditionals() {
    const states = {
      visible: this.state.visible,
      enabled: this.state.enabled,
      required: this.state.required,
    };

    const fieldStates = getNested(() => this.props.field['#states']);

    // EXAMPLE
    /*
     "#states": {
     "visible": {
     ":input[name=\"checkbox\"]": {
     "checked": true
     }
     },
     "required": {
     ":input[name=\"checkbox\"]": {
     "checked": true
     }
     }
     }
     Above states that the field with this #states prop:
     - is visible when the checkbox 'checkbox' is checked
     - is required when the checkbox 'checkbox' is checked
     */

    if(fieldStates) {
      // loop through #states.
      for(const [fieldStateKey /* e.g. 'visible' */, fieldState] of entries(fieldStates)) {
        // fieldState is an object when there is a single condition, otherwise an array. Make sure that it is always an array.
        const conditions = Array.isArray(fieldState) ? fieldState : [fieldState];
        // loop through conditions.
        conditions.forEach((condition) => {
          for(const [dependencyKey /* e.g. ':input[name="checkbox"]' */, dependency] of entries(condition)) {
            const dependencyValueSelector = getNested(() => dependencyKey.match(/name="((\S)*)"/)[1]); // Get key part from name, so ':input[name="checkbox"]' becomes 'checkbox'.
            // Get current value of dependency 'checkbox'
            const dependencyValue = getNested(() => this.getValue(dependencyValueSelector));

            // See what the action of the condition should be.
            switch(Object.keys(dependency)[0]) {
              case 'filled':
                WebformElement.checkConditionType(dependencyValue.toString().trim() !== '', fieldStateKey, states);
                break;
              case 'empty':
                WebformElement.checkConditionType(dependencyValue.toString().trim() === '', fieldStateKey, states);
                break;
              case 'checked':
                // When dependencyValue is true, then it is checked.
                WebformElement.checkConditionType(dependencyValue === true, fieldStateKey, states);
                break;
              case 'unchecked':
                // When dependencyValue is true, then it is checked.
                WebformElement.checkConditionType(dependencyValue !== true, fieldStateKey, states);
                break;
              case 'expanded': // TODO
                break;
              case 'collapsed': // TODO
                break;
              case 'value':
                // Check if value matches condition
                WebformElement.checkConditionType(dependencyValue === dependency.value, fieldStateKey, states);
                break;
              default:
                break;
            }
          }
        });
      }

      // doesn't work if there are multiple checks!
      this.setState({
        visible: states.visible,
        enabled: states.enabled,
        required: states.required,
      });
    }
  }

  isValid(key = this.key) {
    return this.getFieldStorage('valid', key);
  }

  validate() {
    const validations = this.state.validations;

    const fails = validations.filter(validation => !validation.rule(this.getValue()));

    const errors = fails.map(rule => rule.hint(this.getValue()));
    const valid = errors.length === 0;

    console.log(this.key, '=> is', valid ? 'valid' : 'invalid');

    this.setFieldStorage({ valid });
    this.setState({ errors });

    return valid;
  }

  renderTextContent(selector, checkValue = false) {
    const value = this.props.field[selector]; // Value in #description field
    const displayValue = this.props.field[`${selector}_display`];
    const cssClass = `${selector.replace(/#/g, '').replace(/_/g, '-')}${checkValue ? `-${checkValue}` : ''}`; // '#field_suffix' and 'suffix' become .field--suffix-suffix

    if(!value || (!!checkValue && checkValue !== displayValue)) {
      return false;
    }
    return (<span styleName={styles[cssClass] ? cssClass : ''}>{value}</span>);
  }

  render() {
    const element = this.getFormElement();
    if(!element) {
      return null;
    }
    return (
      <Wrapper component={this.element.wrapper || 'div'} styleName='formrow'>
        { this.renderTextContent('#description', 'before') }

        <Wrapper
          component={this.element.label || 'label'}
          htmlFor={this.key}
          styleName={this.getLabelClass()}
        >
          {this.props.label || this.props.field['#title']}
        </Wrapper>

        { this.renderTextContent('#field_prefix') }

        { element }

        { this.renderTextContent('#field_suffix') }

        { this.renderTextContent('#description', 'after') }

        <ul>
          {this.state.errors}
        </ul>
      </Wrapper>
    );
  }
}

export default WebformElement;

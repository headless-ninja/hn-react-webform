import React from 'react';
import getNested from 'get-nested';
import classNames from 'classnames';
import { entries } from '../utils';
import { components } from '../index';
import FormStore from '../Webform/FormStore';
import rules from '../Webform/rules';
import cssstyles from './styles.css';

const styles = {};

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

    this.onChange = this.onChange.bind(this);

    this.state = {
      visible: true,
      required: props.field['#required'] || false,
      enabled: true,
      error: '',
    };

    Object.assign(rules, {
      required: {
        rule: value => value.toString().trim(),
        hint: () => <span className='form-error is-visible'>Required</span>,
      },
    });

    const pattern = props.field['#pattern'];
    if(pattern) {
      Object.assign(rules, {
        [`pattern_${this.key}`]: {
          rule: (value = '') => new RegExp(pattern).test(value),
          hint: value =>
            <span className='form-error is-visible'>
              <strong>{value}</strong> heeft niet het goede formaat ({props.field['#validationError'] || pattern})
            </span>,
        },
      });
    }
  }

  componentDidMount() {
    this.props.formStore.fields.push({
      id: this.key,
      value: this.props.field['#default_value'] || '',
    });
  }

  componentWillReceiveProps() {
    this.checkConditionals();
  }

  onChange(e, event = true) {
    // update store value for field
    const value = event ? e.target.value : e;
    const field = this.props.formStore.fields.find(x => x.id === this.key);
    if(field) {
      field.value = value;
    }
  }

  getElementObject() {
    return getNested(() => components[this.props.field['#type']]);
  }

  getFormElement() {
    const element = this.getElementObject();
    if(element) {
      const Component = element;
      return (
        <Component
          value={this.state.value}
          name={this.key}
          onChange={this.onChange}
          defaultProps={element.defaultProps}
          field={this.props.field}
          store={this.formStore}
          validations={this.getValidations()}
        />);
    }
    return false;
  }

  getValidations() {
    const validations = [
      getNested(() => this.props.field['#required']) ? 'required' : null,
      getNested(() => this.props.field['#pattern']) ? `pattern_${this.key}` : null,
    ];
    const element = this.getElementObject();
    if(element) {
      validations.push(...getNested(() => element.defaultProps.validations, []));
    }
    return validations.filter(v => v !== null);
  }

  getValue(key = this.key) {
    const fields = this.props.formStore.fields;
    const element = fields.find(x => x.id === key);
    if(element) {
      return element.value;
    }

    return false;
  }

  hasErrors() {
    return this.validate();
  }

  // conditional logic
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

  validate() {
    return this.props.validations.reduce((prev, validation) => validation.rule(this.state.value) || prev, false);
  }

  render() {
    const element = this.getFormElement();
    // const validations = this.getValidations();
    return (
      <div>
        <label htmlFor={this.key} className={classNames({ [styles.hidden]: !this.state.visible })}>
          {this.props.label || this.props.field['#title']}
          {element}
          {!element &&
          <input
            type='text'
            onChange={this.onChange}
            value={this.getValue()}
            name={this.key}
            id={this.key}
          />
          }
        </label>
        <span className="error">
          {this.state.error}
        </span>
      </div>
    );
  }
}

export default WebformElement;

import React from 'react';
import Validation from 'react-validation';
import getNested from 'get-nested';
import classNames from 'classnames';
import { entries } from '../utils';
import { components } from '../index';
import FormStore from '../Webform/formStore';

const styles = {};

class FormElementComponent extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);


    this.state = {
      // value: props.props['#default_value'] || '',
      // value: 'example@example.com' || '',
      value: 'Example text',
      visible: true, // TODO: base on props
      required: true, // TODO: base on props
      enabled: true, // TODO: base on props
    };


    const pattern = getNested(() => props.props['#pattern']);

    Validation.rules = Object.assign(Validation.rules, {
      required: {
        rule: value => value.toString().trim(),
        hint: value => <span className="form-error is-visible">Required</span>,
      },
      [`pattern_${props.name}`]: {
        rule: (value = '') => new RegExp(pattern).test(value),
        hint: value =>
          <span className="form-error is-visible"><strong>{value}</strong> doesn't match the right format. ({pattern})</span>,
      },
    });
  }

  componentDidMount() {
    this.props.store.fields.push({
      id: this.props.name,
      value: this.state.value,
    });
  }

  componentWillReceiveProps() {
    this.checkConditionals();
  }

  checkConditionals() {
    // conditional logic
    const states = {
      visible: this.state.visible,
      enabled: this.state.enabled,
      required: this.state.required,
    };

    const fieldStates = getNested(() => this.props.props['#states']);

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

    if (fieldStates) {
      // loop through #states.
      for (const [fieldStateKey /* e.g. 'visible' */, fieldState] of entries(fieldStates)) {
        // loop through conditions.
        const conditions = Array.isArray(fieldState) ? fieldState : [fieldState]; // fieldState is an object when there is a single condition, otherwise an array. Make sure that it is always an array.
        conditions.forEach((condition) => {
          for (const [dependencyKey /* e.g. ':input[name="checkbox"]' */, dependency] of entries(condition)) {
            const dependencyValueSelector = getNested(() => dependencyKey.match(/name="((\S)*)"/)[1]); // Get name part from key, so ':input[name="checkbox"]' becomes 'checkbox'.
            const dependencyValue = getNested(() => this.props.store.fields.find(x => x.id === dependencyValueSelector).value); // Get current value of dependency 'checkbox'

            // See what the action of the condition should be.
            switch (Object.keys(dependency)[0]) {
              case 'filled':
                this.checkConditionType(dependencyValue.toString().trim() !== '', fieldStateKey, states);
                break;
              case 'empty':
                this.checkConditionType(dependencyValue.toString().trim() === '', fieldStateKey, states);
                break;
              case 'checked':
                this.checkConditionType(dependencyValue === true, fieldStateKey, states); // When value is true, then it is checked.
                break;
              case 'unchecked':
                this.checkConditionType(dependencyValue !== true, fieldStateKey, states); // When value is true, then it is checked.
                break;
              case 'expanded': // TODO
                break;
              case 'collapsed': // TODO
                break;
              case 'value':
                this.checkConditionType(dependencyValue === dependency.value, fieldStateKey, states); // Check if value matches condition/
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

  checkConditionType(condition, state, states) {
    switch (state) {
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
        states.requried = condition;
        break;
      case 'optional':
        states.requried = !condition;
        break;
    }
  }

  getElementObject() {
    const type = getNested(() => this.props.props['#type']);
    if (type && components.hasOwnProperty(type)) {
      return components[type];
    }
    return false;
  }

  getFormElement() {
    const element = this.getElementObject();
    if (element) {
      const Component = element;
      return (<Component
        key={this.props.name}
        value={this.state.value}
        name={this.props.name}
        onChange={this.onChange}
        defaultProps={element.defaultProps}
        props={this.props.props}
        store={this.store}
        validations={this.getValidations()}
        settings={this.props.settings}
      />);
    }
    return false;
  }

  getValidations() {
    const validations = [
      getNested(() => this.props.props['#required']) ? 'required' : null,
      getNested(() => this.props.props['#pattern']) ? `pattern_${this.props.name}` : null,
    ];
    const element = this.getElementObject();
    if (element) {
      validations.push(...getNested(() => element.defaultProps.validations, []));
    }
    return validations.filter(v => v !== null);
  }

  onChange(e, event = true) {
    // update store value for field
    const value = event ? e.target.value : e;
    const field = this.props.store.fields.find(x => x.id == this.props.name);
    if (field) {
      field.value = value;
    }

    this.setState({ value });
  }

  render() {
    const element = this.getFormElement();
    const validations = this.getValidations();
    return (
      <div className={styles.formElement}>
        <label className={classNames({ [styles.hidden]: !this.state.visible })}>
          {this.props.label || this.props.props['#title']}
          {element}
          {!element &&
          <Validation.components.Input onChange={this.onChange} value={this.state.value} name={this.props.name} validations={validations} />
          }
        </label>
      </div>
    );
  }
}

FormElementComponent.propTypes = {
  props: React.PropTypes.shape({
    '#default_value': React.PropTypes.string,
  }).isRequired,
  store: React.PropTypes.instanceOf(FormStore),
  label: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
  name: React.PropTypes.string.isRequired,
  validations: React.PropTypes.array,
};

export default FormElementComponent;

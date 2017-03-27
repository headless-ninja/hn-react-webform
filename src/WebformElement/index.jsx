import React from 'react';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import { components } from '../index';
import FormStore from '../Webform/FormStore';
import rules from '../Webform/rules';
import styles from './styles.pcss';
import RuleHint from '../RuleHint';
import Wrapper from '../Wrapper';
import { checkConditionals, supportedStates } from '../Webform/conditionals';

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
      '#required_error': React.PropTypes.string,
      '#patternError': React.PropTypes.string,
      '#title': React.PropTypes.string,
      '#states': React.PropTypes.object,
      '#options': React.PropTypes.object,
      '#title_display': React.PropTypes.string,
      '#options_display': React.PropTypes.string,
    }).isRequired,
    formStore: React.PropTypes.instanceOf(FormStore).isRequired,
  };

  static defaultProps = {
    label: false,
  };

  constructor(props) {
    super(props);

    this.key = props.field['#webform_key'];

    this.onChange = this.onChange.bind(this);

    Object.assign(rules, {
      required: {
        rule: value => value.toString().trim() !== '',
        hint: value =>
          <RuleHint key={`req_${this.key}`} hint={props.field['#required_error'] || 'This field is required'} tokens={{ value }} />,
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
      [supportedStates.visible]: true,
      [supportedStates.required]: props.field['#required'] || false,
      [supportedStates.enabled]: true,
      errors: [],
    };

    this.state.validations = this.getValidations();
  }

  componentDidMount() {
    if(this.getFormElementComponent()) {
      this.props.formStore.createField(this, this.key, this.props.field);

      if(this.state.required) {
        this.props.formStore.formProperties.hasRequiredFields = true;
      }
    }
  }

  onChange(e) {
    // update store value for field
    const value = e.target ? e.target.value : e; // Check if 'e' is event, or direct value
    this.getField().setStorage({ value });
    this.validate();
  }

  getField(key = this.key) {
    return this.props.formStore.getField(key);
  }

  getFormElementComponent() {
    const element = components[this.props.field['#type']];
    return element || false;
  }

  getFormElement() {
    const Component = this.getFormElementComponent();
    if(Component) {
      return {
        class: Component,
        element: <Component
          value={this.getValue()}
          name={this.key}
          onChange={this.onChange}
          field={this.props.field}
          store={this.formStore}
          validations={this.state.validations}
          webformElement={this}
        />,
      };
    }
    return false;
  }

  getValidations() {
    const validations = [
      getNested(() => this.state.required) ? 'required' : null,
      getNested(() => this.props.field['#pattern']) ? `pattern_${this.key}` : null,
    ];

    const populatedValidations = validations
      .map(validation => rules[validation] || null)
      .filter(v => v !== null);

    return populatedValidations;
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
    } else if(styles['label-display-inline']) {
      return 'label-display-inline';
    }
    return '';
  }

  checkConditionals() {
    const newState = checkConditionals(this.props.formStore, this.key, this.state);
    if(newState) {
      this.setState(newState, () => this.setState({ validations: this.getValidations() }));
    }
  }

  isValid(key = this.key) {
    const field = this.getField(key);
    if(!field) {
      return false;
    }
    return field.getStorage('valid');
  }

  validate() {
    const validations = this.state.validations;

    const fails = validations.filter(validation => !validation.rule(this.getValue()));

    const errors = fails.map(rule => rule.hint(this.getValue()));
    const valid = errors.length === 0;

    // const log = valid ? console.info : console.warn;
    // log(this.key, '=> is', valid ? 'valid' : 'invalid');

    this.getField().setStorage({ valid });
    this.setState({ errors });

    this.props.formStore.checkConditionals();

    return valid;
  }

  renderTextContent(selector, checkValue = false, addClass = '') {
    const value = this.props.field[getNested(() => this.getFormElement().class.meta.field_display[selector], selector)]; // Value in #description field
    const displayValue = this.props.field[`${selector}_display`];
    var cssClass = `${selector.replace(/#/g, '').replace(/_/g, '-')}${checkValue ? `-${checkValue}` : ''}`; // '#field_suffix' and 'suffix' become .field--suffix-suffix

    if(!value || (!!checkValue && checkValue !== displayValue)) {
        if(false === (!displayValue && checkValue === 'isUndefined')) {
          return false;
        }
    }

    cssClass = styles[cssClass] ? cssClass : '';
    addClass += ' ' + cssClass;

    return (<span styleName={addClass}>{value}</span>);
  }

  render() {
    const element = this.getFormElement();
    if(!element) {
      return null;
    }

    return (
      <Wrapper
        component={getNested(() => element.class.meta.wrapper, <div />)}
        styleName={`formrow ${!this.state.visible ? 'hidden' : ''}`}
      >
        { this.renderTextContent('#description', 'before') }

        <Wrapper
          component={getNested(() => element.class.meta.label, <label htmlFor={this.key} />)}
          styleName={this.getLabelClass()}
        >
          {this.props.field['#title']}
          {this.state.required ? (<small>*</small>) : null}
        </Wrapper>

        { this.renderTextContent('#field_prefix') }

        { element.element }

        { this.renderTextContent('#field_suffix') }

        { this.renderTextContent('#description', 'after', this.getLabelClass()) }
        { this.renderTextContent('#description', 'isUndefined', (this.getLabelClass() + ' description-after')) }

        { this.state.errors.length > 0 ? (<ul role='alert'> {this.state.errors} </ul>) : null }

      </Wrapper>
    );
  }
}

export default WebformElement;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getNested from 'get-nested';
import CSSModules from 'react-css-modules';
import { observer } from 'mobx-react';
import Parser, { template } from '../Parser';
import FormStore from '../Observables/Form';
import styles from './styles.pcss';
import Wrapper from '../Wrapper';
import Hidden from '../Hidden';
import { supportedActions } from '../Webform/conditionals';

@observer
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
      composite_elements: PropTypes.array,
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
    webformSettings: PropTypes.shape().isRequired,
    webformPage: PropTypes.string,
    form: PropTypes.shape({
      settings: PropTypes.object.isRequired,
    }).isRequired,
    status: PropTypes.string.isRequired,
  };

  static defaultProps = {
    label: false,
    parent: false,
    onChange: () => {
    },
    onBlur: () => {
    },
    webformPage: 'none',
  };

  constructor(props) {
    super(props);

    this.key = props.field['#webform_key'];

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);

    /**
     * @deprecated Don't use state! Use the store.
     */
    this.state = {
      // errors: [],
    };
    /**
     * @deprecated
     */
    this.setState = this.setState;

    // Object.assign(this.state, defaultStates(props.field));
  }

  onChange(e) {
    const field = this.getField();

    // First, check if this field has a value (e.g. fieldsets don't)
    const meta = field.componentClass.meta || {};
    const hasValue = meta.hasValue;
    if(typeof hasValue === 'undefined' || hasValue) {
      // Get the value
      const value = (e && e.target) ? e.target.value : e; // Check if 'e' is event, or direct value

      field.value = value;
    }

    this.props.onChange(e);

    return true;
  }

  onBlur(e) {
    const field = this.getField();

    // First, check if this field has a value (e.g. fieldsets don't)
    const meta = field.componentClass.meta || {};
    const hasValue = meta.hasValue;
    if(typeof hasValue === 'undefined' || hasValue) {
      // Update the field storage to set it to blurred.
      field.isBlurred = true;
    }

    this.props.onBlur(e);
  }

  /**
   * @returns {Field}
   */
  getField(key = this.key) {
    return this.props.formStore.getField(key);
  }

  getFormElement() {
    if(!this.shouldRender()) {
      return false;
    }

    const ElementComponent = this.getField().componentClass;
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
          webformSettings={this.props.webformSettings}
          state={this.getField()}
          webformPage={this.props.webformPage}
          status={this.props.status}
          form={this.props.form}
        />,
      };
    }
    return false;
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

    const elementClass = this.getField().componentClass;
    return `label-display-${getNested(() => elementClass.meta.labelVisibility, 'inline')}`;
  }

  /**
   * @deprecated
   * Just use this.getField().valid
   *
   * @param key
   * @returns {boolean}
   */
  isValid(key = this.key) {
    const field = this.getField(key);
    if(!field) {
      return true;
    }
    return field.valid;
  }

  isVisible() {
    return this.state[supportedActions.visible] && getNested(() => this.props.parent.isVisible(), true);
  }

  /**
   * @deprecated
   * Just use this.getField().isBlurred
   */
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
    // If it is an admin only field, don't render.
    if(this.props.field['#admin']) {
      return false;
    }

    // Check if it is an composite element
    const children = (this.props.field.composite_elements || []).filter(e => !e['#admin']);

    // If it is, check if there is any child that's visible or of type Hidden.
    if(children.length && !children
        .map(c => this.getField(c['#webform_key']))
        .find(f => f.visible && f.componentClass !== Hidden)
    ) {
      // If there isn't any, don't render.
      return false;
    }

    // If all tests are passed, render.
    return true;
  }

  isSuccess() {
    return this.getField().isBlurred && this.isValid();
  }

  renderTextContent(selector, checkValue = false, addClass = '', show = true) {
    if(show) {
      const value = this.props.field[getNested(() => this.getField().componentClass.meta.field_display[selector], selector)]; // Value in #description field
      const displayValue = this.props.field[`${selector}_display`];
      const cssClass = `${selector.replace(/#/g, '').replace(/_/g, '-')}${checkValue ? `-${checkValue}` : ''}`; // '#field_suffix' and 'suffix' become .field--suffix-suffix

      if(!value || (!!checkValue && checkValue !== displayValue)) {
        if(!(!displayValue && checkValue === 'isUndefined')) {
          return false;
        }
      }

      if(!value) {
        // don't output if there's no value
        return false;
      }

      const className = `${addClass} ${styles[cssClass] ? cssClass : ''}`;

      return (<span styleName={className}>{Parser(template(this.props.formStore, value))}</span>);
    }

    return false;
  }

  renderFieldLabel(element, show = true) {
    /* if the label is a legend, it is supposed to be the first child of the fieldset wrapper.*/

    if(this.props.field['#title'] && show) {
      return (
        <Wrapper
          component={getNested(() => element.class.meta.label, <label htmlFor={this.key} />)}
          styleName={`label ${this.getLabelClass()}`}
        >
          {Parser(template(this.props.formStore, this.props.field['#title']))}
          {this.getField().required ? (<small>&nbsp;*</small>) : null}
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

    const errors = this.getField().errors.length > 0 ? (
      <ul role='alert' styleName={`${this.getLabelClass()} validation-message-wrapper`}> {this.getField().errors} </ul>)
      : null;

    return (
      <Wrapper
        component={getNested(() => element.class.meta.wrapper, <div />)}
        styleName='formrow'
        {...!this.getField().visible ? { hidden: true } : {}}
      >
        { this.renderFieldLabel(element, getNested(() => element.class.meta.label.type) === 'legend') }

        { this.renderTextContent('#description', 'before') }
        { this.renderTextContent('#description', 'isUndefined', (`${this.getLabelClass()} description-before`), getNested(() => element.class.meta.label.type) === 'legend') }

        { this.renderFieldLabel(element, getNested(() => element.class.meta.label.type) !== 'legend') }

        { element.element }

        { this.renderTextContent('#description', 'after', this.getLabelClass()) }
        { this.renderTextContent('#description', 'isUndefined', (`${this.getLabelClass()} description-after`), getNested(() => element.class.meta.label.type) !== 'legend') }

        { errors }
      </Wrapper>
    );
  }
}

export default WebformElement;

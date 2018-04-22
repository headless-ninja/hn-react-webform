import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getNested from 'get-nested';
import { observer } from 'mobx-react';
import Parser, { template } from '../Parser';
import FormStore from '../Observables/Form';
import Hidden from '../Hidden';
// styled
import RequiredMarker from './styled/required-marker';
import ValidationMessage from './styled/validation-message';
import TextContent from './styled/text-content';
import Label from './styled/label';
import FormRow from './styled/form-row';

@observer
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

    const ElementComponent = getNested(() => this.getField().componentClass);
    if(ElementComponent) {
      return {
        class: ElementComponent,
        element: (
          <ElementComponent
            {...this.props}
            value={this.getValue()}
            name={this.key}
            onChange={this.onChange}
            onBlur={this.onBlur}
            validations={this.state.validations}
            webformElement={this}
            state={this.getField()}
          />
        ),
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

  getLabelDisplay() {
    const elementClass = this.getField().componentClass;
    return getNested(() => elementClass.meta.labelVisibility) || this.props.field['#title_display'] || 'inline';
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
        .find(f => f && f.visible && f.componentClass !== Hidden)
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
      const field = this.getField().componentClass;
      const value = this.props.field[getNested(() => field.meta.field_display[selector], selector)]; // Value in #description field
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

      return (
        <TextContent
          value={cssClass}
          class={addClass}
          labelDisplay={this.getLabelDisplay()}
          className={`hrw-position-${cssClass} hrw-label-display-${this.getLabelDisplay()}`}
        >
          {Parser(template(this.props.formStore, value))}
        </TextContent>
      );
    }

    return false;
  }

  renderFieldLabel(element, show = true) {
    /* If the label is a legend, it is supposed to be the first child of the fieldset wrapper. */

    if(this.props.field['#title'] && show) {
      const Wrapper = getNested(() => element.class.meta.label) || Label;
      return (
        <Wrapper labelDisplay={this.getLabelDisplay()} htmlFor={this.key} className={`hrw-label hrw-label-display-${this.getLabelDisplay()}`}>
          {Parser(template(this.props.formStore, this.props.field['#title']))}
          {this.getField().required ? (<RequiredMarker>&nbsp;*</RequiredMarker>) : null}
        </Wrapper>
      );
    }

    return null;
  }

  render() {
    if(!this.shouldRender()) {
      return null;
    }

    const element = this.getFormElement();
    if(!element) return null;

    const errors = this.getField().errors.filter(error => error);
    const errorList = errors.length > 0 ? (
      <ValidationMessage role='alert' labelDisplay={this.getLabelDisplay()} className='hrw-validation-message-wrapper'>{errors}</ValidationMessage>
    ) : null;

    const Wrapper = getNested(() => element.class.meta.wrapper) || FormRow;

    return (
      <Wrapper hidden={!this.getField().visible} className='hrw-form-row' {...getNested(() => element.class.meta.wrapperProps)}>
        {this.renderFieldLabel(element, getNested(() => element.class.meta.label.type) === 'legend')}

        {this.renderTextContent('#description', 'before') }
        {this.renderTextContent('#description', 'isUndefined', 'description-before', getNested(() => element.class.meta.label.type) === 'legend')}

        {this.renderFieldLabel(element, getNested(() => element.class.meta.label.type) !== 'legend')}

        {element.element}

        {this.renderTextContent('#description', 'after', this.getLabelDisplay())}
        {this.renderTextContent('#description', 'isUndefined', 'description-after', getNested(() => element.class.meta.label.type) !== 'legend')}

        {errorList}
      </Wrapper>
    );
  }
}

export default WebformElement;

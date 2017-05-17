import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CSSModules from 'react-css-modules';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';
import 'react-day-picker/lib/style.css';
import labelTranslations from './labelTranslations';
import styles from './rdw-date-theme.pcss';
import Fieldset from '../Fieldset';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';
import WebformElement from '../WebformElement';
import Input from '../Input';
import BaseInput from '../BaseInput';

@CSSModules(styles, { allowMultiple: true })
class Date extends Component {
  static meta = {
    validations: [
      el => rules[`date_${el.key}`],
      el => rules[`date_range_${el.key}`],
    ],
  };

  static propTypes = {
    field: PropTypes.shape({
      '#webform_key': PropTypes.string,
      '#default_value': PropTypes.string,
      '#min': PropTypes.string,
      '#max': PropTypes.string,
      '#mask': PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
      ]),
      '#dateError': PropTypes.string,
      '#dateRangeError': PropTypes.string,
      '#dateBeforeError': PropTypes.string,
      '#dateAfterError': PropTypes.string,
      '#title_display': PropTypes.string,
      composite_elements: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
      ]),
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]).isRequired,
    type: PropTypes.string,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
    onChange: PropTypes.func.isRequired,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func.isRequired,
    dateFormat: PropTypes.string,
    settings: PropTypes.shape().isRequired,
    locale: PropTypes.string,
  };

  static defaultProps = {
    locale: 'nl',
    dateFormat: 'DD/MM/YYYY',
    type: 'text',
    onFocus: () => {},
  };

  constructor(props) {
    super(props);

    this.min = Fieldset.getValue(props.field, 'min');
    this.max = Fieldset.getValue(props.field, 'max');

    Object.assign(rules, {
      [`date_${props.field['#webform_key']}`]: {
        rule: (value) => {
          const timestamp = moment(value, props.dateFormat, true);
          return WebformElement.isEmpty(props.field, value) || timestamp.isValid();
        },
        hint: () =>
          <RuleHint key={`date_${props.field['#webform_key']}`} hint={WebformElement.getCustomValue(props.field, 'dateError', props.settings) || 'Please enter a valid date.'} />,
        shouldValidate: field => field.isBlurred && !WebformElement.isEmpty(field, field.getValue()),
      },
    });

    Object.assign(rules, {
      [`date_range_${props.field['#webform_key']}`]: {
        rule: value => WebformElement.isEmpty(props.field, value) || this.calculateDateRange(value).valid,
        hint: (value) => {
          const result = this.calculateDateRange(value);
          let hint;

          switch(result.type) {
            case 'before':
              hint = WebformElement.getCustomValue(props.field, 'dateBeforeError', props.settings) || 'Please enter a date before :max';
              break;
            case 'after':
              hint = WebformElement.getCustomValue(props.field, 'dateAfterError', props.settings) || 'Please enter a date after :min';
              break;
            default:
            case 'range':
              hint = WebformElement.getCustomValue(props.field, 'dateRangeError', props.settings) || 'Please enter a date between :min and :max';
              break;
          }

          return (<RuleHint
            key={`date_range_${props.field['#webform_key']}`} hint={hint} tokens={{
              value,
              min: result.min ? result.min.format(props.dateFormat) : false,
              max: result.max ? result.max.format(props.dateFormat) : false,
            }}
          />);
        },
        shouldValidate: field => field.isBlurred && !WebformElement.isEmpty(field, field.getValue()),
      },
    });

    this.clickedInside = false;

    this.state = {
      showOverlay: false,
      selectedDay: moment(props.value, props.dateFormat, true).isValid() ? moment(props.value, props.dateFormat).toDate() : null,
    };

    this.calculateDisabledDates = this.calculateDisabledDates.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.clickTimeout);
  }

  setRef(ref, el) {
    this[ref] = el;
  }

  getDateRange(result = {}, dateFormat = this.props.dateFormat) {
    const minMoment = moment(this.min, dateFormat, true);
    const maxMoment = moment(this.max, dateFormat, true);

    result.min = minMoment;
    if(!minMoment.isValid()) {
      result.min = moment().add(this.min, 'days');
    }

    result.max = maxMoment;
    if(!maxMoment.isValid()) {
      result.max = moment().add(this.max, 'days');
    }

    return result;
  }

  getLabelPositionClass() {
    const labelClass = this.props.webformElement.getLabelClass();
    if(styles[labelClass]) {
      return labelClass;
    }
    return '';
  }

  calculateDateRange(value) {
    const result = this.getDateRange({
      valid: true,
    });

    const { dateFormat } = this.props;
    const timestamp = moment(value, dateFormat, true);

    if(this.min && this.max) {
      result.type = 'range';
      result.valid = timestamp.isBetween(result.min, result.max);
    } else if(this.min) {
      result.type = 'after';
      result.valid = timestamp.isAfter(result.min);
    } else if(this.max) {
      result.type = 'before';
      result.valid = timestamp.isBefore(result.max);
    }

    return result;
  }

  calculateDisabledDates(day) {
    const result = this.calculateDateRange(moment(day).format(this.props.dateFormat));
    return !result.valid;
  }

  handleInputBlur() {
    const showOverlay = this.clickedInside;

    this.setState({ showOverlay });

    // Force input's focus if blur event was caused by clicking on the calendar.
    if(showOverlay) {
      this.props.onFocus();
    }
  }

  handleInputFocus() {
    this.setState({ showOverlay: true });
  }

  handleInputChange(e) {
    const value = e.target.value;
    const momentDay = moment(value, this.props.dateFormat, true);
    const newValue = momentDay.isValid() ? momentDay.format(this.props.dateFormat) : value;
    const selectedDay = momentDay.isValid() ? momentDay.toDate() : null;
    this.props.onChange(newValue);
    this.setState({ selectedDay },
      () => selectedDay && this.daypicker.showMonth(selectedDay),
    );
  }

  handleContainerMouseDown() {
    this.clickedInside = true;
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event.
    this.clickTimeout = setTimeout(() => this.clickedInside = false, 0);
  }

  handleDayClick(selectedDay) {
    this.props.onChange(moment(selectedDay).format(this.props.dateFormat));
    this.setState({
      selectedDay,
      showOverlay: false,
    });
    this.props.onBlur();
  }

  render() {
    const { value, field } = this.props;

    field['#mask'] = Fieldset.getValue(field, 'mask');

    const inputElement = (
      <Input
        {...this.props}
        field={field}
        type={this.props.type}
      />);

    if(!Fieldset.getValue(field, 'show_picker')) {
      return inputElement;
    }

    const DateInput = (
      <BaseInput
        {...this.props}
        field={field}
        type={this.props.type}
        onChange={this.handleInputChange}
        onFocus={this.handleInputFocus}
        onBlur={this.handleInputBlur}
        value={value}
      />);

    const cssClassesWrapper = `input-wrapper ${this.getLabelPositionClass()}`;

    return (
      <div
        onMouseDown={this.handleContainerMouseDown}
        onBlur={this.handleInputBlur}
        styleName={cssClassesWrapper}
      >
        {DateInput}
        {this.state.showOverlay &&
        <div styleName='overlay-wrapper'>
          <div styleName='overlay'>
            <DayPicker
              ref={el => this.setRef('daypicker', el)}
              initialMonth={this.state.selectedDay || undefined}
              onDayClick={this.handleDayClick}
              selectedDays={this.state.selectedDay}
              locale={this.props.locale}
              localeUtils={MomentLocaleUtils}
              labels={labelTranslations[this.props.locale]}
              enableOutsideDays
              disabledDays={[this.calculateDisabledDates]}
            />
          </div>
        </div>
        }
        <span styleName={`validation-icon ${this.props.webformElement.isSuccess() ? 'validate-success' : ''}`} />
      </div>
    );
  }
}

export default Date;

import { observer } from 'mobx-react';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { site } from 'hn-react';
import MomentLocaleUtils from 'react-day-picker/moment';
import BaseInput from '../BaseInput';
import Fieldset from '../Fieldset';
import Input from '../Input';
import RuleHint from '../RuleHint';
import rules from '../Webform/rules';
import WebformElement from '../WebformElement';
import WebformUtils from '../WebformUtils';
import labelTranslations from './labelTranslations';
// styled
import Wrapper from './styled/wrapper';
import OverlayWrapper from './styled/overlay-wrapper';
import Overlay from './styled/overlay';
import DayPicker from './styled/day-picker';
import ValidationIcon from './styled/validation-icon';

@observer
class Date extends Component {
  static meta = {
    validations: [
      el => `date_${el.key}`,
      el => `date_range_${el.key}`,
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
      '#datepicker': PropTypes.bool,
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
    settings: PropTypes.shape().isRequired,
    locale: PropTypes.string,
  };

  static defaultProps = {
    locale: 'nl',
    type: 'text',
    onFocus: () => {},
  };

  static rewriteValue(value) {
    const date = moment(value, Date.dateFormat, true);
    return date.format('YYYY/MM/DD');
  }

  static dateFormat = 'DD/MM/YYYY';

  constructor(props) {
    super(props);

    this.min = props.field['#min'];
    this.max = props.field['#max'];

    rules.set(`date_${props.field['#webform_key']}`, {
      rule: (value) => {
        const timestamp = moment(value, Date.dateFormat, true);
        return WebformUtils.isEmpty(props.field, value) || timestamp.isValid();
      },
      hint: () =>
        (<RuleHint
          key={`date_${props.field['#webform_key']}`}
          hint={WebformUtils.getCustomValue(props.field, 'dateError', props.settings) || site.t('Please enter a valid date.')}
        />),
      shouldValidate: field => field.isBlurred && !WebformUtils.isEmpty(field, field.getValue()),
    });

    rules.set(`date_range_${props.field['#webform_key']}`, {
      rule: value => WebformUtils.isEmpty(props.field, value) || this.calculateDateRange(value).valid,
      hint: (value) => {
        const result = this.calculateDateRange(value);
        let hint;

        switch(result.type) {
          case 'before':
            hint = WebformUtils.getCustomValue(props.field, 'dateBeforeError', props.settings) || site.t('Please enter a date before {{max}}');
            break;
          case 'after':
            hint = WebformUtils.getCustomValue(props.field, 'dateAfterError', props.settings) || site.t('Please enter a date after {{min}}');
            break;
          default:
          case 'range':
            hint = WebformUtils.getCustomValue(props.field, 'dateRangeError', props.settings) || site.t('Please enter a date between {{min}} and {{max}}');
            break;
        }

        return (<RuleHint
          key={`date_range_${props.field['#webform_key']}`}
          hint={hint}
          tokens={{
            value,
            min: result.min ? result.min.format(Date.dateFormat) : false,
            max: result.max ? result.max.format(Date.dateFormat) : false,
          }}
        />);
      },
      shouldValidate: field => field.isBlurred && !WebformUtils.isEmpty(field, field.getValue()),
    });

    this.clickedInside = false;

    this.state = {
      showOverlay: false,
      selectedDay: moment(props.value, Date.dateFormat, true).isValid() ? moment(props.value, Date.dateFormat).toDate() : null,
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

  getDateRange(result = {}, dateFormat = Date.dateFormat) {
    const minMoment = moment(this.min, dateFormat, true);
    const maxMoment = moment(this.max, dateFormat, true);

    result.min = minMoment;
    if(!minMoment.isValid()) {
      const [amount, unit] = this.min.split(' ');
      result.min = moment().add(amount, unit);
    }

    result.max = maxMoment;
    if(!maxMoment.isValid()) {
      const [amount, unit] = this.max.split(' ');
      result.max = moment().add(amount, unit);
    }

    return result;
  }

  getLabelDisplay() {
    return this.props.webformElement.getLabelDisplay();
  }

  calculateDateRange(value) {
    const result = this.getDateRange({
      valid: true,
    });

    const timestamp = moment(value, Date.dateFormat, true);

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
    const result = this.calculateDateRange(moment(day).format(Date.dateFormat));
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
    const momentDay = moment(value, Date.dateFormat, true);
    const newValue = momentDay.isValid() ? momentDay.format(Date.dateFormat) : value;
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
    this.props.onChange(moment(selectedDay).format(Date.dateFormat));
    this.setState({
      selectedDay,
      showOverlay: false,
    });
    this.props.onBlur();
  }

  render() {
    const { value, field } = this.props;

    field['#mask'] = Fieldset.getValue(field, 'mask');
    if(field['#mask'] === false) {
      field['#mask'] = '99/99/9999';
    }

    if(!field['#datepicker']) {
      return (
        <Input
          {...this.props}
          field={field}
          type={this.props.type}
        />
      );
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
      />
    );

    return (
      <Wrapper
        onMouseDown={this.handleContainerMouseDown}
        onBlur={this.handleInputBlur}
        labelDisplay={this.getLabelDisplay()}
      >
        {DateInput}
        {this.state.showOverlay && (
          <OverlayWrapper>
            <Overlay>
              <DayPicker
                innerRef={el => this.setRef('daypicker', el)}
                initialMonth={this.state.selectedDay || undefined}
                onDayClick={this.handleDayClick}
                selectedDays={this.state.selectedDay}
                locale={this.props.locale}
                localeUtils={MomentLocaleUtils}
                labels={labelTranslations[this.props.locale]}
                enableOutsideDays
                disabledDays={[this.calculateDisabledDates]}
              />
            </Overlay>
          </OverlayWrapper>
        )}
        <ValidationIcon success={this.props.webformElement.isSuccess()} className='hrw-validation-icon' />
      </Wrapper>
    );
  }
}

export default Date;

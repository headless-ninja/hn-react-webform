import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Calendar, DateField } from 'react-date-picker';
// eslint-disable-next-line
import '!style!css!postcss!react-date-picker/index.css';
// eslint-disable-next-line
import '!style!css!postcss!./rdw-date-theme.css';
import Fieldset from '../Fieldset';
import Input from '../Input';
import rules from '../Webform/rules';
import RuleHint from '../RuleHint';

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
      composite_elements: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
      ]),
    }).isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    dateFormat: PropTypes.string,
  };

  static defaultProps = {
    value: moment().locale('nl'),
    dateFormat: 'DD/MM/YYYY',
  };

  constructor(props) {
    super(props);

    this.min = Fieldset.getValue(props.field, 'min');
    this.max = Fieldset.getValue(props.field, 'max');

    Object.assign(rules, {
      [`date_${props.field['#webform_key']}`]: {
        rule: (value) => {
          const timestamp = moment(value, props.dateFormat, true);
          return timestamp.isValid();
        },
        hint: () =>
          <RuleHint key={`date_${props.field['#webform_key']}`} hint={props.field['#dateError'] || 'Please enter a valid date.'} />,
        shouldValidate: field => field.isBlurred && field.getValue().toString().trim() !== '',
      },
    });

    Object.assign(rules, {
      [`date_range_${props.field['#webform_key']}`]: {
        rule: value => this.calculateDateRange(value).valid,
        hint: (value) => {
          const result = this.calculateDateRange(value);
          let hint;

          switch(result.type) {
            case 'before':
              hint = props.field['#dateBeforeError'] || 'Please enter a date before :max';
              break;
            case 'after':
              hint = props.field['#dateAfterError'] || 'Please enter a date after :min';
              break;
            default:
            case 'range':
              hint = props.field['#dateRangeError'] || 'Please enter a date between :min and :max';
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
        shouldValidate: field => field.isBlurred && rules[`date_${props.field['#webform_key']}`].rule(field.getValue()),
      },
    });

    this.state = {
      showPicker: false,
    };
  }

  calculateDateRange(value) {
    const result = {
      valid: true,
    };

    const { dateFormat } = this.props;
    const timestamp = moment(value, dateFormat, true);

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

  render() {
    const field = this.props.field;

    const inputProps = Object.assign({}, this.props);
    inputProps.field['#mask'] = Fieldset.getValue(field, 'mask');
    delete inputProps.onChange;

    const value = this.props.value || moment().locale('nl');

    const inputElement = <Input {...this.props} field={field} />;

    if(!Fieldset.getValue(field, 'show_picker')) {
      return inputElement;
    }

    return (
      // @see: http://zippyui.com/docs/react-date-picker/
      <DateField
        dateFormat={this.props.dateFormat}
        forceValidDate
        updateOnDateClick
        collapseOnDateClick
        showClock={false}
        theme='rdw'
        value={value}
        onChange={this.props.onChange}
        onBlur={this.props.onBlur}
        onCollapse={this.props.onBlur}
        renderInput={(dateInputProps) => {
          delete dateInputProps.className; // Don't inherit module's className.
          const newInputProps = Object.assign({}, dateInputProps, inputProps);
          newInputProps.onBlur = dateInputProps.onBlur;
          return React.cloneElement(inputElement, newInputProps); // Pass all module's props to inputElement.
        }}
      >
        <Calendar
          navigation
          locale='nl'
          highlightWeekends
          highlightToday
          weekDayNames={false}
          weekNumbers={false}
          weekStartDay={1}
          todayButtonText={{
            children: 'Vandaag',
            type: 'button',
          }}
          okButtonText={{
            children: 'OK',
            type: 'button',
          }}
          cancelButtonText={{
            children: 'Annuleren',
            type: 'button',
          }}
          clearButton={false}
        />
      </DateField>
    );
  }
}

export default Date;
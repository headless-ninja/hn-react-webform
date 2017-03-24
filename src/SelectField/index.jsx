import React from 'react';
import Select from 'react-select';
import getNested from 'get-nested';
import '!style!css!postcss!react-select/dist/react-select.css';
import CSSModules from 'react-css-modules';
import { entries } from '../utils';
import styles from './styles.pcss';

/**
 * Select2
 * @source https://github.com/JedWatson/react-select
 */

@CSSModules(styles, { allowMultiple: true })
class SelectField extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.onChange(value, false);
  }

  getLabelPositionClass() {
      const labelClass = `display-${this.props.field['#title_display']}`;
      if(styles[labelClass]) {
          return labelClass;
      }
      return '';
  }

  render() {
    var cssClassesWrapper = 'select-wrapper ' + this.getLabelPositionClass();
    const options = [];
    for(const [optionKey, optionValue] of entries(getNested(() => this.props.field['#options'], {}))) {
      options.push({
        label: optionValue,
        value: optionKey,
      });
    }
    return (
      <div styleName={cssClassesWrapper}>
        <Select
          name={this.props.field['#webform_key']}
          id={this.props.field['#webform_key']}
          value={this.props.value}
          multi={this.props.field['#multiple']}
          options={options}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default SelectField;

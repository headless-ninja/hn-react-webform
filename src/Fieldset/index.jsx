import React from 'react';
import CSSModules from 'react-css-modules';
import WebformElement from '../WebformElement';
import FormStore from '../Webform/FormStore';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
class Fieldset extends React.Component {
  static meta = {
    wrapper: <fieldset data-extendClassName={styles.fieldset} />,
    label: <legend />,
  };

  static propTypes = {
    field: React.PropTypes.shape({
      composite_elements: React.PropTypes.array.isRequired,
      '#options': React.PropTypes.object,
      '#webform_key': React.PropTypes.string.isRequired,
    }).isRequired,
    formStore: React.PropTypes.instanceOf(FormStore).isRequired,
  };

  getFormElements() {
    const formElements = this.props.field.composite_elements;
    return formElements.map(field =>
      <WebformElement
        key={field['#webform_key']}
        field={field}
        formStore={this.props.formStore}
        webform={this}
      />);
  }

  render() {
    const formElements = this.getFormElements();
    return (
      <div role='group'>
        {formElements}
      </div>
    );
  }
}

export default Fieldset;

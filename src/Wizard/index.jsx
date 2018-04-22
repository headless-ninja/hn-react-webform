import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import getNested from 'get-nested';
import WizardProgress from './WizardProgress';
import Fieldset from '../Fieldset';
import BaseButton from '../BaseButton';
import SubmitButton from '../SubmitButton';
import WebformElement from '../WebformElement';
import Webform from '../Webform';
import FormStore from '../Observables/Form';
// styled
import ButtonWrapper from './styled/button-wrapper';
import ButtonNext from './styled/button-next';
import ButtonPrev from './styled/button-prev';

@inject('submit', 'webform')
@observer
class WizardPages extends Component {

  static propTypes = {
    field: PropTypes.shape({
      composite_elements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    form: PropTypes.shape().isRequired,
    status: PropTypes.string.isRequired,
    formStore: PropTypes.instanceOf(FormStore).isRequired,
    submit: PropTypes.func.isRequired,
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
    webform: PropTypes.instanceOf(Webform).isRequired,
    webformSettings: PropTypes.shape().isRequired,
    webformElement: PropTypes.instanceOf(WebformElement).isRequired,
  };

  static defaultProps = {
    onChange: () => {
    },
    onBlur: () => {
    },
  };

  componentDidMount() {
    this.props.webform.onSubmitOverwrite = () => {
      if(this.props.formStore.page === this.props.field.composite_elements[this.props.field.composite_elements.length - 1]['#webform_key']) {
        return true; // Execute normal onSubmit
      }

      this.navigateToNextPage();
      return false;
    };
  }

  componentWillUnmount() {
    delete this.props.webform.onSubmitOverwrite;
  }

  changePage(shift) {
    const pages = this.props.field.composite_elements;
    const pageI = pages.indexOf(pages.find(p => this.props.formStore.page === p['#webform_key']));
    const newPageI = pageI + shift;
    this.props.formStore.page = this.props.field.composite_elements[newPageI]['#webform_key'];
  }

  navigateToNextPage() {
    // Make sure all errors are shown of visible fields.
    this.props.formStore.visibleFieldsOfCurrentPage.forEach(field => field.isBlurred = true);

    // Check if all fields are valid.
    if(this.props.formStore.visibleFieldsOfCurrentPage.every(field => field.valid)) {
      // If all valid, change the page.
      this.changePage(+1);

      // If draft_auto_save is on, submit the page.
      if(getNested(() => this.props.form.settings.draft_auto_save)) {
        this.props.submit({
          in_draft: true,
        });
      }
    }
  }

  render() {
    const pages = this.props.field.composite_elements;
    const pageI = pages.indexOf(pages.find(p => this.props.formStore.page === p['#webform_key']));

    return (
      <div>
        <WizardProgress pages={pages} currentPage={pageI} />
        {pages.map(page => (
          <Fieldset
            {...this.props}
            key={page['#webform_key']}
            field={page}
            style={{ display: (page['#webform_key'] === this.props.formStore.page ? null : 'none') }}
            form={this.props.form}
            webformPage={page['#webform_key']}
            webformElement={this.props.webformElement}
            onChange={this.props.onChange}
            onBlur={this.props.onBlur}
            settings={this.props.settings}
            webformSettings={this.props.webformSettings}
            status={this.props.status}
          />
        ))}
        <ButtonWrapper>
          <ButtonPrev>
            <BaseButton
              onClick={(e) => { e.preventDefault(); this.changePage(-1); }}
              disabled={this.props.formStore.page === pages[0]['#webform_key']}
              label={getNested(() => pages[pageI]['#prev_button_label']) || getNested(() => this.props.form.settings.wizard_prev_button_label) || 'Previous page'}
              primary={false}
            />
          </ButtonPrev>
          <ButtonNext>
            {(this.props.formStore.page === pages[pages.length - 1]['#webform_key'])
              ? (
                <SubmitButton
                  form={this.props.form}
                  formStore={this.props.formStore}
                  status={this.props.status}
                  field={this.props.form.elements.find(element => element['#type'] === 'webform_actions')}
                  show
                />
              )
              : (
                <BaseButton
                  label={getNested(() => pages[pageI]['#next_button_label']) || getNested(() => this.props.form.settings.wizard_next_button_label) || 'Next page'}
                  type='submit'
                />
              )
            }
          </ButtonNext>
        </ButtonWrapper>
      </div>
    );
  }
}

export default WizardPages;

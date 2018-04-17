import fetch from 'fetch-everywhere';
import getNested from 'get-nested';
import GoogleTag from 'google_tag';
import { observer, Provider } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { site } from 'hn-react';
import Forms from '../Observables/Forms';
import Parser from '../Parser';
import SubmitButton from '../SubmitButton';
import ThankYouMessage from './ThankYouMessage';
import WebformElement from '../WebformElement';
import theme from '../styles/theme';
// styled
import StyledWebform from './styled/webform';
import FormTitle from './styled/form-title';
import List from './styled/list';
import ListItem from './styled/list-item';
import Element from './styled/element';

@observer
class Webform extends Component {
  static formStates = {
    DEFAULT: 'DEFAULT',
    SENT: 'SENT',
    ERROR: 'ERROR',
    PENDING: 'PENDING',
    CONVERTED: 'CONVERTED',
  };

  static analyticsEventsCategories = {
    SUCCESSFUL: 'Successful submission',
    ERROR: 'Error during submission',
  };

  static analyticsEventsActions = {
    FORM_SUBMISSION: 'Form Submission',
  };

  static propTypes = {
    settings: PropTypes.shape({
      title: PropTypes.string,
      tracking: PropTypes.oneOfType([
        PropTypes.shape({
          gtm_id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.bool,
          ]),
        }),
        PropTypes.bool,
      ]),
    }).isRequired,
    form: PropTypes.shape({
      form_id: PropTypes.string.isRequired,
      settings: PropTypes.shape({
        nm_gtm_id: PropTypes.string,
        nm_required_hint: PropTypes.string,
        confirmation_message: PropTypes.string,
      }),
      elements: PropTypes.arrayOf(PropTypes.shape({
        '#type': PropTypes.string.isRequired,
      })).isRequired,
      token: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    }).isRequired,
    onSubmit: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    onSubmitFail: PropTypes.func,
    defaultValues: PropTypes.objectOf(PropTypes.string),
    hiddenData: PropTypes.objectOf(PropTypes.string),
    noValidation: PropTypes.bool,
    showThankYouMessage: PropTypes.bool,
    theme: PropTypes.shape(),
  };

  static defaultProps = {
    onSubmit: () => {},
    onSubmitSuccess: () => {},
    onSubmitFail: () => {},
    nm_gtm_id: false,
    settings: {
      tracking: false,
    },
    defaultValues: {},
    hiddenData: {},
    noValidation: true,
    showThankYouMessage: true,
    theme: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      status: Webform.formStates.DEFAULT,
      errors: {},
    };

    this.key = props.form.form_id;

    this.onSubmit = this.onSubmit.bind(this);
    this.submit = this.submit.bind(this);

    this.formStore = this.getFormstore(props);
  }

  componentDidMount() {
    const GTM = getNested(() => this.props.settings.tracking.gtm_id) || this.props.form.settings.nm_gtm_id;

    if(GTM) {
      GoogleTag.addTag(GTM);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.formStore = this.getFormstore(nextProps);
  }

  onSubmit(e) {
    e.preventDefault();

    // If the 'onSubmit' is being overwritten, use that function.
    // If it returns false, don't submit, otherwise continue.
    if(typeof this.onSubmitOverwrite === 'function') {
      const result = this.onSubmitOverwrite(e);
      if(!result) {
        return result;
      }
    }

    // Make sure that all errors are visible by marking all visible fields as blurred.
    this.formStore.visibleFields.forEach((field) => {
      field.isBlurred = true;
    });

    const isValid = this.isValid();
    if(isValid) {
      return this.updateSubmission();
    }
    console.warn('The user tried to submit a form, but not all fields are valid.');

    return true;
  }

  getFormstore(props) {
    return Forms.getForm(props.form.form_id, {
      form: props.form,
      settings: props.settings,
      defaultValues: this.props.defaultValues,
    });
  }

  getFormElements() {
    const formElements = getNested(() => this.props.form.elements, []);
    return formElements.map(field => (
      <WebformElement
        key={field['#webform_key']}
        field={field}
        formStore={this.formStore}
        settings={this.props.form.settings}
        webformSettings={this.props.settings}
        status={this.state.status}
        form={this.props.form}
      />
    ));
  }

  isValid() {
    return this.formStore.valid;
  }

  isMultipage() {
    return getNested(() => this.props.form.elements, []).find(element => element['#webform_key'] === 'wizard_pages') !== undefined;
  }

  resetForm() {
    Forms.deleteForm(this.props.form.form_id);
    this.formStore = this.getFormstore(this.props);
  }

  async updateSubmission() {
    let response = await this.props.onSubmit(this); // Trigger onSubmit hook and store response.
    if(!response || response.submit !== false) { // If onSubmit hook response is false, don't trigger default submit.
      response = await this.submit();
    }

    if(response.status === 200 || response.status === 201) {
      this.response = response;
      this.setState({ status: Webform.formStates.SENT });
      this.props.onSubmitSuccess({
        webform: this,
        response: this.response,
        values: this.formStore.values,
      }); // Trigger onSubmitSuccess hook.
      this.resetForm();
    } else {
      this.setState({
        status: Webform.formStates.ERROR,
        errors: response.message || [],
      });
      this.props.onSubmitFail(this); // Trigger onSubmitFail hook.
    }
  }

  async submit(extraFields = {}) {
    // eslint-disable-next-line no-undef
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.props.form.token,
    });

    const values = Object.assign({}, this.props.hiddenData, this.formStore.values);
    if(!extraFields.in_draft) {
      this.setState({ status: Webform.formStates.PENDING });
    }

    try {
      const response = await fetch(`${site.url}/hn-webform-submission?_format=json`, {
        headers,
        method: 'POST',
        body: JSON.stringify(Object.assign({
          form_id: this.props.form.form_id,
        }, extraFields, values)),
      });
      return response.json();
    } catch(err) {
      console.error(err);
      return null;
    }
  }

  render() {
    if(!this.formStore) return null;
    const formElements = this.getFormElements();
    const multipage = this.isMultipage();

    let requiredHint = null;
    if(
      this.formStore.visibleFields.find(field => field.required) &&
      this.props.form.settings.nm_required_hint
    ) {
      requiredHint = <span>{Parser(this.props.form.settings.nm_required_hint)}</span>;
    }
    const errors = Object.entries(this.state.errors);
    const errorsEl = errors.length > 0 && (
      <List>
        {errors.map(([key, error]) => (
          <ListItem key={key}>
            <Element error>{key.replace(/]\[/g, '.')}: <em>{Parser(error)}</em></Element>
          </ListItem>
        ))}
      </List>
    );

    return (
      <Provider formStore={this.formStore} submit={this.submit} webform={this}>
        <ThemeProvider theme={{ ...theme, ...this.props.theme }}>
          <StyledWebform>
            {this.props.settings.title && (
              <FormTitle>{this.props.settings.title}</FormTitle>
            )}
            {this.state.status !== Webform.formStates.SENT && errorsEl}
            {this.state.status !== Webform.formStates.SENT && (
              <form
                method='POST'
                onSubmit={this.onSubmit}
                name={this.props.form.form_id}
                id={this.props.form.form_id}
                noValidate={this.props.noValidation}
              >
                {requiredHint}
                {formElements}
                {!multipage && (
                  <SubmitButton
                    form={this.props.form}
                    status={this.state.status}
                  />
                )}
              </form>
            )}
            {this.props.showThankYouMessage && this.state.status === Webform.formStates.SENT && (
              <ThankYouMessage message={this.props.form.settings.confirmation_message} />
            )}
          </StyledWebform>
        </ThemeProvider>
      </Provider>
    );
  }
}

export default Webform;

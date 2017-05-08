import React, { Component } from 'react';
import PropTypes from 'prop-types';
import getNested from 'get-nested';
import fetch from 'fetch-everywhere';
import { observer } from 'mobx-react';
import CSSModules from 'react-css-modules';
// import Script from 'react-load-script';
import GoogleTag from 'google_tag';
import FormStore from './FormStore';
import Parser from '../Parser';
import SubmitButton from '../SubmitButton';
import WebformElement from '../WebformElement';
// import ThankYouMessage from '../ThankYouMessage';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
@observer
class Webform extends Component {
  static formStates = {
    DEFAULT: 'DEFAULT',
    SENT: 'SENT',
    ERROR: 'ERROR',
    PENDING: 'PENDING',
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
      cmsBaseUrl: PropTypes.string.isRequired,
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
    defaultValues: PropTypes.objectOf(PropTypes.string.isRequired),
    hiddenData: PropTypes.objectOf(PropTypes.string.isRequired),
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
  };

  static fireAnalyticsEvent() {
    // ReactGA.event(event);
  }

  constructor(props) {
    super(props);

    this.state = {
      status: Webform.formStates.DEFAULT,
      errors: {},
    };

    this.key = props.form.form_id;
    this.formStore = new FormStore(this.key, props.settings, this.props.defaultValues);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.formStore.fields = [];
  }

  componentDidMount() {
    this.formStore.checkConditionals();

    const GTM = getNested(() => this.props.settings.tracking.gtm_id) || this.props.form.settings.nm_gtm_id;

    if(GTM) {
      GoogleTag.addTag(GTM);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.form.form_id !== nextProps.form.form_id) {
      this.formStore = new FormStore(this.key, this.props.settings, this.props.defaultValues);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const isValid = this.isValid();
    if(isValid) {
      return this.updateSubmission();
    }

    return console.warn('One or more fields are invalid...');
  }

  getFormElements() {
    const formElements = getNested(() => this.props.form.elements, []);
    return formElements.map(field =>
      <WebformElement
        key={field['#webform_key']}
        field={field}
        formStore={this.formStore}
        webform={this}
        settings={this.props.form.settings}
        webformSettings={this.props.settings}
      />);
  }

  isValid() {
    return this.formStore.fields.reduce((prev, field) => {
      const component = field.component;
      const isValid = component.validate(true);
      return prev && isValid;
    }, true);
  }

  async updateSubmission() {
    let response = await this.props.onSubmit(this); // Trigger onSubmit hook and store response.
    if(!response || response.submit !== false) { // If onSubmit hook response is false, don't trigger default submit.
      response = await this.submit();
    }

    if(response.status === 200 || response.status === 201) {
      this.setState({ status: Webform.formStates.SENT });
      Webform.fireAnalyticsEvent({
        category: Webform.analyticsEventsCategories.SUCCESSFUL,
        action: Webform.analyticsEventsActions.FORM_SUBMISSION,
      });
      this.props.onSubmitSuccess(this); // Trigger onSubmitSuccess hook.
    } else {
      this.setState({ status: Webform.formStates.ERROR, errors: response.errors || [] });
      Webform.fireAnalyticsEvent({
        category: Webform.analyticsEventsCategories.ERROR,
        action: Webform.analyticsEventsActions.FORM_SUBMISSION,
      });
      this.props.onSubmitFail(this); // Trigger onSubmitFail hook.
    }
  }

  async submit() {
    // eslint-disable-next-line no-undef
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.props.form.token,
    });

    const values = Object.assign({}, this.props.hiddenData);
    this.formStore.fields.forEach((field) => {
      if(field.value.toString().trim() !== '') {
        values[field.key] = field.value;
      }
    });
    this.setState({ status: Webform.formStates.PENDING });
    return fetch(`${this.props.settings.cmsBaseUrl}/api/v1/form?_format=json`, {
      headers,
      method: 'POST',
      body: JSON.stringify(Object.assign({
        form_id: this.props.form.form_id,
      }, values)),
    })
      .then(response => response.json())
      .then(response => ({
        status: response.status || 400,
        errors: response.message || false,
      }))
      .catch(console.error);
  }

  render() {
    const formElements = this.getFormElements();

    let requiredHint = null;
    if(
      this.formStore.formProperties.hasRequiredFields &&
      this.props.form.settings.nm_required_hint
    ) {
      requiredHint = <span>{ Parser(this.props.form.settings.nm_required_hint) }</span>;
    }

    const errors = Object.keys(this.state.errors).map(error =>
      <li key={error}><span styleName='element error'>{ this.state.errors[error] }</span></li>,
    );

    return (
      <div styleName='webform'>
        <h1 styleName='formtitle'>{this.props.settings.title}</h1>
        { this.state.status === Webform.formStates.ERROR && errors}
        { this.state.status !== Webform.formStates.SENT &&
        <form method='POST' onSubmit={this.onSubmit} name={this.props.form.form_id} id={this.props.form.form_id}>
          { requiredHint }
          { formElements }
          <SubmitButton
            form={this.props.form}
            status={this.state.status}
          />
        </form>}
        {/* { this.state.status === Webform.formStates.SENT &&*/}
        {/* <ThankYouMessage message={this.props.form.settings.confirmation_message} /> */}
        {/* }*/}
        {this.props.settings.tracking !== false &&
        <div>
          {/* <Script*/}
            {/* url='//cdn-static.formisimo.com/tracking/js/tracking.js'*/}
            {/* onLoad={() => {*/}
            {/* }}*/}
            {/* onError={() => {*/}
            {/* }}*/}
          {/* />*/}
          {/* <Script*/}
            {/* url='//cdn-static.formisimo.com/tracking/js/conversion.js'*/}
            {/* onLoad={() => {*/}
            {/* }}*/}
            {/* onError={() => {*/}
            {/* }}*/}
          {/* />*/}
        </div>
        }
      </div>
    );
  }
}

export default Webform;

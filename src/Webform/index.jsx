import React from 'react';
import getNested from 'get-nested';
import fetch from 'fetch-everywhere';
import { observer } from 'mobx-react';
import CSSModules from 'react-css-modules';
import ReactGA from 'react-ga';
import FormStore from './FormStore';
import SubmitButton from '../SubmitButton';
import WebformElement from '../WebformElement';
import ThankYouMessage from '../ThankYouMessage';
import styles from './styles.pcss';

@CSSModules(styles, { allowMultiple: true })
@observer
class Webform extends React.Component {
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
    settings: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      postUrl: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.bool,
      ]).isRequired,
      nm_gtm_id: React.PropTypes.string,
    }).isRequired,
    form: React.PropTypes.shape({
      form_id: React.PropTypes.string.isRequired,
      settings: React.PropTypes.object,
      elements: React.PropTypes.arrayOf(React.PropTypes.shape({
        '#type': React.PropTypes.string.isRequired,
      })).isRequired,
      token: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.bool]),
    }).isRequired,
    onSubmit: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.bool,
    ]),
    onAfterSubmit: React.PropTypes.oneOfType([
      React.PropTypes.func,
      React.PropTypes.bool,
    ]),
  };

  static defaultProps = {
    onSubmit: false,
    onAfterSubmit: false,
    nm_gtm_id: false,
  };

  static fireAnalyticsEvent(event) {
    ReactGA.event(event);
  }

  constructor(props) {
    super(props);

    this.state = {
      status: Webform.formStates.DEFAULT,
      errors: {},
    };

    this.key = props.form.settings.form_id;
    this.formStore = new FormStore(this.key);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.formStore.fields = [];
  }

  componentDidMount() {
    this.formStore.checkConditionals();

    if(this.props.form.settings.nm_gtm_id) {
      ReactGA.initialize(this.props.form.settings.nm_gtm_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.form.form_id !== nextProps.form.form_id) {
      this.formStore = new FormStore(this.key);
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
      />);
  }

  isValid() {
    // console.log('Validating...');
    return this.formStore.fields.reduce((prev, field) => {
      const component = field.component;
      const isValid = component.validate(true);
      return prev && isValid;
    }, true);
  }

  async updateSubmission() {
    let response = await (this.props.onSubmit ? this.props.onSubmit(this) : Promise.resolve()); // Trigger onSubmit hook and store response.

    if(response.submit !== false) { // If onSubmit hook response is false, don't trigger default submit.
      response = await this.submit();
    }

    if(response.status === 200) {
      this.setState({ status: Webform.formStates.SENT });
      Webform.fireAnalyticsEvent({
        category: Webform.analyticsEventsCategories.SUCCESSFUL,
        action: Webform.analyticsEventsActions.FORM_SUBMISSION,
      });
    } else {
      this.setState({ status: Webform.formStates.ERROR, errors: response.errors || [] });
      Webform.fireAnalyticsEvent({
        category: Webform.analyticsEventsCategories.ERROR,
        action: Webform.analyticsEventsActions.FORM_SUBMISSION,
      });
    }

    if(this.props.onAfterSubmit) {
      this.props.onAfterSubmit(this); // Trigger onAfterSubmit hook if existing.
    }
  }

  async submit() {
    console.info('submit');
    // eslint-disable-next-line no-undef
    const headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': this.props.form.token,
    });

    const values = {};
    this.formStore.fields.forEach((field) => {
      if(field.value.toString().trim() !== '') {
        values[field.key] = field.value;
      }
    });
    this.setState({ status: Webform.formStates.PENDING });
    return fetch(this.props.settings.postUrl, {
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
    const errors = Object.keys(this.state.errors).map(error =>
      <li key={error}><span styleName='element error'>{ this.state.errors[error] }</span></li>,
    );
    return (
      <div styleName='webform'>
        <h1 styleName='formtitle'>{this.props.settings.title}</h1>
        { this.state.status === Webform.formStates.ERROR && errors}
        { this.state.status !== Webform.formStates.SENT &&
          <form method='POST' onSubmit={this.onSubmit}>
            { this.formStore.formProperties.hasRequiredFields ? (<span>Required fields are marked with <small>*</small></span>) : null }
            {formElements}
            <SubmitButton
              form={this.props.form}
              status={this.state.status}
            />
          </form>}
        { this.state.status === Webform.formStates.SENT &&
          <ThankYouMessage message={this.props.form.settings.confirmation_message} />
        }
      </div>
    );
  }
}

export default Webform;

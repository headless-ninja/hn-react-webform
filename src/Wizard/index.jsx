import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { observer, inject } from 'mobx-react';
import getNested from 'get-nested';
import WizardProgress from './WizardProgress';
import Fieldset from '../Fieldset';
import BaseButton from '../BaseButton';
import SubmitButton from '../SubmitButton';
import styles from './styles.pcss';
import WebformElement from '../WebformElement';
import Webform from '../Webform';

@inject('submit', 'webform')
@observer
@CSSModules(styles)
class WizardPages extends Component {

  static propTypes = {
    field: PropTypes.shape({
      composite_elements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    form: PropTypes.shape({
      settings: PropTypes.object.isRequired,
    }).isRequired,
    status: PropTypes.string.isRequired,
    formStore: PropTypes.shape({
      fields: PropTypes.shape().isRequired,
      isValid: PropTypes.func.isRequired,
    }).isRequired,
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

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      lastPageRendered: 0,
    };
  }

  componentDidMount() {
    this.props.webform.onSubmitOverwrite = () => {
      if(this.state.page === this.props.field.composite_elements.length - 1) {
        return true; // Execute normal onSubmit
      }

      this.navigateToNextPage();
      return false;
    };
  }

  componentWillReceiveProps(props) {
    const pages = props.field.composite_elements;
    pages.forEach((page, pageI) => {
      if(!props.formStore.isValid(page['#webform_key']) && pageI < this.state.page) {
        this.setState({
          page: pageI,
        });
        this.pageIsValid(page['#webform_key']);
      }
    });
  }

  componentWillUnmount() {
    delete this.props.webform.onSubmitOverwrite;
  }

  changePage(shift) {
    const page = this.state.page + shift;
    this.setState({
      page,
      lastPageRendered: (this.state.lastPageRendered > page) ? this.state.lastPageRendered : page,
    });
  }

  pageIsValid(page) {
    const invalid = this.props.formStore.fields.filter(({ component }) => {
      // Only check the current page
      if(component.props.webformPage !== page) return false;

      // Validate the component
      const valid = component.validate(true);

      // If an error was found, return true
      return !valid;
    });

    // If an error was found, return false
    return !invalid.length;
  }

  navigateToNextPage() {
    if(this.pageIsValid(this.props.field.composite_elements[this.state.page]['#webform_key'])) {
      this.changePage(+1);
      if(getNested(() => this.props.form.settings.draft_auto_save)) {
        this.props.submit({
          in_draft: true,
        });
      }
    }
  }

  render() {
    const pages = this.props.field.composite_elements;

    return (
      <div>
        <WizardProgress pages={pages} currentPage={this.state.page} />
        {pages.map((page, pageI) => (
          <Fieldset
            {...this.props}
            key={page['#webform_key']}
            field={page}
            style={{ display: (pageI === this.state.page ? null : 'none') }}
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
        <div styleName='button-wrapper'>
          <div styleName='button-prev'>
            <BaseButton
              onClick={(e) => { e.preventDefault(); this.changePage(-1); }}
              disabled={this.state.page === 0}
              label={getNested(() => pages[this.state.page]['#prev_button_label']) || getNested(() => this.props.form.settings.wizard_prev_button_label) || 'Previous page'}
              isPrimary={false}
            />
          </div>
          <div styleName='button-next'>
            {(this.state.page === pages.length - 1)
              ? <SubmitButton
                form={this.props.form}
                status={this.props.status}
              />
              : <BaseButton
                label={getNested(() => pages[this.state.page]['#next_button_label']) || getNested(() => this.props.form.settings.wizard_next_button_label) || 'Next page'}
                type='submit'
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default WizardPages;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import { observer, inject } from 'mobx-react';
import WizardProgress from './WizardProgress';
import Fieldset from '../Fieldset';
import BaseButton from '../BaseButton';
import SubmitButton from '../SubmitButton';
import styles from './styles.pcss';

@observer
@inject('submit')
@CSSModules(styles)
class WizardPages extends Component {

  static propTypes = {
    field: PropTypes.shape({
      composite_elements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    form: PropTypes.shape({
      settings: PropTypes.object.isRequired,
      field: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
    status: PropTypes.string.isRequired,
    formStore: PropTypes.shape({
      fields: PropTypes.arrayOf(PropTypes.shape()).isRequired,
      isValid: PropTypes.bool,
    }).isRequired,
    submit: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      lastPageRendered: 0,
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
            webformPage={page['#webform_key']}
          />
        ))}
        <div styleName='button-wrapper'>
          <div styleName='button-prev'>
            <BaseButton
              onClick={(e) => { e.preventDefault(); this.changePage(-1); }}
              disabled={this.state.page === 0}
              label='Previous page'
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
                onClick={(e) => {
                  e.preventDefault();
                  if(this.pageIsValid(pages[this.state.page]['#webform_key'])) {
                    this.changePage(+1);
                    this.props.submit({
                      in_draft: true,
                    });
                  }
                }}
                label='Next page'
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default WizardPages;

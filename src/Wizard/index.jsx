import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import WizardProgress from './WizardProgress';
import Fieldset from '../Fieldset';
import BaseButton from '../BaseButton';
import styles from './styles.pcss';

@CSSModules(styles)
class WizardPages extends Component {

  static propTypes = {
    field: PropTypes.shape({
      composite_elements: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  render() {
    const pages = this.props.field.composite_elements;
    const currentPage = pages[this.state.page];

    return (
      <div>
        <WizardProgress pages={pages} currentPage={this.state.page} />
        <Fieldset {...this.props} field={currentPage} />
        <div styleName='button-wrapper'>
          <div styleName='button-prev'>
            <BaseButton
              onClick={() => this.setState({ page: this.state.page - 1 })}
              disabled={this.state.page === 0}
              label='Previous page'
              isPrimary={false}
            />
          </div>
          <div styleName='button-next'>
            <BaseButton
              onClick={() => this.setState({ page: this.state.page + 1 })}
              disabled={this.state.page === pages.length - 1}
              label='Next page'
            />
          </div>
        </div>
      </div>
    );
  }
}

export default WizardPages;

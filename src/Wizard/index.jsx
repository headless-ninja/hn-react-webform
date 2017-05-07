import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WizardProgress from './WizardProgress';
import Fieldset from '../Fieldset';

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
        <p>Progress: {this.state.page + 1}/{pages.length}</p>
        <WizardProgress pages={pages} currentPage={this.state.page} />
        <Fieldset {...this.props} field={currentPage} />
        <button
          onClick={() => this.setState({ page: this.state.page - 1 })}
          disabled={this.state.page === 0}
        >Previous page
        </button>
        <button
          onClick={() => this.setState({ page: this.state.page + 1 })}
          disabled={this.state.page === pages.length - 1}
        >Next page
        </button>
      </div>
    );
  }
}

export default WizardPages;

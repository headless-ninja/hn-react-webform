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
      lastPageRendered: 0,
    };
  }

  changePage(shift) {
    const page = this.state.page + shift;
    this.setState({
      page,
      lastPageRendered: (this.state.lastPageRendered > page) ? this.state.lastPageRendered : page,
    });
  }

  render() {
    const pages = this.props.field.composite_elements;

    return (
      <div>
        <WizardProgress pages={pages} currentPage={this.state.page} />
        {pages.map((page, pageI) => (
          (pageI <= this.state.lastPageRendered)
            ? (
              <Fieldset
                {...this.props}
                key={page['#webform_key']}
                field={page}
                style={{ display: (pageI === this.state.page ? null : 'none') }}
              />
            )
            : null
        ))}
        <div styleName='button-wrapper'>
          <div styleName='button-prev'>
            <BaseButton
              onClick={() => this.changePage(-1)}
              disabled={this.state.page === 0}
              label='Previous page'
              isPrimary={false}
            />
          </div>
          <div styleName='button-next'>
            <BaseButton
              onClick={() => this.changePage(+1)}
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

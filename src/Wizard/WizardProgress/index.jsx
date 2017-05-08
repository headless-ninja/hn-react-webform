import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

function getStepClass(i) {
  const stepClass = `step-${i}`;
  if(styles[stepClass]) {
    return stepClass;
  }
  return '';
}

function WizardProgress({ pages, currentPage }) {
  return (
    <ul styleName='bar'>
      {pages.map((page, i) => {
        let classList = `step ${getStepClass(i + 1)}`;

        switch(true) {
          case i < currentPage:
            classList = `${classList} done`;
            break;
          case i === currentPage:
            classList = `${classList} active`;
            break;
          default:
          //   classList = `${classList} todo`;
            break;
        }

        return (
          <li key={page['#webform_key']} styleName={classList}>
            <span styleName='step-number'>{i + 1}</span>
            <span styleName='step-title'>{page['#title']}</span>
          </li>
        );
      })}
    </ul>
  );
}

WizardProgress.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      '#title': PropTypes.string.isRequired,
      '#webform_key': PropTypes.string.isRequired,
    }),
  ).isRequired,
  currentPage: PropTypes.number.isRequired,
};

export default CSSModules(WizardProgress, styles, { allowMultiple: true });

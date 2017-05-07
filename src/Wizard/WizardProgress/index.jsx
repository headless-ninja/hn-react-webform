import React from 'react';
import PropTypes from 'prop-types';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';

/*
function WizardProgress({ pages, currentPage }) {
  return (
    <ul styleName='bar'>
      <li styleName='step done step-1'><span styleName='step-number'>1.</span><span styleName='step-title'>step 1</span></li>
      <li styleName='step active step-2'><span styleName='step-number'>2.</span><span styleName='step-title'>step 2</span></li>
      <li styleName='step todo step-3'><span styleName='step-number'>3.</span><span styleName='step-title'>step 3</span></li>
      <li styleName='step todo step-4'><span styleName='step-number'>4.</span><span styleName='step-title'>step 4</span></li>
    </ul>
  );
}
*/

function WizardProgress({ pages, currentPage }) {
  return (
    <ul styleName='bar'>
      {pages.map((page, i) => {
        let className;

        switch(true) {
          case i < currentPage:
            className = styles.done;
            break;
          case i === currentPage:
            className = styles.active;
            break;
          default:
            className = styles.todo;
            break;
        }

        return (
          <li key={page['#webform_key']} className={className}>
            {page['#title']}
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

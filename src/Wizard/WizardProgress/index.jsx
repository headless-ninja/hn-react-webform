import React, { PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import styles from './styles.pcss';


function WizardProgress({ pages, currentPage }) {
  return (
    <ul>
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

export default CSSModules(WizardProgress, styles);

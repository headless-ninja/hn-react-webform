import React from 'react';
import PropTypes from 'prop-types';
// styled
import Bar from './styled/bar';
import Step from './styled/step';
import StepNumber from './styled/step-number';
import StepTitle from './styled/step-title';

function WizardProgress({ pages, currentPage }) {
  return (
    <Bar>
      {pages.map((page, i) => (
        <Step
          key={page['#webform_key']}
          step={i}
          style={{ width: `${100 / pages.length}%` }}
          active={i === currentPage}
          done={i < currentPage}
        >
          <StepNumber>{i + 1}</StepNumber>
          <StepTitle>{page['#title']}</StepTitle>
        </Step>
      ))}
    </Bar>
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

export default WizardProgress;

import styled from 'styled-components';
import Label from '../../WebformElement/styled/label';

const Legend = Label.withComponent('legend');

export default styled(Legend)`
  width: 100%;
  float: left;
  padding: 0;
  margin-bottom: calc(${p => p.theme.spacingUnitFieldset} / 2);
  
  ${p => p.labelDisplay === 'inline' && `
    @media (min-width: 768px) {
      width: ${p.theme.inlineLabelWidth};
      padding-right: calc(${p.theme.spacingUnit} / 2);
    }
  `}

  ${p => p.labelDisplay === 'invisible' && `
    display: none;
  `}

  ${p => p.labelDisplay === 'before' && `
    display: block;
    float: none;
    width: 100%;
  `}
`;

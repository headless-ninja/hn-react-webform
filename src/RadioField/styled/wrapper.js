import styled from 'styled-components';

export default styled.div`
  @media (min-width: 768px) {
    display: inline-block;
    float: left;
  }
  
  ${p => p.labelDisplay === 'inline' && `
    width: calc(${p.theme.inlineLabelWidth} - (${p.theme.spacingUnit} / 2) - 0.5em);
  `}
  
  ${p => p.labelDisplay === 'before' && `
    float: none;
    width: 100%;
  `}
`;

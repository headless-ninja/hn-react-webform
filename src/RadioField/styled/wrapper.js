import styled from 'styled-components';

export default styled.div`
  @media (min-width: 768px) {
    display: inline-block;
    float: left;
    width: calc(50% - (${p => p.theme.spacingUnit} / 2) - 0.5em);
  }
  
  ${p => p.labelDisplay === 'before' && `
    float: none;
    width: 100%;
  `}
`;

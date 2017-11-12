import styled from 'styled-components';

export default styled.div`
  display: inline-block;
  padding-bottom: calc(${p => p.theme.spacingUnit} / 4);
  
  ${p => p.labelDisplay === 'inline' && `
    @media (min-width: 768px) {
      float: left;
      width: calc(50% - (${p.theme.spacingUnit} / 2) - 0.5em);
    }
  `}
`;

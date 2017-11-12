import styled from 'styled-components';

export default styled.div`
  margin-bottom: ${p => p.theme.spacingUnit};
  
  &::after {
    content: '';
    display: block;
    clear: both;
  }

  ${p => p.hidden && `
    display: none;
  `}
`;

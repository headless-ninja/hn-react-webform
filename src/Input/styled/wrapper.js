import styled from 'styled-components';

export default styled.div`
  display: inline-block;
  
  ${p => p.labelDisplay === 'inline' && `
    width: ${p.theme.inputWidth};
  `}

  ${p => p.labelDisplay === 'before' && `
    width: ${p.theme.inputWidth};
    max-width: 100%;

    @media (min-width: 768px) {
      width: calc(${p.theme.inlineLabelWidth} + ${p.theme.inputWidth});
    }
  `}
`;

import styled from 'styled-components';

export default styled.div`
  position: relative;
  
  ${p => p.labelDisplay === 'inline' && `
    width: calc(${p.theme.inputWidth} + 20px);
    padding-right: 20px;
  
    @media (min-width: 768px) {
      display: inline-block;
      float: left;
    }
  `}

  ${p => p.labelDisplay === 'before' && `
    width: calc(${p.theme.inputWidth} + 20px);
    padding-right: 20px;
  
    @media (min-width: 768px) {
      width: calc(${p.theme.inlineLabelWidth} + ${p.theme.inputWidth} + 20px);
    }
  `}
`;

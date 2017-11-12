import styled from 'styled-components';

export default styled.div`
  position: relative;
  margin: 0 0 calc(${p => p.theme.spacingUnit} / 2);

  @media (min-width: 768px) {
    display: inline-block;
    float: left;
  }

  & input {
    width: 100%;
  }

  ${p => p.labelDisplay === 'inline' && `
    width: calc(${p.theme.inputWidth} + 20px);
    padding-right: 20px;
  `}

  ${p => p.labelDisplay === 'before' && `
    width: calc(${p.theme.inputWidth} + 20px);
    padding-right: 20px;

    @media (min-width: 768px) {
      width: calc(50% + ${p.theme.inputWidth} + 20px);
    }
  `}
`;

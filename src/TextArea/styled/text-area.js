import styled from 'styled-components';

export default styled.textarea`
  box-sizing: border-box;
  margin: 0 0 calc(${p => p.theme.spacingUnit} / 2);
  font-size: 0.9em;
  line-height: inherit;
  font-family: inherit;
  overflow: auto;
  border: 1px solid ${p => p.theme.borderColor};
  background-color: ${p => p.theme.inputBgColor};
  border-radius: ${p => p.theme.borderRadius};
  padding: calc(${p => p.theme.spacingUnit} / 4) calc(${p => p.theme.spacingUnit} / 2);
  
  ${p => p.labelDisplay === 'inline' && `
    width: ${p.theme.inputWidth};
  `}

  ${p => p.labelDisplay === 'before' && `
    width: ${p.theme.inputWidth};
    max-width: calc(100% - 10px);
    min-width: ${p.theme.inputWidth};
    min-height: 40px;
    resize:vertical;

    @media (min-width: 768px) {
      width: calc(50% + ${p.theme.inputWidth});
    }
  `}

  ${p => !p.success && `
    border-color: ${p.theme.errorColor};
    background-color: ${p.theme.errorBgColor};

    &::placeholder {
      color: ${p.theme.errorColor};
    }
  `}
`;

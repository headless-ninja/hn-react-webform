import styled from 'styled-components';

export default styled.button`
  cursor: pointer;
  -webkit-appearance: none;
  margin: calc(${p => p.theme.spacingUnit} * 1.5) 0 0;
  font-size: 1em;
  line-height: inherit;
  font-family: inherit;
  border: none;
  color: ${p => p.theme.buttonTextColor};
  background-color: ${p => p.theme.buttonColor};
  border-radius: ${p => p.theme.borderRadius};
  padding: ${p => p.theme.buttonSpacingV} ${p => p.theme.buttonSpacingH};
  transition: background-color 350ms ease;

  &:hover {
    background-color: ${p => p.theme.buttonColorHover};
  }

  ${p => p.disabled && `
    background-color: ${p.theme.buttonColorDisabled};
    cursor: default;

    &:hover {
      background-color: ${p.theme.buttonColorDisabled};
    }
  `}

  ${p => !p.primary && `
    background-color: ${p.theme.buttonSecondaryColor};
    color: ${p.theme.buttonSecondaryTextColor};
  
    &:hover {
      background-color: ${p.theme.buttonSecondaryColorHover};
    }
  `}
`;

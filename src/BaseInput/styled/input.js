import styled from 'styled-components';
import ValidationIcon from './validation-icon';

export default styled.input`
  box-sizing: border-box;
  margin: 0 0 calc(${p => p.theme.spacingUnit} / 2);
  font-size: 0.9em;
  line-height: ${p => p.theme.inputLineHeight};
  font-family: inherit;
  width: 100%;
  border: 1px solid ${p => p.theme.borderColor};
  background-color: ${p => p.theme.inputBgColor};
  border-radius: ${p => p.theme.borderRadius};
  padding: calc(${p => p.theme.spacingUnit} / 4) calc(${p => p.theme.spacingUnit} / 2);

  &:focus {
    outline: none;
    box-shadow: 0 0 2px 3px ${p => p.theme.focusColor};
  }

  &:disabled {
    background-color: color(${p => p.theme.inputBgColor} blackness(50%));
  }

  &::placeholder {
    color: ${p => p.theme.placeholderColor};
  }

  ${p => p.error && `
    border-color: ${p.theme.errorColor};
    background-color: ${p.theme.errorBgColor};

    &::placeholder {
      color: ${p.theme.errorColor};
    }
  `}

  &[type="range"] + ${ValidationIcon} {
    position: absolute;
    right: -22px;
    top: 5px;
  }
`;

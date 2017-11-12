import styled from 'styled-components';
import Indicator from './indicator';

export default styled.input`
  /* Reset anything that could peek out or interfere with dimensions, but don't use display:none for WCAG */
  position: absolute;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  opacity: 0;

  &:focus {
    & + ${Indicator} {
      box-shadow: 0 0 2px 3px ${p => p.theme.focusColor};
    }
  }

  &:checked {
    & + ${Indicator} {
      background: ${p => p.theme.iconCheckbox} no-repeat center center ${p => p.theme.inputBgColor};
      background-size: calc(${p => p.theme.spacingUnit} * 0.8) auto;
    }
  }
`;

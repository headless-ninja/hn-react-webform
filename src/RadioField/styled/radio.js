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
    & + .indicator {
      box-shadow: 0 0 2px 3px ${p => p.theme.focusColor};
    }
  }

  &:checked {
    & + ${Indicator} {
      position: relative;

      &::before {
        content: '';
        position: absolute;
        top: 25%;
        left: 25%;
        width: 50%;
        height: 50%;
        background-color: ${p => p.theme.checkedColor};
        border-radius: 50%;
      }
    }
  }
`;

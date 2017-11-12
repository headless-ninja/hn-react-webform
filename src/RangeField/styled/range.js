import styled from 'styled-components';
import BaseInput from '../../BaseInput/styled/input';

export default styled(BaseInput)`
  color: #000;
  padding-left: 0;
  padding-right: 0;
  margin-left: 0;
  margin-right: 0;

  &:focus {
    box-shadow: none;
  }

  &::-webkit-slider-thumb,
  &::-moz-range-thumb,
  &::-ms-thumb {
    &:focus {
      box-shadow: 0 0 2px 3px ${p => p.theme.focusColor};
    }
  }
`;

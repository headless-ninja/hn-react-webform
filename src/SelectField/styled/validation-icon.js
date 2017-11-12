import styled from 'styled-components';
import ValidationIcon from '../../BaseInput/styled/validation-icon';

export default styled(ValidationIcon)`
  position: absolute;
  right: 0;
  top: 10px;
  
  ${p => p.success && `
    &::after {
      position: relative;
      top: -5px;
    }
  `}
`;

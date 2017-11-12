import styled from 'styled-components';

export default styled.span`
  font-size: 10px;

  ${p => p.error && `
    font-size: 16px;
    color: #fff;
  `}
`;

import styled from 'styled-components';

export default styled.span`
  display: inline-block;
  position: relative;
  line-height: 20px;
  text-align: center;
  border-radius: ${p => p.theme.borderRadius};
  background: ${p => p.theme.borderColor};
  padding: 5px 10px;
  margin-top: 7px;
  transform: translateX(-50%);

  &::after {
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    left: 50%;
    top: -7px;
    transform: translateX(-50%);
    border-left: 7px solid transparent;
    border-bottom: 7px solid ${p => p.theme.borderColor};
    border-right: 7px solid transparent;
  }
`;

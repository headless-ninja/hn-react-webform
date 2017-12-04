import styled from 'styled-components';

export default styled.li`
  display: inline-block;
  padding: 15px 30px;
  position: relative;
  margin-right: 5px;
  background: #f4f4f4;
  z-index: ${p => 11 - p.step};

  &::before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    border-left: 20px solid #fff;
    border-bottom: 24px solid transparent;
    border-top: 24px solid transparent;
    clear: both;
  }

  &::after {
    position: absolute;
    content: '';
    top: 0;
    right: -20px;
    border-left: 20px solid #f4f4f4;
    border-bottom: 24px solid transparent;
    border-top: 24px solid transparent;
    clear: both;
  }
  
  ${p => p.step === 1 && `
    &::before {
      display: none;
    }
  `}
  
  ${p => (p.done || p.active) && `
    background: ${p.theme.primaryColor};
    color: #fff;
  
    &::after {
      border-left: 20px solid ${p.theme.primaryColor};
    }
  `}
`;

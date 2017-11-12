import styled from 'styled-components';

export default styled.span`
  display: inline-block;
  width: calc(${p => p.theme.spacingUnit} / 1.5);
  height: calc(${p => p.theme.spacingUnit} / 1.5);
  margin-left: calc(${p => p.theme.spacingUnit} / 1.5);

  ${p => p.success && `
    &::after {
      content: '';
      display: block;
      width: 60%;
      height: 100%;
      border-bottom: 2px solid ${p.theme.successColor};
      border-right: 2px solid ${p.theme.successColor};
      transform: rotate(45deg) translateY(-4px);
    }
  `}
`;

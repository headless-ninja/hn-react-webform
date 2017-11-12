import styled from 'styled-components';

export default styled.span`
  content: '';
  display: inline-block;
  width: ${p => p.theme.spacingUnitRadio};
  height: ${p => p.theme.spacingUnitRadio};
  margin-right: calc(${p => p.theme.spacingUnitRadio} / 2);
  background-color: ${p => p.theme.inputBgColor};
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: 50%;
`;

import styled from 'styled-components';

export default styled.span`
  content: '';
  float: left;
  display: inline-block;
  width: ${p => p.theme.spacingUnitCheckbox};
  height: ${p => p.theme.spacingUnitCheckbox};
  margin-right: calc(${p => p.theme.spacingUnitCheckbox} * 1.5 * -1);
  background-color: ${p => p.theme.inputBgColor};
  border: 1px solid ${p => p.theme.borderColor};
  border-radius: ${p => p.theme.borderRadius};
`;

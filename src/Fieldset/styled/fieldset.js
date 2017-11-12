import styled from 'styled-components';
import FormRow from '../../WebformElement/styled/form-row';

export default styled.fieldset`
  box-sizing: border-box;
  margin-bottom: calc(${p => p.theme.spacingUnitFieldset} * 1.5);
  border: ${p => p.theme.fieldsetBorder};
  border-radius: ${p => p.theme.borderRadius};
  background-color: ${p => p.theme.fieldsetBgColor};
  padding: calc(${p => p.theme.spacingUnitFieldset} * 1) calc(${p => p.theme.spacingUnitFieldset} * 1);

  @media screen and (min-width: 768px) {
    padding: calc(${p => p.theme.spacingUnitFieldset} * 2.5) calc(${p => p.theme.spacingUnitFieldset} * 2.5);
  }
  
  &${FormRow} {
    border: none;
  }
`;

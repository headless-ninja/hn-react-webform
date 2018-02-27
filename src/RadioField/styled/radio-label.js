import styled from 'styled-components';

export default styled.label`
  display: block;
  margin-bottom: calc(${p => p.theme.spacingUnit} / 3);
  line-height: ${p => p.theme.inputLineHeight};
  
  ${p => [
    'side_by_side',
    'two_columns',
    'three_columns',
  ].includes(p.optionDisplay) && `
    margin-right: calc(${p.theme.spacingUnit} / 1);
    display: inline-block;
    width: auto;
  `}
`;

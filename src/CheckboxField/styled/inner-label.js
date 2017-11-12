import styled from 'styled-components';

export default styled.span`
  display: inline-block;
  padding-left: calc(${p => p.theme.spacingUnitCheckbox} * 1.5);
  line-height: 1.5;
  top: -0.2em;
  position: relative;
`;

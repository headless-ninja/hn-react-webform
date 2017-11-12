import styled from 'styled-components';
import Label from '../../WebformElement/styled/label';

const Legend = Label.withComponent('legend');

export default styled(Legend)`
  width: 100%;
  float: left;
  padding: 0;
  margin-bottom: calc(${p => p.theme.spacingUnitFieldset} / 2);
`;

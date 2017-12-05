import styled from 'styled-components';

export default styled.ul`
  display: flex;
  margin: 0 0 calc(2 * ${p => p.theme.spacingUnit}) 0;
  padding: 0;
  width: calc(100% - 15px);
  line-height: 1em;
`;

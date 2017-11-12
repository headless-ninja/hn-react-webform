import styled from 'styled-components';

export default styled.div`
  font-family: ${p => p.theme.primaryFont};
  max-width: ${p => p.theme.formMaxWidth};
  color: ${p => p.theme.baseColor};
  margin: ${p => p.theme.formMargin};
`;

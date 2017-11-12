import styled from 'styled-components';

export default styled.ul`
  margin: 0;
  padding: 0;
  
  font-size: 0.8em;
  margin-top: 0;
  padding-bottom: calc(${p => p.theme.spacingUnit} / 2);
  line-height: 1.2em;
  clear: both;

  ${p => p.labelDisplay === 'inline' && `
    @media (min-width: 768px) {
      padding-left: calc(${p.theme.spacingUnit} / 2);
      margin-left: ${p.theme.inlineLabelWidth};
      float: left;
    }
  `}
`;

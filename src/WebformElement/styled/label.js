import styled from 'styled-components';

export default styled.label`
  display: inline-block;
  width: 100%;
  padding-left: 0; /* legend */
  margin-bottom: calc(${p => p.theme.spacingUnit} / 2);
  vertical-align: top;
  line-height: ${p => p.theme.inputHeight};

  ${p => p.labelDisplay === 'inline' && `
    @media (min-width: 768px) {
      float: left;
      width: ${p.theme.inlineLabelWidth};
      padding-right: calc(${p.theme.spacingUnit} / 2);
    }
  `}

  ${p => p.labelDisplay === 'invisible' && `
    display: none;
  `}

  ${p => p.labelDisplay === 'before' && `
    display: block;
    float: none;
    width: 100%;
  `}
`;

import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: -12px;
  margin-right: -12px;
  & > * {
    min-width: 280px;
    width: calc(33.333% - 24px);
    flex-grow: 1;
    flex-shrink: 0;
    margin: 0 12px;
    margin-bottom: 48px;

    ${({ theme }) => theme.mediaQueries.md} {
      max-width: calc(33.333% - 24px);
    }
  }
`

export default FlexLayout

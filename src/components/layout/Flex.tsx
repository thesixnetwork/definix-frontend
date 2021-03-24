import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-left: -8px;
  margin-right: -8px;
  & > * {
    min-width: 280px;
    max-width: calc(50% - 16px);
    width: calc(100% - 16px);
    margin: 0 8px;
    margin-bottom: 32px;
  }
`

export default FlexLayout

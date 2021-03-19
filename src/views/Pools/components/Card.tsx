import styled from 'styled-components'

const Card = styled.div<{ isActive?: boolean; isFinished?: boolean }>`
  background: ${(props) => props.theme.card.background};
  box-shadow: ${({ theme }) => theme.shadows.elevation2};
  border-radius: ${({ theme }) => theme.radii.default};
  display: flex;
  // color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};
  position: relative;
  margin-bottom: 16px;
  padding-bottom: 4px;

  .panel {
    &:nth-child(01) {
      width: 45%;
      border-right: 1px solid ${({ theme }) => theme.colors.border};
    }
    &:nth-child(02),
    &:nth-child(03) {
      width: 27.5%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .color-stroke {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    height: 4px;
    width: 100%;
  }
`

export default Card

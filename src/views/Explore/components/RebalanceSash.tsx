import styled from 'styled-components'
import cardNewImg from 'uikit-dev/images/new-badge/new-badge-card.png'
import listNewImg from 'uikit-dev/images/new-badge/new-badge-list.png'

const RebalanceSash = styled.div<{ type?: string }>`
  background-image: url(${({ type }) => (type === 'listCard' || type === 'list' ? listNewImg : cardNewImg)});
  background-repeat: no-repeat;
  background-size: contain;
  height: 80px;
  width: 80px;
  position: absolute;
  right: ${({ type }) => type === 'card' && 0};
  left: ${({ type }) => (type === 'list' ? 0 : 'unset')};
  top: ${({ type }) => (type === 'list' || type === 'card' ? 0 : 'unset')};
  z-index: 1;
`

export default RebalanceSash

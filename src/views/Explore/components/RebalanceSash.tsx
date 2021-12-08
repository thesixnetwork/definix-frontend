/* eslint-disable no-nested-ternary */
import styled from 'styled-components'
import riskCardImg from 'uikit-dev/images/new-badge/high-risk-card-view.png'
import riskListImg from 'uikit-dev/images/new-badge/high-risk-list-view.png'
import newCardImg from 'uikit-dev/images/new-badge/new-badge-card.png'
import newListImg from 'uikit-dev/images/new-badge/new-badge-list.png'

const RebalanceSash = styled.div<{ view?: string, badge?: string }>`
  background-image: url(${({ view, badge }) => (
    (view === 'listCard' || view === 'list') && badge === 'new' ? newListImg 
  : (view === 'listCard' || view === 'list') && badge === 'risk' ? riskListImg 
  :  view === 'card' && badge === 'new' ? newCardImg
  :  view === 'card' && badge === 'risk' && riskCardImg)});
  background-repeat: no-repeat;
  background-size: contain;
  height: 60px;
  width: 60px;
  position: absolute;
  right: ${({ view }) => view === 'card' && 0};
  left: ${({ view }) => (view === 'list' ? 0 : 'unset')};
  top: ${({ view }) => (view === 'list' || view === 'card' ? 0 : 'unset')};
  z-index: 1;
`

export default RebalanceSash

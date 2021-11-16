import styled from 'styled-components'
import listNewImg from '../../../uikit-dev/images/for-ui-v2/badge/new-badge.png'

const PartnerPoolSash = styled.div<{ type?: string }>`
  background-image: url(${listNewImg});
  background-repeat: no-repeat;
  background-size: contain;
  height: 70px;
  width: 70px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.xs} {
    height: 60px;
    width: 60px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 70px;
    width: 70px;
  }
`

export default PartnerPoolSash

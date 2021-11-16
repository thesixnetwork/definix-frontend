import styled from 'styled-components'
import listNewImg from '../../../uikit-dev/images/for-ui-v2/badge/new-badge.png'

const PartnerPoolSash = styled.div<{ type?: string }>`
  background-image: url(${listNewImg});
  background-repeat: no-repeat;
  background-size: contain;
  height: 80px;
  width: 80px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.xs} {
    height: 36px;
    width: 36px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 80px;
    width: 80px;
  }
`

export default PartnerPoolSash

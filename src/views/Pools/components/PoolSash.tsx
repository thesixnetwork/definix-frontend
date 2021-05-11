import styled from 'styled-components'
import finishImg from 'uikit-dev/images/Finished-ribbon.png'
import specialImg from 'uikit-dev/images/Special-ribbon.png'

const PoolSash = styled.div<{ type?: string }>`
  background-image: url(${({ type }) => (type === 'special' ? specialImg : finishImg)});
  background-repeat: no-repeat;
  background-size: contain;
  height: 120px;
  width: 120px;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
`

export default PoolSash

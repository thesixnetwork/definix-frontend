import styled from 'styled-components'
import { Button } from 'uikit-dev'

const HelpButton = styled(Button)`
  &:hover {
    svg {
      fill: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`
export default HelpButton

import styled from 'styled-components'
import Button from '../../components/Button/Button'

const MenuButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
`
MenuButton.defaultProps = {
  variant: 'text',
  size: 'sm',
}

export default MenuButton

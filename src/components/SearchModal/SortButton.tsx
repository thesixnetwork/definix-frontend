import React from 'react'
import { IconButton, Text } from 'uikit-dev'
import styled from 'styled-components'
import { RowFixed } from '../Row'

export const FilterWrapper = styled(RowFixed)`
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.invertedContrast};
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.radii.default};
  user-select: none;
  & > * {
    user-select: none;
  }
  :hover {
    cursor: pointer;
  }
`

export default function SortButton({
  toggleSortOrder,
  ascending,
}: {
  toggleSortOrder: () => void
  ascending: boolean
}) {
  return (
    <IconButton size="sm" variant="text" onClick={toggleSortOrder}>
      <Text fontSize="1rem">{ascending ? '↑' : '↓'}</Text>
    </IconButton>
  )
}

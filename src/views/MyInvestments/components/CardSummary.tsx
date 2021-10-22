import { Card } from 'uikit-dev'
import React from 'react'
import { Tabs, Tab } from '@material-ui/core'
import styled from 'styled-components'
import Earned from './Earned'
import NetWorth from './NetWorth'

const Container = styled(Card)`
  overflow: auto;
`

function CardSummary() {
  const [value, setValue] = React.useState(0)

  function handleChange(event, newValue) {
    setValue(newValue)
  }

  return (
    <Container className="mb-5">
      <Tabs value={value} onChange={handleChange}>
        <Tab label="Earned" />
        <Tab label="Net Worth" />
      </Tabs>
      {value === 0 && <Earned />}
      {value === 1 && <NetWorth />}
    </Container>
  )
}

export default CardSummary

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Box, useMatchBreakpoints } from 'definixswap-uikit'
import { Tabs, Tab } from '@material-ui/core'
import Earned from './Earned'
import NetWorth from './NetWorth'

function CardSummary() {
  const { t } = useTranslation()
  const { isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXxl, [isXxl])
  const [value, setValue] = React.useState(0)

  function handleChange(event, newValue) {
    setValue(newValue)
  }

  return (
    <Card className="mt-s16">
      <Tabs value={value} onChange={handleChange}>
        <Tab label={t('Earned')} />
        <Tab label={t('Net Worth')} />
      </Tabs>
      <Box>
        {value === 0 && <Earned isMobile={isMobile} />}
        {value === 1 && <NetWorth />}
      </Box>
    </Card>
  )
}

export default CardSummary

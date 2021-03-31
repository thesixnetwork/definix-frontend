import Page from 'components/layout/Page'
import React from 'react'
import { ArrowBackIcon, Card, IconButton } from 'uikit-dev'
import InfoBanner from './components/InfoBanner'

const Info: React.FC = () => {
  return (
    <Page style={{ maxWidth: '1280px' }}>
      <Card isRainbow className="flex flex-column align-stretch mx-auto" style={{ maxWidth: '1000px' }}>
        <IconButton variant="text" as="a" href="/dashboard" area-label="go back" className="ma-3">
          <ArrowBackIcon />
        </IconButton>

        <InfoBanner />

        <div className="pa-3">Hello</div>
      </Card>
    </Page>
  )
}

export default Info

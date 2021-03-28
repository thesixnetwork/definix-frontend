import Page from 'components/layout/Page'
import PropTypes from 'prop-types'
import React from 'react'
import { Heading } from 'uikit-dev'
import Flip from '../Flip'

const WaitingPage = ({ pageName, openDate }) => {
  return (
    <Page style={{ maxWidth: '1280px' }}>
      <Heading as="h1" fontSize="32px !important" className="mb-9 mt-6" textAlign="center">
        {pageName}
      </Heading>

      <Heading className="mb-3" textAlign="center">
        {pageName} will open in
      </Heading>

      <Flip date={openDate} />
    </Page>
  )
}

WaitingPage.propTypes = {
  pageName: PropTypes.string.isRequired,
  openDate: PropTypes.string.isRequired,
}

export default WaitingPage

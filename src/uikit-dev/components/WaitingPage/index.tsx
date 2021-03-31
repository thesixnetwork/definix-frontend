import PropTypes from 'prop-types'
import React from 'react'
import { Heading } from 'uikit-dev'
import Flip from '../Flip'

const WaitingPage = ({ pageName, openDate }) => {
  return (
    <div style={{ maxWidth: '1000px' }} className="pa-6">
      <Heading as="h1" fontSize="32px !important" className="mb-9 mt-6" textAlign="center">
        {pageName}
      </Heading>

      <Heading className="mb-3" textAlign="center">
        {pageName} will open in
      </Heading>

      <Flip date={openDate} />
    </div>
  )
}

WaitingPage.propTypes = {
  pageName: PropTypes.string.isRequired,
  openDate: PropTypes.string.isRequired,
}

export default WaitingPage

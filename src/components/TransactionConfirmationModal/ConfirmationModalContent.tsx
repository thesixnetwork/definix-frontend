import React from 'react'
import { Heading } from 'uikit-dev'

type ConfirmationModalContentProps = {
  mainTitle: string
  title: string
  topContent: () => React.ReactNode
  bottomContent: () => React.ReactNode
}

const ConfirmationModalContent = ({ mainTitle, title, topContent, bottomContent }: ConfirmationModalContentProps) => {
  return (
    <div>
      <div className="pa-6 pt-3 bd-b">
        <Heading fontSize="36px !important" className="mb-6">
          {mainTitle}
        </Heading>

        <Heading className="mb-6">{title}</Heading>
        {topContent()}
      </div>

      <div className="pa-6">{bottomContent()}</div>
    </div>
  )
}

export default ConfirmationModalContent

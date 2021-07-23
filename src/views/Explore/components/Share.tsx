import React from 'react'
import { Text } from 'uikit-dev'

interface ShareType {
  className?: string
  share: string
  usd: string
  textAlign?: string
}

const Share: React.FC<ShareType> = ({ className = '', share, usd, textAlign }) => {
  return (
    <div className={className}>
      <div className={`flex align-baseline justify-${textAlign}`}>
        <Text fontSize="20px" bold className="mr-2">
          {share}
        </Text>
        <Text bold>SHARE</Text>
      </div>
      <Text color="primary" bold>
        {usd} USD
      </Text>
    </div>
  )
}

export default Share

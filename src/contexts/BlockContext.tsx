import React, { useState, useEffect, useRef } from 'react'
import { getCaver } from 'utils/caver'

const BlockContext = React.createContext(0)

const BlockContextProvider = ({ children }) => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)

  useEffect(() => {
    const caver = getCaver()
    const interval = setInterval(async () => {
      const blockNumber = await caver.klay.getBlockNumber()
      if (blockNumber !== previousBlock.current) {
        previousBlock.current = blockNumber
        setBlock(blockNumber)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return <BlockContext.Provider value={block}>{children}</BlockContext.Provider>
}

export { BlockContext, BlockContextProvider }

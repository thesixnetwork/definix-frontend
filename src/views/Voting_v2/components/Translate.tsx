import React from 'react'

import useVoteTranslate from 'hooks/useVoteTranslate'

interface Props {
  text: string
  type: string
}

const Translate: React.FC<Props> = ({ text, type }) => {
  return <>{useVoteTranslate(text, type)}</>
}

export default Translate

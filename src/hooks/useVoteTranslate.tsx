import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import EN_VOTING from 'assets/voting/en.json'
import KO_VOTING from 'assets/voting/ko.json'

export default function useVoteTranslate(text, type) {
  const { i18n } = useTranslation()
  const [votings, setVotings] = useState(i18n.languages[0] === 'ko' ? KO_VOTING : EN_VOTING)

  useEffect(() => {
    setVotings(i18n.languages[0] === 'ko' ? KO_VOTING : EN_VOTING)
  }, [i18n.languages])

  const tr = useCallback(() => {
    if (!text) return text
    const key = `${text.split(' ').slice(0, 5).join(' ')}/${type}`
    return votings[key] ? votings[key] : text
  }, [text, type, votings])

  return tr()
}

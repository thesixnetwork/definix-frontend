import axios from 'axios'
import { useRef, useState } from 'react'

function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState({ error: false, message: '' })
  const [data, setData] = useState<any>()
  const source = useRef<any>()

  const cancel = () => {
    if (source.current) {
      source.current.cancel()
      source.current = undefined
    }
  }

  const request = async (url: string, params: any) => {
    cancel()
    setLoading(true)
    try {
      const apiSource = axios.CancelToken.source()
      const req = axios
        .get(url, {
          cancelToken: apiSource.token,
          params,
        })
        .then(({ data: resData }) => resData)
      source.current = apiSource
      const res = await req
      setData(res)
      setLoading(false)
      source.current = undefined
    } catch (e: any) {
      setLoading(false)
      setError({
        error: true,
        message: e?.message,
      })
      source.current = undefined
    }
  }

  return {
    loading,
    error,
    data,
    request,
    cancel,
  }
}

export default useApi

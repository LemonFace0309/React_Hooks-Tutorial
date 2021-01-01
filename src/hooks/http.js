import { useReducer, useCallback } from 'react'

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      }
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.resData,
        extra: action.extra,
      }
    case 'ERROR':
      return { loading: false, error: action.errMsg }
    case 'CLEAR':
      return initialState
    default:
      throw new Error('Should not be reached!')
  }
}

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState)

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), [
    dispatchHttp,
  ])

  const sendRequest = useCallback((url, method, body, extra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', identifier: reqIdentifier })
    fetch(url, {
      method: method,
      body: body,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json()
      })
      .then((resData) => {
        dispatchHttp({ type: 'RESPONSE', resData: resData, extra: extra })
        // setIngredients((prevIngredients) => {
        //   return prevIngredients.filter((ig) => id !== ig.id)
        // })
      })
      .catch((err) => {
        dispatchHttp({ type: 'ERROR', errMsg: err.message })
      })
  }, [])

  return {
    isLoading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear: clear,
  }
}
// each functional component gets their own "snapshot" of this hook. That is, logic is shared, not data.

export default useHttp

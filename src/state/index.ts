import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { save, load } from 'redux-localstorage-simple'

import farmsReducer from './farms'
import finixPriceReducer from './finixPrice'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'
import rebalanceReducer from './rebalance'
import walletReducer from './wallet'
import longTermStake from './longTermStake'
import voting from './voting'

import application from './application/reducer'
import { updateVersion } from './global/actions'
import user from './user/reducer'
import transactions from './transactions/reducer'
import swap from './swap/reducer'
import mint from './mint/reducer'
import lists from './lists/reducer'
import burn from './burn/reducer'
import multicall from './multicall/reducer'
import { getThemeCache } from '../utils/theme'

type MergedState = {
  user: {
    [key: string]: any
  }
  transactions: {
    [key: string]: any
  }
}
const PERSISTED_KEYS: string[] = ['user', 'transactions']
const loadedState = load({ states: PERSISTED_KEYS }) as MergedState
if (loadedState.user) {
  loadedState.user.userDarkMode = getThemeCache()
}

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    finixPrice: finixPriceReducer,
    farms: farmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    profile: profileReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
    rebalances: rebalanceReducer,
    wallet: walletReducer,
    longTerm: longTermStake,
    voting,

    application,
    user,
    transactions,
    // toasts,
    swap,
    mint,
    burn,
    multicall,
    lists,
  },
  // middleware: [...getDefaultMiddleware({ serializableCheck: false })],
  middleware: [...getDefaultMiddleware({ thunk: false, serializableCheck: false }), save({ states: PERSISTED_KEYS })],
  // preloadedState: loadedState,
})

store.dispatch(updateVersion())

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

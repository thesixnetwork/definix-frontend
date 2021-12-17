import { configureStore } from '@reduxjs/toolkit'
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

export default configureStore({
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
    voting
  },
})

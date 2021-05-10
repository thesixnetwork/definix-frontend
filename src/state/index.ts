import { configureStore } from '@reduxjs/toolkit'
import farmsReducer from './farms'
import finixPriceReducer from './finixPrice'
import finixRegisterReducer from './finixRegister'
import toastsReducer from './toasts'
import poolsReducer from './pools'
import profileReducer from './profile'
import teamsReducer from './teams'
import achievementsReducer from './achievements'

export default configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    finixPrice: finixPriceReducer,
    finixRegister: finixRegisterReducer,
    farms: farmsReducer,
    toasts: toastsReducer,
    pools: poolsReducer,
    profile: profileReducer,
    teams: teamsReducer,
    achievements: achievementsReducer,
  },
})

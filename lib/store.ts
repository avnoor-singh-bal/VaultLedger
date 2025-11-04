import { configureStore } from '@reduxjs/toolkit'
import { UserDataSlice } from './features/userdata/UserDataSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
        UserData: UserDataSlice.reducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
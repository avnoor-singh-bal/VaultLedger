import { User } from '@/models/models'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserDataState {
  user: User;
}

const initialState: UserDataState = {
    user: {
      id: "",
      firstName: "",
      lastName: "",
      email: "",
      role: 0,
      category: ""
    }
}

export const UserDataSlice = createSlice({
  name: 'UserData',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.user.id = action.payload
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.user.firstName = action.payload
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.user.lastName = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.user.email = action.payload
    },
    setRole: (state, action: PayloadAction<number>) => {
      state.user.role = action.payload
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.user.category = action.payload
    },
    signOut: (state) => {
      state.user = initialState.user;
    }
  }
})

export const { setId, setFirstName, setLastName, setEmail, setRole, setCategory, setUser, signOut } = UserDataSlice.actions
export default UserDataSlice.reducer
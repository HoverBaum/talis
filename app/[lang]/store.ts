import { configureStore } from '@reduxjs/toolkit'
import { shadowrunReducer } from '@/app/dice/shadowrun/shadowrun.slice'
import { d6Reducer } from './dice/d6/d6.slice'

export const store = configureStore({
  reducer: {
    shadowrun: shadowrunReducer,
    d6: d6Reducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

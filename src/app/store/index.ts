import {combineReducers, configureStore} from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userReducer from './slices/userSlice'
import cartReducer from './slices/cartSlice'
import studentsReducer from './slices/studentsSlice'
import thunk from 'redux-thunk'

const persistConfig = {
	key: 'root',
	storage
}


const rootReducer = combineReducers({
	user: userReducer,
	cart: cartReducer,
	students: studentsReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store =
	configureStore({
		reducer: persistedReducer,
		middleware: [thunk]
	})

export const persistor = persistStore(store)

export type IRootState = ReturnType<typeof store.getState>

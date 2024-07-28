import {configureStore} from '@reduxjs/toolkit'
import customerReducer from '../slices/customerSlice'

const store = configureStore({
    reducer: {
        customers: customerReducer,
    },
});
export default store;
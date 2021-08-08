/**
 * The redux state manager file
 */

import { configureStore } from '@reduxjs/toolkit'
import anyReducer from './anySlice'

const store = configureStore({
    reducer: {
        any: anyReducer,
    },
})

/** add global dynamic storage */
store.cache = {
    books: {},
    authors: {},
    series: {}
}

export default store
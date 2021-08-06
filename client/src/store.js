/**
 * The redux state manager file
 */

import {configureStore} from '@reduxjs/toolkit'
import anyReducer from './anySlice'

export default configureStore({
    reducer: {
        any: anyReducer,
    },
})
/**
 * An redux slicce
 */
import { createSlice } from '@reduxjs/toolkit'

export const anySlice = createSlice({
    name: 'any',
    initialState: {
        User_ID: null
    },
    reducers: {
        setUserID: (state, action) => {
            state.User_ID = action.payload
        }
    }
})

export const {setUserID} = anySlice.actions

export default anySlice.reducer
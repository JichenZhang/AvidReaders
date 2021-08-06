/**
 * An redux slicce
 */
import { createSlice } from '@reduxjs/toolkit'

export const anySlice = createSlice({
    name: 'any',
    initialState: {
        User_ID: null,
        User_Name: null,
    },
    reducers: {
        setUserID: (state, action) => {
            state.User_ID = action.payload
        },
        setUserName: (state, action) => {
            state.User_Name = action.payload
        }
    }
})

export const {setUserID, setUserName} = anySlice.actions

export default anySlice.reducer
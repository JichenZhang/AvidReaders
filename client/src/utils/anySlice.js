/**
 * An redux slicce
 */
import { createSlice } from '@reduxjs/toolkit'

export const anySlice = createSlice({
    name: 'any',
    initialState: {
        User_ID: null,
        User_Name: null,
        wishlist: [] // list of Book_IDs
    },
    reducers: {
        setUserID: (state, action) => ({
            ...state,
            User_ID: action.payload
        }),
        setUserName: (state, action) => ({
            ...state,
            User_Name: action.payload
        }),
        initWishlist: (state, action) => ({
            ...state,
            wishlist: action.payload
        }),
        removeFromWishlist: (state, action) => ({
            ...state,
            wishlist: state.wishlist.filter(id => id !== action.payload)
        }),
        addToWishlist: (state, action) => {
            let newlist = state.wishlist
            newlist.push(action.payload)
            return {
                ...state,
                wishlist: newlist
            }
        }
    }
})

export const { setUserID,
    setUserName,
    initWishlist,
    removeFromWishlist,
    addToWishlist } = anySlice.actions

export default anySlice.reducer
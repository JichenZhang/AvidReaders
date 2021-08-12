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
        removeFromWishlist: (state, action) => {
            debugger
            let newlist = [...state.wishlist]
            newlist = newlist.filter(x => x !== action.payload)
            return {
                ...state,
                wishlist: newlist
            }
        },
        addToWishlist: (state, action) => {
            let newlist = [...state.wishlist]
            newlist.push(action.payload)
            return {
                ...state,
                wishlist: newlist
            }
        },
        updateWishlist: (state, action) => {
            return {
                ...state,
                wishlist: new Array(...action.payload)
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
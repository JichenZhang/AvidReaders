import { cloneElement } from "react"
import { useDispatch } from 'react-redux'
import { setUserID } from '../anySlice'

const baseUrl = 'http://localhost:3001'
/**
 * 
 * @param {String} login 
 * @param {String} password 
 * @param {(userID, name)=>{}} userInfoCallback if user found, null if not found
 */
async function authenticate(login, password, userInfoCallback) {

}

/**
 * @param {login: String, password: String, name: String} accountData 
 * @param userIDCallback the callback function to get user ID
 * @returns a promise - the response in json
 */
async function createAccount(accountData, userIDCallback) {
    const route = '/user'
    const response = await fetch(baseUrl + route, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(accountData)
    })
    if (response.status === 400) {
        alert('User already exists, please login.')
    } else if (response.ok) {
        const res = await response.json()
        userIDCallback(res.User_ID)
    }

}

export { authenticate, createAccount }
import { useLocation } from 'react-router-dom'

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
}

const baseUrl = 'http://localhost:3001'

const globalStorage = {
	books: {},
	authors: {},
	series: {}
}

function deepCopy(obj) {
	return JSON.parse(JSON.stringify(obj))
}

/**
 * 
 * @param {{login, password}} 
 * @param {({userID, name})=>{}} userInfoCallback 
 * @returns true on success
 */
async function authenticate(authData) {
	return new Promise(async function (resolve, reject) {
		const route = '/user'
		const url = (
			baseUrl + route + '?login=' + authData.login +
			'&password=' + authData.password
		)
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		})
		if (response.ok) {
			const res = await response.json()
			console.log('authresult=', res)
			resolve(res)
		} else {
			alert('Could not authenticate, please try again.')
			reject(response)
		}
	})

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

/**
 * 
 * @param {Number} User_ID 
 * @param {({Wishlist})=>{}} wishlistCallback 
 */
async function getWishlist(User_ID) {
	return new Promise(async function (resolve, reject) {
		const route = '/wishlist'
		const url = `${baseUrl}${route}?User_ID=${User_ID}`
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		})
		if (response.ok) {
			const res = await response.json()
			resolve(res)
		} else {
			reject(response)
		}
	})
}

/**
 * 
 * @param {Number} Book_ID 
 * @param {({Authors, Series, Genres})=>{}} bookDetailsCallback 
 */
async function getBookDetails(Book_ID) {
	return new Promise(async function (resolve, reject) {
		if (globalStorage.books[Book_ID]) { // already in cache
			resolve(globalStorage.books[Book_ID])
			return
		}
		const route = '/book'
		const url = (
			baseUrl + route + '?id=' + Book_ID
		)
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		})
		if (response.ok) {
			const res = await response.json()
			globalStorage.books[res.Book_ID] = res
			resolve(res)
		} else {
			reject(response)
		}
	})
}

export { globalStorage, authenticate, createAccount, getWishlist, getBookDetails, deepCopy, useQuery }
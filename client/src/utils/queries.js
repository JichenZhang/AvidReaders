import { useLocation } from 'react-router-dom'

const useQuery = () => {
	return new URLSearchParams(useLocation().search);
}

const baseUrl = 'http://localhost:3001'

const globalStorage = {
	books: {},
	authors: {},
	series: {},
	genres: ["children","comics, graphic","fantasy, paranormal","fiction","history, historical fiction, biography","mystery, thriller, crime","non-fiction","poetry","romance","young-adult"]
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

async function getGenres(){
	if(globalStorage.genres){
		console.log('genres', globalStorage.genres)
		return globalStorage.genres
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

async function addToWishlist(User_ID, Book_ID) {
	const route = '/wishlist'
	const url = `${baseUrl}${route}`
	try {
		await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ User_ID, Book_ID })
		})
	} catch (error) {
		alert(error)
	}
}

async function removeFromWishlist(User_ID, Book_ID) {
	const route = '/wishlist'
	const url = `${baseUrl}${route}?User_ID=${User_ID}&Book_ID=${Book_ID}`
	try {
		await fetch(url, {
			method: 'DELETE',
		})
	} catch (error) {
		alert(error)
	}
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

/**
 * returns a promise of the query result
 * @param {String} type 'book'||'author'||'series'
 * @param {Object} query 
 */
async function search(type, query) {
	const route = '/search'
	let url = `${baseUrl}${route}?type=${type}`
	for (const key in query) {
		url += `&${key}=${query[key]}`
	}
	return new Promise(async (resolve, reject) => {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		})
		if (response.ok) {
			const res = await response.json()
			resolve(res)
		}else{
			reject(response)
		}
	})

}

export { globalStorage, authenticate, createAccount, getWishlist, addToWishlist, removeFromWishlist, getBookDetails, deepCopy, useQuery, search, getGenres }
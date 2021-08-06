
const baseUrl = 'http://localhost:3001'

/**
 * 
 * @param {{login, password}} 
 * @param {({userID, name})=>{}} userInfoCallback 
 * @returns true on success
 */
async function authenticate(authData, userInfoCallback) {
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
		console.log(res)
		userInfoCallback(res)
		return true
	} else {
		alert('Could not authenticate, please try again.')
		return false
	}
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
 * @param {Number} bookID 
 * @param {({BookInfoPlus})=>{}} bookDetailsCallback 
 */
async function getBookDetails(bookID, bookDetailsCallback) {
	const route = '/book'
	const url = (
		baseUrl + route + '?id=' + bookID
	)
	const response = await fetch(url,{
		method: 'GET',
		headers:{
			'Accept': 'application/json'
		}
	})
	if (response.ok){
		const res = await response.json()
		bookDetailsCallback(res)
		return
	}else{
		console.error(response)
	}
}

export { authenticate, createAccount }
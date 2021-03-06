import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { globalStorage, authenticate, createAccount, getWishlist, getBookDetails } from '../utils/queries.js'
import { useDispatch, useSelector } from 'react-redux'
import { setUserID, setUserName, initWishlist } from '../utils/anySlice'

import './AuthPage.scss'

export default function AuthPage() {
	const [create, setCreate] = useState(false)
	const [form, setForm] = useState({
		login: '',
		password: '',
		name: ''
	})
	const history = useHistory()
	const dispatch = useDispatch()
	let inputBoxes = create ? [{
		title: 'Login', type: 'text'
	}, {
		title: 'Password', type: 'password'
	}, {
		title: 'Name', type: 'text'
	}] : [{
		title: 'Login', type: 'text'
	}, {
		title: 'Password', type: 'password'
	}]

	function userIDCallback(userID) {
		dispatch(setUserID(userID))
	}

	async function login() {
		console.log('sending form,', form)
		try {
			const user = await authenticate(form)
			dispatch(setUserID(user.User_ID))
			dispatch(setUserName(user.User_Name))
			const wishlist = await getWishlist(user.User_ID)
			dispatch(initWishlist(wishlist.map(x => x.Book_ID)))

			await Promise.all(wishlist.map(x => getBookDetails(x.Book_ID)))

			const path = '/dashboard'
			history.push(path)
		} catch (e) {
			console.error(e)
		}
	}
	/**
 * 
 * @param {String} title 
 * @param {String} type
 * @returns 
 */
	function AuthInput(title, type) {
		const onchange = (event) => {
			const txt = event.target.value
			switch (title) {
				case 'Login':
					setForm({ ...form, login: txt })
					break
				case 'Password':
					setForm({ ...form, password: txt })
					break
				case 'Name':
					setForm({ ...form, name: txt })
					break
				default:
					throw Error('Jichen has wrote a bug in AuthInput.onChange')
			}
		}
		return (
			<div className="auth-input" key={type}>
				<p>{title}</p>
				<input 
					type={type} 
					onChange={onchange} 
					value={form[title[0].toLowerCase() + title.slice(1)]} />
			</div>
		)
	}
	return (
		<div className="auth-page">
			{inputBoxes.map(box => AuthInput(box.title, box.type))}
			{!create &&
				<div
					className="sign-in-button"
					onClick={login}
				>Sign in
				</div>}
			<div
				className={create ? "sign-in-button" : "create-account-button"}
				onClick={create ? () => { createAccount(form, userIDCallback) } :
					() => { setCreate(true) }}
			>Create Account
			</div>
			{create &&
				<div
					className='create-account-button'
					onClick={() => { setCreate(false) }}
				>Sign in instead
				</div>}
		</div>

	)

}




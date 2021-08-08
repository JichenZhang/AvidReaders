import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { authenticate, createAccount, getWishlist, getBookDetails } from '../utils/queries.js'
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
	const User_ID = useSelector(state => state.any.User_ID)

	function userIDCallback(userID) {
		dispatch(setUserID(userID))
	}

	function userInfoCallback(userInfo) {
		dispatch(setUserID(userInfo.User_ID))
		dispatch(setUserName(userInfo.User_Name))
	}

	function wishlistCallback(wishlist) {
		dispatch(initWishlist(wishlist))
	}

	async function login() {
		console.log('sending form,', form)
		const success = await authenticate(form, userInfoCallback)
		if (success) {
			const path = '/dashboard'
			getWishlist(User_ID, wishlistCallback)
			history.push(path)
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
			<div className="auth-input">
				<p>{title}</p>
				<input type={type} onChange={onchange} />
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




import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import './AuthPage.scss'

export default function AuthPage() {
  const [create, setCreate] = useState(false)
  const history = useHistory()
  const login = () => {
    const path = '/dashboard'
    history.push(path)
  }
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
        onClick={create ? () => { console.log('creating account') } :
          () => { setCreate(true) }}
      >Create Account
      </div>
      {create &&
        <div
          lassName='create-account-button'
          onClick={() => { setCreate(false) }}
        >Sign in instead
        </div>}
    </div>

  )

}



/**
 * 
 * @param {String} title 
 * @param {String} type
 * @returns 
 */
function AuthInput(title, type) {
  return (
    <div className="auth-input">
      <p>{title}</p>
      <input type={type} />
    </div>
  )
}
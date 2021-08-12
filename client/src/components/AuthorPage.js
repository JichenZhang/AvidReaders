import React, { useState } from 'react';

import { useSelector, useStore } from 'react-redux'
import {HomeFilled} from '@ant-design/icons'

import './DetailPages.scss'

export default function AuthorPage() {
  const User_Name = useSelector(state=>state.User_Name)
  const typeBar = (
    <div className="type-bar">
      <HomeFilled className="home-icon" />
      <span
        className="type-span"
        style={{ borderBottomWidth: '0px' }}
      >Book</span>
      <span
        className="type-span"
        style={{ borderBottomWidth: '4px' }}
      >Author</span>
      <span
        className="type-span"
        style={{ borderBottomWidth: '0px' }}
      >Series</span>
    </div>
  )
  return (
    <div className="book-page">
      <div className="userName">{User_Name}</div>
      {typeBar}
    </div>
  )
}
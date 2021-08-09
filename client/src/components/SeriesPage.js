import React, { useState } from 'react';

import { useSelector, useStore } from 'react-redux'
import {HomeFilled} from '@ant-design/icons'

import './DetailsPage.scss'

export default function SeriesPage() {
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
        style={{ borderBottomWidth: '0px' }}
      >Author</span>
      <span
        className="type-span"
        style={{ borderBottomWidth: '4px' }}
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
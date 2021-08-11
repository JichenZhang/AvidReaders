import React, { useState, useEffect } from 'react';
import { useSelector, useStore } from 'react-redux'
import { HomeFilled } from '@ant-design/icons'

import { useQuery, getBookDetails } from '../utils/queries';

import './DetailsPage.scss'

export default function BookPage() {
	const query = useQuery()
	const id = query.get('id')
	const [bookData, setBookData] = useState(null)
	const User_Name = useSelector(state => state.User_Name)
	
	useEffect(()=>{ 
		const getBookData = async ()=>{ 
			const bookDetails = await getBookDetails(id)
			setBookData(bookDetails)
		}
		getBookData()
	}, [])

	console.log(bookData)

	const typeBar = (
		<div className="type-bar">
			<HomeFilled className="home-icon" />
			<span
				className="type-span"
				style={{ borderBottomWidth: '4px' }}
			>Book</span>
			<span
				className="type-span"
				style={{ borderBottomWidth: '0px' }}
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
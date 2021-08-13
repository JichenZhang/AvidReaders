import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import { HomeFilled } from '@ant-design/icons'
import randomColor from 'randomcolor'

import { useQuery, getBookDetails, getAuthorDetails, getSeriesDetails, addToWishlist, removeFromWishlist } from '../utils/queries';
import {
	addToWishlist as addToPersonalWishlist,
	removeFromWishlist as removeFromPersonalWishlist
} from '../utils/anySlice'

import Ratings from './Ratings'
import PieChart from './PieChart'


import './DetailPages.scss'
import { isConstructorDeclaration } from 'typescript';

export default function BookPage() {
	const query = useQuery()
	const history = useHistory()
	const [bookData, setBookData] = useState({})
	const [authorData, setAuthorData] = useState({})
	const [seriesData, setSeriesData] = useState({})
	const [rating, setRating] = useState(NaN)
	const [similarBookInfo, setSimilarBookInfo] = useState([])
	const User_Name = useSelector(state => state.any.User_Name)
	const Book_ID = Number(query.get('id'))

	useEffect(() => {
		const getBookData = async () => {
			const bookDetails = await getBookDetails(Book_ID)
			console.log(bookDetails)
			setBookData(bookDetails)
			setRating(getRating(bookDetails))
			let newAuthorData = authorData
			await Promise.all(bookDetails.authors?.map?.(id => {
				return new Promise(async resolve => {
					newAuthorData[id] = await getAuthorDetails(id)
					resolve()
				})
			}))
			console.log(newAuthorData)
			setAuthorData(newAuthorData)
			let newSeriesData = seriesData
			await Promise.all(bookDetails.series?.map?.(id => {
				return new Promise(async resolve => {
					newSeriesData[id] = await getSeriesDetails(id)
					resolve()
				})
			}))
			console.log(newSeriesData)
			setSeriesData(newSeriesData)
			try {
				const similarBooks = await Promise.all(bookDetails.similarBooks?.map?.(b => getBookDetails(b.Book_ID)))
				setSimilarBookInfo(similarBooks)
			} catch (e) {
				console.error(e)
			}
		}
		getBookData()
		return () => {
			setBookData({})
			setSimilarBookInfo([])
			setRating(NaN)
		}
	}, [Book_ID])

	const pieData = bookData?.genres?.map?.(
		genre => ({
			title: genre.Genre_Name,
			value: genre.Is_Tagged_As_Number_Of_Times,
			color: randomColor()
		})
	)

	function getRating(data) {
		try {
			return (data.Work_Ratings_Sum / data.Work_Ratings_Count).toFixed(2)
		} catch (e) {
			console.log(e)
			return NaN
		}
	}


	const typeBar = (
		<div className="type-bar">
			<HomeFilled className="home-icon"
				onClick={() => { history.push('/dashboard') }}
			/>
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
	function getAuthorName(){
		try{
			debugger
			let s =  authorData[bookData.authors[0]].Author_Name
			return s
		}catch(e){
			console.error(e)
		}
	}
	function getSeriesName(){
		try{
			let s = seriesData[bookData.series[0]].Series_Name
			return s
		}catch(e){
			console.error(e)
		}
	}
	return (
		<div className="book-page">
			<div className="userName">{User_Name}</div>
			{typeBar}
			<div className="content-pane">
				<div className="detail-col">
					<div className="img-col">
						<img src={bookData?.Book_Image}></img>
						<WishlistButton Book_ID={Book_ID} />
					</div>
					<div className='text-col'>
						<p>Title: {bookData?.Book_Title}</p>
						<p>Author: {getAuthorName()}</p>
						<p>Series: {}</p>
						<Ratings
							value={rating}
							count={bookData?.Work_Ratings_Count}
						/>
						<p>Description:<br /> {bookData?.Book_Description}</p>
						<br />
						<p># of Pages: {bookData?.Book_Number_Of_Pages}</p>
						<p>Original Publish Date: {bookData?.Work_Original_Publish_Date}</p>
					</div>
				</div>
				<div className="pie-col">
					<p>Genres</p>
					<PieChart
						data={pieData}
						label={({ dataEntry }) => dataEntry.title}
						labelStyle={index => ({
							fill: pieData[index].color,
							fontSize: '8px',
							fontFamily: 'sans-serif'
						})}
						lineWidth={20}
						paddingAngle={18}
						rounded
						labelPosition={50}
						style={{
							marginTop: '16px',
							height: '300px',
						}}
					/>
					<p>Readers Also Enjoyed</p>
					<ul>
						{similarBookInfo.map(otherBook => <li
							className="book-btn"
							onClick={() => {
								history.push(`/book/?id=${otherBook.Book_ID}`
								)
							}}
							key={otherBook.Book_ID}
						>{otherBook.Book_Title}</li>)
						}
					</ul>
				</div>
			</div>
		</div>
	)
}
function WishlistButton({ Book_ID }) {
	const dispatch = useDispatch()
	const User_ID = useSelector(state => state.any.User_ID)
	const wishlist = useSelector(state => state.any.wishlist)
	if (User_ID) { // logged in
		if (!wishlist.includes(Book_ID)) {
			return <div className='add-to-wishlist-btn'
				onClick={() => {
					addToWishlist(User_ID, Book_ID)
					dispatch(addToPersonalWishlist(Book_ID))
				}}
			>Add to Wishlist</div>
		} else { // not in wishlist
			return <div className='add-to-wishlist-btn'
				onClick={() => {
					removeFromWishlist(User_ID, Book_ID)
					dispatch(removeFromPersonalWishlist(Book_ID))
				}}
			>Remove from Wishlist</div>
		}
	} else {
		return <></>
	}
}
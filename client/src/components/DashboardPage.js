import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useStore } from 'react-redux'
import { Select, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { globalStorage, getBookDetails, deepCopy } from '../utils/queries'
import './DashboardPage.scss';
export default function DashboardPage(bookData) {
	const { Option } = Select;
	const history = useHistory()
	const { cache } = useStore() // accessing the global cache
	const User_Name = useSelector(state => state.any.User_Name)
	const User_ID = useSelector(state => state.any.User_ID)
	const wishlist = useSelector(state => state.any.wishlist)
	const [wishlistData, setWishlistData] = useState([])

	useEffect(() => {
		async function fetchWishlist() {
			const rawData = await Promise.all(wishlist.map(id => getBookDetails(id)))
			const fixedData = rawData.map(book => {
				const newEntry = deepCopy(book)
				newEntry.key = book.Book_ID
				newEntry.author = book.authors[0]?.Author_Name
				newEntry.series = book.series[0]?.Series_Name
				newEntry.title = book.Book_Title
				newEntry.genre = book.genres[0]?.Genre_Name
				return newEntry
			})
			setWishlistData(fixedData)
		}
		fetchWishlist()
	}, [])

	const navigateTo = (url) => {
		history.push(url)
	}

	const bookOnClick = (row) => {
		// TODO
		navigateTo(`book?id=${row.Book_ID}`)
	}
	const authorOnClick = (row) => {
		// TODO
		navigateTo('author')
	}
	const seriesOnClick = (row) => {
		// TODO
		navigateTo('series')
	}

	console.log(wishlistData)

	const columns = [
		{
			title: 'Title',
			dataIndex: 'title',
			key: 'title',
			width: '300px',
			align: 'center',
			render: (text, record, index) =>
				<p
					className='book-cell'
					onClick={() => bookOnClick(wishlistData[index])}
				>{text}
				</p>
		}, {
			title: 'Author',
			dataIndex: 'author',
			key: 'author',
			width: '300px',
			align: 'center',
			render: (text, record, index) =>
				<p
					className='book-cell'
					onClick={() => authorOnClick(wishlistData[index])}
				>{text}
				</p>
		}, {
			title: 'Series',
			dataIndex: 'series',
			key: 'series',
			width: '300px',
			align: 'center',
			render: (text, record, index) =>
				<p
					className='book-cell'
					onClick={() => seriesOnClick(wishlistData[index])}
				>{text}
				</p>
		}, {
			title: 'Genre',
			dataIndex: 'genre',
			key: 'genre',
			width: '300px',
			align: 'center',
			render: (text) =>
				<p
					className='book-cell'
				>{text}
				</p>
		}
	]
	return (
		<div className="dashboard-page">
			<div className="userName">{User_Name}</div>
			<div className="search-row">
				<div className='search-by'>Search by</div>
				<div className='select-container'>
					<Select
						className='drop-down'
						defaultValue={'title'}
						size={'large'}
					>
						<Option value={'title'}>Title</Option>
						<Option value={'author'}>Author</Option>
						<Option value={'series'}>Series</Option>
					</Select>
				</div>
				<div className='search-box'>
					<div id='search-box-row1'>
						<input />
						<div className='search-button'>
							<SearchOutlined className='search-icon' />
						</div>
					</div>
					<div id='advanced-search' onClick={() => navigateTo('/advancedSearch')}>Advanced Search</div>
				</div>
			</div>
			<div className='wishlist-title'>Your Wishlist</div>
			<Table
				dataSource={wishlistData}
				columns={columns}
				width={'1200px'}
				style={{ color: 'white' }}
			></Table>
		</div>
	)
}
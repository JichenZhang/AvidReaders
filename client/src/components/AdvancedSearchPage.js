import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Select, InputNumber, DatePicker, Table } from 'antd'
import { HomeFilled } from '@ant-design/icons'
import { useSelector } from 'react-redux'

import { search, getGenres } from '../utils/queries'

import './AdvancedSearchPage.scss'

export default function AdvancedSearchPage() {
	const [type, setType] = useState('book') // book, author, series
	const [searchResult, setSearchResult] = useState([])
	const [genres, setGenres] = useState([])
	const history = useHistory()

	useEffect(()=>{ 
		const getGenreCallback = async ()=>{
			const genres = await getGenres()
			setGenres(genres)
		}
		getGenreCallback()
	}, [])
	const navigateTo = (url) => {
		history.push(url)
	}
	const User_Name = useSelector(state => state.any.User_Name)

	const typeBar = (
		<div className="type-bar">
			<HomeFilled
				className="home-icon"
			/>
			<span
				className="type-span"
				style={type === 'book' ? { borderBottomWidth: '4px' } : { borderBottomWidth: '0px' }}
				onClick={() => setType('book')}
			>Book</span>
			<span
				className="type-span"
				style={type === 'author' ? { borderBottomWidth: '4px' } : { borderBottomWidth: '0px' }}
				onClick={() => setType('author')}
			>Author</span>
			<span
				className="type-span"
				style={type === 'series' ? { borderBottomWidth: '4px' } : { borderBottomWidth: '0px' }}
				onClick={() => setType('series')}
			>Series</span>
		</div>
	)
	/**
	 * as a callback, provided to the search form. 
	 * This is called when pressing the search button
	 * @param {form-result} value 
	 */
	const onFinishForm = async (value) => {
		if (value.datefrom?.format?.('YYYY')) {
			value.datefrom = value.datefrom.format('YYYY')
		}
		if (value.dateto?.format?.('YYYY')) {
			value.dateto = value.dateto.format('YYYY')
		}
		const searchResult = await search(type, value)
		console.log('searchresult')
		console.log(...searchResult)
		setSearchResult(searchResult)
	}
	const searchPane = (
		<div className="search-pane">
			<Form
				name="search-pane"
				layout='vertical'
				onFinish={onFinishForm}
			>
				{(type !== 'author') && <Form.Item
					label='Title:'
					name="title"
				>
					<Input />
				</Form.Item>}
				{(type !== 'author') && <Form.Item
					label='Author:'
					name="author"
				>
					<Input />
				</Form.Item>}
				{(type === 'author') && <Form.Item
					label='Name:'
					name="name"
				>
					<Input />
				</Form.Item>}
				{(type !== 'series') && <Form.Item
					label='Series:'
					name="series"
				>
					<Input />
				</Form.Item>}
				<Form.Item
					label='Genre:'
					name='genre'
				>
					<Select
						style={{ backgroundColor: 'white', height: '55px' }}
						defaultValue='anygenre'>
						<Select.Option value=''>Any Genre</Select.Option>
						{genres.map(name=>{
							return <Select.Option value={name}>{name}</Select.Option>}
						)}
					</Select>
				</Form.Item>
				{(type === 'book') && <Form.Item
					label='Format:'
					name="format"
				>
					<Input />
				</Form.Item>}

				<Form.Item label="Number of Pages:" style={{ marginBottom: 0 }}>
					<Form.Item
						name='pagefrom'
						style={{
							display: 'inline-block',
							width: '125px'
						}}
					>
						<InputNumber />
					</Form.Item>
					<span style={{
						display: 'inline-block',
						width: '57px',
						textAlign: 'center',
					}}
					> - </span>
					<Form.Item
						name='pageto'
						style={{
							display: 'inline-block',
							width: '125px'
						}}
					>
						<InputNumber />
					</Form.Item>
				</Form.Item>
				<Form.Item label='Original Publish Date:' style={{ marginBottom: 0 }}>
					<Form.Item name='datefrom' style={{ display: 'inline-block', width: '125px', fontSize: '25px', color: 'black' }}>
						<DatePicker picker='year' />
					</Form.Item>
					<span style={{
						display: 'inline-block',
						width: '57px',
						textAlign: 'center',
					}}
					> - </span>
					<Form.Item name='dateto' style={{ display: 'inline-block', width: '125px', fontSize: '25px', color: 'black' }}>
						<DatePicker picker='year' />
					</Form.Item>
				</Form.Item>
				<Form.Item>
					<input className="search-button" type="submit" value='Search' />
				</Form.Item>
			</Form>
		</div>
	)
	function getResultPane() {
		const columns = {
			'book':
				[{
					title: 'Title',
					dataIndex: 'Book_Title',
					key: 'Book_Title',
					width: '300px',
					align: 'center',
					render: (text, record) => <p
						style={{ color: 'white', cursor: 'pointer'}}
						onClick={() => { navigateTo(`/book?id=${record.Book_ID}`) }}
					>{text}</p>,
				}, {
					title: 'Rating',
					dataIndex: 'Book_Average_Rating',
					key: 'Book_Average_Rating',
					width: '300px',
					align: 'center',
					render: (text) => <p style={{ color: 'white' }}>{text}</p>
				}, {
					title: '# of Pages',
					dataIndex: 'Book_Number_Of_Pages',
					key: 'Book_Number_Of_Pages',
					width: '300px',
					align: 'center',
					render: (text) => <p style={{ color: 'white' }}>{text}</p>
				},
			],
			'author':[{

			}]
		}
		return <Table
			dataSource={searchResult}
			columns={columns[type]}
			width='1000px'
			style={{
				color: 'white',
				marginLeft: '124px',
				marginTop: '132px'
			}}
		/>
	}
	return (
		<div className="advanced-search-page">
			<div className="userName">{User_Name}</div>
			{typeBar}
			<div className="info-row">
				{searchPane}
				{getResultPane()}
			</div>
		</div>
	)

}
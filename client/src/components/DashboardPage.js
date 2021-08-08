import React from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useStore } from 'react-redux'
import { Select, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import './DashboardPage.scss';
export default function DashboardPage(options) {
  const { Option } = Select;
  const history = useHistory()
  const { cache } = useStore() // accessing the global cache
  const User_Name = useSelector(state => state.any.User_Name)
  const User_ID = useSelector(state => state.any.User_ID)

  const navigateTo = (url) => {
    history.push(url)
  }
  
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '300px',
      align: 'center',
    }, {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      width: '300px',
      align: 'center'
    }, {
      title: 'Series',
      dataIndex: 'series',
      key: 'series',
      width: '300px',
      align: 'center'
    }, {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      width: '300px',
      align: 'center'
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
          <div id='advanced-search' onClick={()=>navigateTo('/advancedSearch')}>Advanced Search</div>
        </div>
      </div>
      <div className='wishlist-title'>Your Wishlist</div>
      <Table columns={columns} width={'1200px'}></Table>
    </div>
  )
}
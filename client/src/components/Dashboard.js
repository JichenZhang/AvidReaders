import React from 'react'
import { Select, Table } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import '../App.scss';
export default function Dashboard(options) {
  const { Option } = Select;
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
    <div className="dashboard">
      <div className="userName">(Name)</div>
      <div className="search-row">
        <div className='search-by'>Search by</div>
        <Select
          className='drop-down'
          defaultValue={'title'}
          size={'large'}
        >
          <Option value={'title'}>Title</Option>
          <Option value={'author'}>Author</Option>
          <Option value={'series'}>Series</Option>
        </Select>
        <div className='search-box'>
          <div id='search-box-row1'>
            <input />
            <div className='search-button'>
              <SearchOutlined className='search-icon' />
            </div>
          </div>
          <div id='advanced-search'>Advanced Search</div>
        </div>
      </div>
      <div className='wishlist-title'>Your Wishlist</div>
      <Table columns={columns} width={'1200px'}></Table>
    </div>
  )
}
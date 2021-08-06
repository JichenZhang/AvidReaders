import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Form, Input, Select, InputNumber, DatePicker, Row, Col } from 'antd'
import { HomeFilled } from '@ant-design/icons'

import './AdvancedSearchPage.scss'

export default function AdvancedSearchPage() {
  const [type, setType] = useState('book') // book, author, series
  const history = useHistory()
  const navigateTo = (url) =>{ 
    history.push(url)
  }

  const typeBar = (
    <div className="type-bar">
      <HomeFilled 
        className="home-icon" 
        onClick={()=>navigateTo('/dashboard')}
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

  const searchPane = (
    <div className="search-pane">
      <Form
        name="search-pane"
        layout='vertical'
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
            <Select.Option value='anygenre'>Any Genre</Select.Option>
          </Select>
        </Form.Item>
        {(type === 'book') && <Form.Item
          label='Format:'
          name="format"
        >
          <Input />
        </Form.Item>}

        <Form.Item label="Number of Pages:" style={{marginBottom: 0}}>
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
        <Form.Item label='Original Publish Date:'style={{marginBottom:0}}>
          <Form.Item name='datefrom' style={{display: 'inline-block', width: '125px'}}>
            <DatePicker />
          </Form.Item>
          <span style={{
            display: 'inline-block',
            width: '57px',
            textAlign: 'center',
          }}
          > - </span>
          <Form.Item name='dateto' style={{display: 'inline-block', width: '125px'}}>
            <DatePicker />
          </Form.Item>
        </Form.Item>
      </Form>
    </div>
  )

  return (
    <div className="advanced-search-page">
      <div className="userName">(Name)</div>
      {typeBar}
      {searchPane}
    </div>
  )

}
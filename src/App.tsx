import React from 'react'
import * as helper from './utils/helper'
import { Word } from './models/word'

// antd
import {
  Button,
  Input,
  List,
  Modal,
  Form,
  Rate,
  Select
} from 'antd'

const { Option } = Select
const { confirm } = Modal

export default class App extends React.Component<any, any> {

  readonly state = {
    words: [] as Array<Word>,
    word: {
      name: '',
      translation: '',
      type: '名',
      familiarity: 2
    } as Word,
    dialogVisible: false
  }
  
  componentDidMount() {
    // helper.cleanWords()
    // 新增加词语
    // helper.updateWord({
    //   name: '日本語',
    //   translation: '日语',
    //   type: '名',
    //   familiarity: 3,
    //   sentence: '私は日本語を勉強しています'
    // })
    // helper.updateWord({
    //   name: 'ある',
    //   translation: '有，在（非意志者）',
    //   type: '动1',
    //   familiarity: 3,
    //   sentence: '机の上に猫があります',
    //   transforms: [{
    //     type: '基本形',
    //     name: 'ある'
    //   }, {
    //     type: 'ます形',
    //     name: 'あります'
    //   }, {
    //     type: 'ない形',
    //     name: 'ない'
    //   }, {
    //     type: 'て形',
    //     name: 'あって'
    //   }, {
    //     type: 'た形',
    //     name: 'あった'
    //   }]
    // })
    this.fetchWords()
  }

  fetchWords = () => {
    let words: Array<Word> = helper.filterWords({})
    this.setState({
      words
    })
  }

  handleSearch = (e: any) => {
    let words: Array<Word> = helper.filterWords({
      name: e.target.value
    })
    this.setState({
      words
    })
  }

  showModal = () => {
    this.resetForm()
    this.setState({
      dialogVisible: true
    })
  }

  handleEdit = (word: Word) => {
    this.setState({
      word,
      dialogVisible: true
    })
  }

  handleDelete = (word:Word) => {
    // dialog 确认
    confirm({
      title: '确定删除当前单词吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        // 删除单词
        helper.delWord(word.name)
        // 重新加载列表
        this.fetchWords()
      }
    })
  }

  handleSave = (e: any) => {
    // 保存词汇
    helper.updateWord(this.state.word)
    // 重新加载列表
    this.fetchWords()
    this.setState({
      dialogVisible: false
    })
  }

  handleCancel = (e: any) => {
    this.setState({
      dialogVisible: false
    })
  }

  handleInputChange = (key: string, e: any) => {
    let word = { ...this.state.word }
    switch (key) {
      case 'type':
        word.type = e
        break
      case 'familiarity':
        word.familiarity = e
        break
      case 'name':
        word.name = e.target.value
        break
      case 'sentence':
        word.sentence = e.target.value
        break
      case 'translation':
        word.translation = e.target.value
        break
      default:
        break
    }
    this.setState({ word })
  }

  resetForm = (): void => {
    this.setState({
      word: {
        name: '',
        translation: '',
        type: '名',
        familiarity: 2
      }
    })
  }
  
  render () {
    let { words } = this.state
    
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }

    const familiarityList = ['陌生', '一般', '熟悉']

    type Status = '' | 'error' | 'success' | 'warning' | 'validating' | undefined
    let nameStatus: Status = this.state.word.name.trim() === '' ? 'warning' : 'success'
    let translationStatus: Status = this.state.word.translation.trim() === '' ? 'warning' : 'success'
    let saveDisabled = nameStatus !== 'success' && translationStatus !== 'success'
    
    return (
      <div id='app'>
        <h1>Ciaran</h1>
        <div className='add-panel'>
          <Button className='add-button' type='dashed' icon='plus' size='large' onClick={ this.showModal }>新增单词</Button>
        </div>
        <div className='input-panel'>
          <Input size='large' className='inputer' placeholder='请输入词语' onChange={ this.handleSearch }/>
        </div>
        <List
          className='list-panel'
          header={ <div>工具栏</div> }
          bordered
          dataSource={ words }
          renderItem={ (word: Word) => (
            <List.Item>
              <div className='word-list-line'>
                <div className='word-name'>{ word.name }</div>
                <div className='word-type'>[{ word.type }]</div>
                <div className='word-translation'>{ word.translation }</div>
                <div className='word-sentence'>{ word.sentence }</div>
                <Button onClick={ this.handleEdit.bind(this, word) } icon='edit' type='dashed' className='word-edit-button'></Button>
                <Button onClick={ this.handleDelete.bind(this, word) } icon='delete' type='danger' className='word-delete-button'></Button>
              </div>
            </List.Item>
          )}
        />
        <Modal
          title='单词编辑'
          visible={ this.state.dialogVisible }
          onOk={ this.handleSave }
          onCancel={ this.handleCancel }
          footer={[
            <Button key='back' onClick={ this.handleCancel }>
              返回
            </Button>,
            <Button key='submit' type='primary' onClick={ this.handleSave } disabled={ saveDisabled }>
              保存
            </Button>,
          ]}
        >
          <Form {...formItemLayout}>
            <Form.Item
              label='词语'
              required
              hasFeedback={ nameStatus !== 'success' }
              validateStatus={ nameStatus }>
              <Input placeholder='请输入词语' onChange={ this.handleInputChange.bind(this, 'name') } value={ this.state.word.name }/>
            </Form.Item>
            <Form.Item label='词性'>
              <Select placeholder='选择词性' onChange={ this.handleInputChange.bind(this, 'type') } value={ this.state.word.type }>
                <Option value='名'>名词</Option>
                <Option value='动1'>一类动词</Option>
                <Option value='动2'>二类动词</Option>
                <Option value='动3'>三类动词</Option>
                <Option value='形1'>一类形容词</Option>
                <Option value='形2'>二类形容词</Option>
                <Option value='副'>副词</Option>
                <Option value='叹'>叹词</Option>
                <Option value='专'>专有名词</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='翻译'
              required
              hasFeedback={ translationStatus !== 'success' }
              validateStatus={ translationStatus }>
              <Input placeholder='请输入翻译' onChange={ this.handleInputChange.bind(this, 'translation') } value={ this.state.word.translation }/>
            </Form.Item>
            <Form.Item label='例句'>
              <Input placeholder='请输入例句' onChange={ this.handleInputChange.bind(this, 'sentence') } value={ this.state.word.sentence }/>
            </Form.Item>
            <Form.Item label='熟悉度'>
              <Rate count={ 3 } onChange={ this.handleInputChange.bind(this, 'familiarity') } tooltips={ familiarityList } value={ this.state.word.familiarity }/>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

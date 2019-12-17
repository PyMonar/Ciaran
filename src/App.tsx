import React from 'react'
import * as helper from './utils/helper'
import { Word, Transform } from './models/word'

// antd
import {
  Button,
  Input,
  List,
  Modal,
  Form,
  Radio,
  Select,
  Tag
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
    transforms: [{
      type: '基本形',
      name: ''
    }, {
      type: 'ます形',
      name: ''
    }, {
      type: 'ない形',
      name: ''
    }, {
      type: 'て形',
      name: ''
    }, {
      type: 'た形',
      name: ''
    }] as Array<Transform>,
    dialogVisible: false
  }
  
  componentDidMount() {
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
    let transforms
    if (word.transforms) {
      transforms = word.transforms
    } else {
      transforms = [{
        type: '基本形',
        name: ''
      }, {
        type: 'ます形',
        name: ''
      }, {
        type: 'ない形',
        name: ''
      }, {
        type: 'て形',
        name: ''
      }, {
        type: 'た形',
        name: ''
      }]
    }
    this.setState({
      word,
      transforms,
      dialogVisible: true
    })
  }

  handleTransformItemChange = (index: number, e: any) => {
    let transforms = this.state.transforms
    transforms[index].name = e.target.value
    this.setState({
      transforms
    })
  }

  handleDelete = (word:Word) => {
    // dialog 确认
    confirm({
      title: '确定删除当前单词吗？',
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        // 删除单词
        helper.delWord(word.name)
        // 重新加载列表
        this.fetchWords()
      }
    })
  }

  handleSave = (e: any) => {
    let word = this.state.word
    // 如果是动词，则赋值形变
    if (word.type === '动1' || word.type === '动2' || word.type === '动3') {
      word.transforms = this.state.transforms
    }
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
        word.familiarity = e.target.value
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
    let { words, transforms } = this.state
    
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    }

    const familiarityList = [{
      name: '陌生',
      color: '#dddddd'
    }, {
      name: '一般',
      color: '#2db7f5'
    }, {
      name: '熟悉',
      color: '#87d068'
    }]

    type Status = '' | 'error' | 'success' | 'warning' | 'validating' | undefined
    let nameStatus: Status = this.state.word.name.trim() === '' ? 'warning' : 'success'
    let translationStatus: Status = this.state.word.translation.trim() === '' ? 'warning' : 'success'
    let saveDisabled = nameStatus !== 'success' && translationStatus !== 'success'

    let wordHasTransform = this.state.word.type === '动1' || this.state.word.type === '动2' || this.state.word.type === '动3'
    
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
                <Tag color={ familiarityList[word.familiarity - 1].color }>{ familiarityList[word.familiarity - 1].name }</Tag>
                <div className='word-name'>{ word.name }</div>
                <div className='word-type'>[{ word.type }]</div>
                <div className='word-translation'>{ word.translation }</div>
                <div className='word-sentence'>{ word.sentence }</div>
                <Button onClick={ this.handleEdit.bind(this, word) } icon='edit' type='dashed' className='word-edit-button'></Button>
                <Button onClick={ this.handleDelete.bind(this, word) } icon='delete' type='dashed' className='word-delete-button'></Button>
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
            <Form.Item label='形变' className={ wordHasTransform ? '' : 'hide' }>
              {
                transforms.map((item: Transform, index: number) => {
                  return <Input placeholder={ item.type } key={ item.type } value={ item.name } onChange={ this.handleTransformItemChange.bind(this, index) }/>
                })
              }
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
              <Radio.Group onChange={ this.handleInputChange.bind(this, 'familiarity') } value={ this.state.word.familiarity }>
                <Radio.Button value={ 1 }>陌生</Radio.Button>
                <Radio.Button value={ 2 }>一般</Radio.Button>
                <Radio.Button value={ 3 }>熟悉</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

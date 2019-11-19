import React from 'react'
import * as helper from './utils/helper'
import { Word } from './models/word'

export default class App extends React.Component<any, any> {

  readonly state = {
    words: []
  }
  
  componentDidMount() {
    // helper.cleanWords()
    // 新增加词语
    helper.updateWord({
      name: '日本語',
      translation: '日语',
      type: '名',
      familiarity: '熟悉',
      sentence: '私は日本語を勉強しています'
    })
    helper.updateWord({
      name: 'ある',
      translation: '有，在（非意志者）',
      type: '动1',
      familiarity: '熟悉',
      sentence: '机の上に猫があります',
      transforms: [{
        type: '基本形',
        name: 'ある'
      }, {
        type: 'ます形',
        name: 'あります'
      }, {
        type: 'ない形',
        name: 'ない'
      }, {
        type: 'て形',
        name: 'あって'
      }, {
        type: 'た形',
        name: 'あった'
      }]
    })
    let words: Array<Word> = helper.filterWords({})
    this.setState({
      words
    })
  }
  
  render () {
    let { words } = this.state
    return (
      <div id='app'>
        <h1>Helper</h1>
        <div className='input-panel'>
          <input type='text' name='name' className='inputer' placeholder='请输入词语'/>
        </div>
        <div className='list-panel'>
          {
            words.map((word: Word) => {
              return <div>{ `${word.name} [${word.type}] ${word.translation}` }</div>
            })
          }
        </div>
      </div>
    )
  }
}

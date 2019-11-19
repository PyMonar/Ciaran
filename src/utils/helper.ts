import { Word, WordDictionary, Query } from '../models/word'

/**
 * 从本地存储中获取数据
 */
export function fetchWordDictionary (): WordDictionary {
  let storeJSON: string = localStorage.getItem('dictionaryJSON') || '{}'
  let dictionary: WordDictionary = JSON.parse(storeJSON)
  return dictionary
}

/**
 * 存储数据到本地
 */
export function saveWords (dictionary: WordDictionary): void {
  localStorage.setItem('dictionaryJSON', JSON.stringify(dictionary))
}

/**
 * 清空词库
 */
export function cleanWords (): void {
  localStorage.clear()
}

/**
 * 新增/更新一个单词
 */
export function updateWord (word: Word): void {
  let dictionary: WordDictionary = fetchWordDictionary()
  if (word.name in dictionary) {
    return
  }
  dictionary[word.name] = word
  saveWords(dictionary)
}

/**
 * 删除一个单词
 */
export function delWord (name: string): void {
  let dictionary: WordDictionary = fetchWordDictionary()
  delete dictionary[name]
  saveWords(dictionary)
}

/**
 * 根据条件查询单词
 */
export function filterWords (query: Query): Array<Word> {
  let dictionary: WordDictionary = fetchWordDictionary()
  let result: Array<Word> = []
  // 将字典转化为数组
  for (const name in dictionary) {
    const word = dictionary[name]
    result.push(word)
  }
  
  // 根据 name 过滤
  if ('name' in query) {
    result = result.filter(word => word.name === query.name)
  }
  // 根据 type 过滤
  if ('type' in query) {
    result = result.filter(word => word.type === query.type)
  }
  // 根据 familiarity 过滤
  if ('familiarity' in query) {
    result = result.filter(word => word.familiarity === query.familiarity)
  }
  return result
}

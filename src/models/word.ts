/**
 * 词性
 */
export type WordType = '名' | '动1' | '动2' | '动3' | '形1' | '形2' | '副' | '叹' | '专'

/**
 * 熟悉程度
 */
export type FamiliarityType = 1 | 2 | 3

/**
 * 动词变形类型
 */
export type TransformType = '基本形' | 'ます形' | 'て形' | 'ない形' | 'た形'

/**
 * 动词变形
 */
export interface Transform {
  // 变形类型
  type: TransformType,
  // 变形后词语
  name: string
}

/**
 * 单词类
 */
export interface Word {
  // 词语名
  name: string,
  // 翻译
  translation: string,
  // 词性
  type: WordType,
  // 熟悉程度
  familiarity: FamiliarityType,
  // 动词词语变形
  transforms?: Array<Transform>,
  // 例句
  sentence?: string
}

/**
 * 单词字典
 */
export interface WordDictionary {
  [propertyName: string]: Word
}

/**
 * 查询对象
 */
export interface Query {
  // 词语名
  name?: string,
  // 词性
  type?: WordType,
  // 词语熟悉程度
  familiarity?: FamiliarityType
}

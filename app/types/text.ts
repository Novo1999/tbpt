import { Descendant } from 'slate'

export type Text<T extends 'raw' | 'parsed' = 'raw'> = {
  id?: number
  content: T extends 'raw' ? string : Descendant[]
  userId?: number
  order: number
  isNew?: boolean
}

// Type aliases for convenience
export type RawText = Text<'raw'>
export type ParsedText = Text<'parsed'>
export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}
export type CustomElement =
  | { type: 'heading-one'; children: Descendant[] }
  | { type: 'heading-two'; children: Descendant[] }
  | { type: 'paragraph'; children: Descendant[] }
  | { type: 'list-item'; children: Descendant[] }
  | { type: 'block-quote'; children: Descendant[] }

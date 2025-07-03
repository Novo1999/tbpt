import { Descendant } from "slate"

export type Text<T extends 'raw' | 'parsed' = 'raw'> = {
  id: number
  content: T extends 'raw' ? string : Descendant[]
  userId?: number
  order: number
}

// Type aliases for convenience
export type RawText = Text<'raw'>
export type ParsedText = Text<'parsed'>
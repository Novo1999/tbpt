'use client'
import { useState } from 'react'
import { BaseEditor, createEditor } from 'slate'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

type CustomElement = { type: string; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]
const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
}

export default TextEditor

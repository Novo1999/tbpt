'use client'
import { CSSProperties, KeyboardEvent, useCallback, useState } from 'react'
import { BaseEditor, createEditor, Editor, Element, Transforms } from 'slate'
import { Editable, ReactEditor, RenderElementProps, RenderLeafProps, Slate, withReact } from 'slate-react'

type CustomElement = { type: string; children: CustomText[] }
type CustomText = { text: string; bold?: boolean; italic?: boolean }

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

const CodeElement = (props: RenderElementProps) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>
}

const Leaf = (props: RenderLeafProps) => {
  const leafStyle: CSSProperties = {}

  if (props.leaf.bold) {
    leafStyle.fontWeight = 'bold'
  }

  if (props.leaf.italic) {
    leafStyle.fontStyle = 'italic'
  }

  return (
    <span {...props.attributes} style={leafStyle}>
      {props.children}
    </span>
  )
}

const TextEditor = () => {
  const [editor] = useState(() => withReact(createEditor()))

  const renderEl = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, [])

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case '`': {
        event.preventDefault()
        const [match] = Editor.nodes(editor, {
          match: (n) => Element.isElement(n) && n.type === 'code',
        })
        Transforms.setNodes(editor, { type: match ? 'paragraph' : 'code' }, { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) })
        break
      }
      case 'b': {
        event.preventDefault()
        const editorMarks = Editor.marks(editor)
        if (editorMarks?.bold) {
          Editor.removeMark(editor, 'bold')
        } else {
          Editor.addMark(editor, 'bold', true)
        }
        break
      }
      case 'i': {
        event.preventDefault()
        const editorMarks = Editor.marks(editor)
        if (editorMarks?.italic) {
          Editor.removeMark(editor, 'italic')
        } else {
          Editor.addMark(editor, 'italic', true)
        }
        break
      }
    }
  }

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderLeaf={renderLeaf} renderElement={renderEl} onKeyDown={handleKeyDown} className="border p-4 rounded-lg" />
    </Slate>
  )
}

export default TextEditor

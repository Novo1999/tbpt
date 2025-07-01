import Html from 'slate-html-serializer'

const htmlSerializer = new Html({
  rules: [
    // Block rules
    {
      serialize(obj, children) {
        if (obj.object === 'block') {
          switch (obj.type) {
            case 'paragraph':
              return <p>{children}</p>
            case 'heading-one':
              return <h1>{children}</h1>
            case 'heading-two':
              return <h2>{children}</h2>
            case 'heading-three':
              return <h3>{children}</h3>
            case 'block-quote':
              return <blockquote>{children}</blockquote>
            case 'bulleted-list':
              return <ul>{children}</ul>
            case 'numbered-list':
              return <ol>{children}</ol>
            case 'list-item':
              return <li>{children}</li>
            case 'link':
              return <a href={obj.data.get('href')}>{children}</a>
            case 'code-block':
              return (
                <pre>
                  <code>{children}</code>
                </pre>
              )
          }
        }
      },
      deserialize(el, next) {
        const type = BLOCK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'block',
            type,
            data: {
              href: el.getAttribute('href'), // links
            },
            nodes: next(el.childNodes),
          }
        }
      },
    },
    // mark rules
    {
      serialize(obj, children) {
        if (obj.object === 'mark') {
          switch (obj.type) {
            case 'bold':
              return <strong>{children}</strong>
            case 'italic':
              return <em>{children}</em>
            case 'underline':
              return <u>{children}</u>
            case 'code':
              return <code>{children}</code>
            case 'strikethrough':
              return <del>{children}</del>
          }
        }
      },
      deserialize(el, next) {
        const type = MARK_TAGS[el.tagName.toLowerCase()]
        if (type) {
          return {
            object: 'mark',
            type,
            nodes: next(el.childNodes),
          }
        }
      },
      // Special rule for line breaks
    },
    {
      serialize(obj) {
        return obj.leaves.map((leaf) => {
          let text = leaf.text
          if (leaf.marks) {
            leaf.marks
              .forEach((mark: { type: string }) => {
                switch (mark.type) {
                  case 'bold':
                    text = `<strong>${text}</strong>`
                    break
                  case 'italic':
                    text = `<em>${text}</em>`
                    break
                  case 'underline':
                    text = `<u>${text}</u>`
                    break
                  case 'code':
                    text = `<code>${text}</code>`
                    break
                }
                return text
              })
              .join('')
          }
        })
      },
    },
  ],
})

export default htmlSerializer
// Define tag mappings
const BLOCK_TAGS: { [key: string]: string } = {
  p: 'paragraph',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  blockquote: 'block-quote',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  li: 'list-item',
  a: 'link',
  pre: 'code-block',
}

const MARK_TAGS: { [key: string]: string } = {
  strong: 'bold',
  b: 'bold',
  em: 'italic',
  i: 'italic',
  u: 'underline',
  code: 'code',
  del: 'strikethrough',
  s: 'strikethrough',
}

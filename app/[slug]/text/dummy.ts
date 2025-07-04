import { ParsedText } from '@/app/types/text'

export const dummyTextTabs: ParsedText[] = [
  {
    id: 1,
    content: [
      {
        type: 'heading-one',
        children: [{ text: 'Welcome to the Platform!' }],
      } as const,
      {
        type: 'paragraph',
        children: [
          {
            text: "Here's a quick overview of what you can expect from our amazing platform. We've designed everything with ",
          },
          { text: 'user experience', bold: true },
          { text: ' in mind.' },
        ],
      } as const,
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Easy to use interface' }],
          },
          {
            type: 'list-item',
            children: [{ text: 'Powerful features for productivity' }],
          },
          {
            type: 'list-item',
            children: [{ text: '24/7 customer support' }],
          },
        ],
      },
    ],
    order: 1,
  },
  {
    id: 2,
    content: [
      {
        type: 'heading-one',
        children: [{ text: 'Powerful Features' }],
      } as const,
      {
        type: 'paragraph',
        children: [
          { text: 'Our app includes ' },
          { text: 'powerful tools', bold: true },
          {
            text: ' designed to boost your productivity and streamline your workflow.',
          },
        ],
      } as const,
      {
        type: 'heading-two',
        children: [{ text: 'Key Features:' }],
      } as const,
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Real-time collaboration with ' }, { text: 'multiple users', italic: true }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Advanced text formatting and rich content editing' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Cloud synchronization across all your devices' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Export to multiple formats: ' }, { text: 'HTML, PDF, Markdown', code: true }],
          } as const,
        ],
      } as const,
      {
        type: 'block-quote',
        children: [
          {
            text: '"This platform has revolutionized how our team collaborates!" ',
          },
          { text: '- Happy Customer', italic: true },
        ],
      } as const,
    ],
    order: 2,
  },
  {
    id: 3,
    content: [
      {
        type: 'heading-one',
        children: [{ text: 'Customer Support' }],
      } as const,
      {
        type: 'paragraph',
        children: [
          { text: 'Need help? Our ' },
          { text: 'dedicated support team', bold: true },
          {
            text: ' is available anytime to assist you with any questions or issues.',
          },
        ],
      } as const,
      {
        type: 'heading-two',
        children: [{ text: 'How to Get Help:' }],
      } as const,
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Email us at: ' }, { text: 'support@platform.com', code: true }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Live chat available ' }, { text: '24/7', bold: true }, { text: ' on our website' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Call our helpline: ' }, { text: '+1-800-HELP-NOW', code: true }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Browse our comprehensive knowledge base' }],
          } as const,
        ],
      } as const,
      {
        type: 'paragraph',
        children: [{ text: 'Average response time: ' }, { text: 'Under 2 hours', bold: true, underline: true }],
      } as const,
    ],
    order: 3,
  },
  {
    id: 4,
    content: [
      {
        type: 'heading-one',
        children: [{ text: 'Terms and Conditions' }],
      } as const,
      {
        type: 'paragraph',
        children: [{ text: 'Please read and agree to our ' }, { text: 'terms and conditions', bold: true }, { text: ' before using our platform.' }],
      } as const,
      {
        type: 'heading-two',
        children: [{ text: 'Key Points:' }],
      } as const,
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'You must be ' }, { text: '18 years or older', bold: true }, { text: ' to use this service' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Content must comply with our community guidelines' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Account termination may occur for violations' }],
          } as const,
          {
            type: 'list-item',
            children: [
              {
                text: 'Service availability is subject to maintenance windows',
              },
            ],
          } as const,
        ],
      } as const,
      {
        type: 'block-quote',
        children: [
          {
            text: 'By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.',
            italic: true,
          },
        ],
      } as const,
      {
        type: 'paragraph',
        children: [{ text: 'Last updated: ' }, { text: 'December 2024', bold: true }],
      } as const,
    ],
    order: 4,
  },
  {
    id: 5,
    content: [
      {
        type: 'heading-one',
        children: [{ text: 'Privacy Policy' }],
      } as const,
      {
        type: 'paragraph',
        children: [
          { text: 'Your data is ' },
          { text: 'safe and secure', bold: true },
          {
            text: '. Read our comprehensive privacy policy to understand how we protect your information.',
          },
        ],
      } as const,
      {
        type: 'heading-two',
        children: [{ text: 'Data Protection:' }],
      } as const,
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'End-to-end encryption for all sensitive data' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'We ' }, { text: 'never sell', bold: true, underline: true }, { text: ' your personal information' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'GDPR and CCPA compliant data handling' }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Regular security audits by third-party experts' }],
          } as const,
        ],
      } as const,
      {
        type: 'heading-two',
        children: [{ text: 'What We Collect:' }],
      } as const,
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: 'Account information: ' }, { text: 'email, name, preferences', italic: true }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Usage analytics: ' }, { text: 'anonymized performance data', italic: true }],
          } as const,
          {
            type: 'list-item',
            children: [{ text: 'Content data: ' }, { text: 'your documents and projects', italic: true }],
          } as const,
        ],
      } as const,
      {
        type: 'paragraph',
        children: [
          {
            text: 'Questions about privacy? Contact our Data Protection Officer at ',
          },
          { text: 'privacy@platform.com', code: true },
        ],
      } as const,
    ],
    order: 5,
  },
]

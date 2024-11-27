import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

export const postsSlug = 'posts'

export const PostsCollection: CollectionConfig = {
  slug: postsSlug,
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              {
                slug: 'testblock1',
                fields: [
                  {
                    name: 'testfield',
                    type: 'text',
                  },
                ],
              },
            ],
            inlineBlocks: [
              {
                slug: 'myInlineBlock',
                fields: [
                  {
                    name: 'paragraph',
                    type: 'relationship',
                    relationTo: 'posts',
                  },
                ],
              },
              {
                slug: 'myInlineBlock2',
                fields: [
                  {
                    name: 'paragraph',
                    type: 'relationship',
                    relationTo: 'posts',
                  },
                ],
              },
            ],
          }),
        ],
      }),
    },
  ],
  versions: {
    drafts: true,
  },
}

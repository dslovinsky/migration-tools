/**
 * A simple function to convert a string to a Contentful rich text document
 * @param text
 * @returns
 */
const stringToRichText = (text: string) => ({
  data: {},
  content: [
    {
      data: {},
      content: [
        {
          data: {},
          marks: [],
          value: text,
          nodeType: 'text',
        },
      ],
      nodeType: 'paragraph',
    },
  ],
  nodeType: 'document',
});

export default stringToRichText;

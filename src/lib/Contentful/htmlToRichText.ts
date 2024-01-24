import { richTextFromMarkdown } from '@contentful/rich-text-from-markdown';
import TurndownService from 'turndown';

/**
 * Converts a string of HTML to a Contentful rich text object
 * @param html The HTML to convert
 * @returns A promise that resolves when the HTML is converted to a rich text object
 */
const htmlToRichText = async (html: string) => {
  const turndownService = new TurndownService();
  const markdown = turndownService.turndown(html);

  const richText = await richTextFromMarkdown(markdown);

  return richText;
};

export default htmlToRichText;

import { parse5ToStructuredText } from 'datocms-html-to-structured-text';
import { parse } from 'parse5';

/**
 * Converts a string of HTML to a DatoCMS structured text document
 * @param html The HTML string to convert
 * @returns A promise that resolves when the HTML is converted to a structured text object using the DAST document format
 */
const htmlToDast = async (html: string) => await parse5ToStructuredText(parse(html));

export default htmlToDast;

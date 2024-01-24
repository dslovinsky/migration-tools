import getDatoClient from 'lib/Dato/getDatoClient';
import { objectEntries } from 'utils/typeUtils';

type FieldValidations = {
  [key: string]: {
    required?: Record<string, never> | undefined;
    unique?: Record<string, never> | undefined;
    slug_format?: { predefined_pattern: 'webpage_slug' } | undefined;
    required_seo_fields?: Record<'title' | 'description' | 'image' | 'twitter_card', boolean> | undefined;
    title_length?: { max: number } | undefined;
    description_length?: { max: number } | undefined;
    extension?: { extensions?: string[]; predefined_list?: 'image' } | undefined;
    required_alt_title?: { title: boolean; alt: boolean } | undefined;
    length?: { max?: number; min?: number } | undefined;
    // TODO: Add more validations
  };
};

/**
 * Updates validations on specified fields of a given DatoCMS content model
 * Useful to temporarily disable/re-enable validations on a model during migration to prevent validation errors from blocking the migration
 * @param model The model ID to update validations on
 * @param validations The validations to update
 * @returns A promise that resolves when the validations are updated
 * @example
 * await editValidation('blog_post', {
 *  category: {
 *   required: {},
 *  },
 *  excerpt: {
 *   length: { max: 110 },
 *  },
 */
const editValidation = async (model: string, validations: FieldValidations) => {
  const client = getDatoClient();
  const updatedFields = await Promise.all(
    objectEntries(validations).map(async ([key, value]) => {
      const fieldId = `${model}::${key}`;

      const field = await client.fields.find(fieldId);
      if (!field) {
        throw new Error(`Field ${fieldId} not found`);
      }

      return await client.fields.update(fieldId, {
        validators: {
          ...field.validators,
          ...value,
        },
      });
    }),
  );

  return updatedFields;
};

export default editValidation;

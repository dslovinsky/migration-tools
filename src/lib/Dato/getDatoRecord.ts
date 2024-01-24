import type { Client } from '@datocms/cma-client-node';

/**
 * Gets a record from DatoCMS by a given field value
 * Dato's client.item.find() method only works if you know the ID of the record. This function allows you to find a record by the value of a field
 * @param client The Dato client
 * @param field The field to search by
 * @param value The value to search by
 * @param type Optional: The ID of the content model to search in
 * @returns The record, if found
 */
const getDatoRecord = async (client: Client, field: string, value: string, type?: string) => {
  const list = await client.items.list({
    filter: {
      type,
      fields: {
        [field]: {
          eq: value,
        },
      },
    },
  });

  return list[0];
};

export default getDatoRecord;

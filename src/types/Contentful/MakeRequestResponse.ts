/**
 * The returned data type from using `makeRequest` from `contentful-migration`
 */
export interface RequestData {
  sys: RequestDataSys;
  total: number;
  skip: number;
  limit: number;
  items: Item[];
}

export interface Item {
  sys: ItemSys;
  displayField: string;
  name: string;
  description: null | string;
  fields: Field[];
}

export interface Field {
  id: string;
  name: string;
  type: Type;
  localized: boolean;
  required: boolean;
  validations: FieldValidation[];
  disabled: boolean;
  omitted: boolean;
  items?: Items;
  defaultValue?: DefaultValue;
  linkType?: string;
}

export interface DefaultValue {
  'en-US': boolean;
}

export interface Items {
  type: Type;
  validations: ItemsValidation[];
  linkType?: string;
}

export enum Type {
  Array = 'Array',
  Boolean = 'Boolean',
  Date = 'Date',
  Integer = 'Integer',
  Link = 'Link',
  Symbol = 'Symbol',
  Text = 'Text',
}

export interface ItemsValidation {
  linkContentType?: string[];
  in?: string[];
}

export interface FieldValidation {
  in?: Array<number | string>;
  regexp?: Regexp;
  linkContentType?: string[];
}

export interface Regexp {
  pattern: string;
}

export interface ItemSys {
  space: CreatedBy;
  id: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  environment: CreatedBy;
  publishedVersion: number;
  publishedAt: Date;
  firstPublishedAt: Date;
  createdBy: CreatedBy;
  updatedBy: CreatedBy;
  publishedCounter: number;
  version: number;
  publishedBy: CreatedBy;
}

export interface CreatedBy {
  sys: CreatedBySys;
}

export interface CreatedBySys {
  type: Type;
  linkType: LinkType;
  id: string;
}

export enum LinkType {
  Environment = 'Environment',
  Space = 'Space',
  User = 'User',
}

export interface RequestDataSys {
  type: Type;
}

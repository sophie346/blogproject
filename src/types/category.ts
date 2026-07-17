/** Taxonomy entities. Until the BFF exposes real fields, these are derived
 * from tenant config and `seo.metaKeywords`. Shapes stay stable so a future
 * API only changes the services layer. */

export type Category = {
  slug: string;
  name: string;
  description?: string;
  count?: number;
};

export type Tag = {
  slug: string;
  name: string;
  count?: number;
};

export type Author = {
  slug: string;
  name: string;
  bio?: string;
  avatar?: string;
};

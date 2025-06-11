import { Taxonomy } from './taxonomy';

import { createApi } from '@/lib/api/factory';

export const TaxonomyApi = createApi<Taxonomy>('/cms/taxonomies');

export const {
  create: createTaxonomy,
  get: getTaxonomy,
  update: updateTaxonomy,
  delete: deleteTaxonomy,
  list: getTaxonomies
} = TaxonomyApi;

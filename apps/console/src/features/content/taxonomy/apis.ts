import { Taxonomy } from './taxonomy';

import { createApi } from '@/lib/api/factory';

export const TaxonomyApi = createApi<Taxonomy>('/cms/taxonomies');

export const createTaxonomy = TaxonomyApi.create;
export const getTaxonomy = TaxonomyApi.get;
export const updateTaxonomy = TaxonomyApi.update;
export const deleteTaxonomy = TaxonomyApi.delete;
export const getTaxonomies = TaxonomyApi.list;

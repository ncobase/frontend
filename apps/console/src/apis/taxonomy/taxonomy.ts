import { ExplicitAny, Taxonomy, Taxonomies } from '@ncobase/types';
import { buildQueryString } from '@ncobase/utils';

import { request } from '../request';

const ENDPOINT = '/v1/taxonomies';

// create
export const createTaxonomy = async (payload: Taxonomy): Promise<Taxonomy> => {
  return request.post(ENDPOINT, { ...payload });
};

// get
export const getTaxonomy = async (id: string): Promise<Taxonomy> => {
  return request.get(`${ENDPOINT}/${id}`);
};

// update
export const updateTaxonomy = async (payload: Taxonomy): Promise<Taxonomy> => {
  return request.put(ENDPOINT, { ...payload });
};

// delete
export const deleteTaxonomy = async (id: string): Promise<Taxonomy> => {
  return request.delete(`${ENDPOINT}/${id}`);
};

// list
export const getTaxonomies = async (params: ExplicitAny): Promise<Taxonomies> => {
  const queryString = buildQueryString(params);
  return request.get(`${ENDPOINT}?${queryString}`);
};

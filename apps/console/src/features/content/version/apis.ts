import { ContentVersion, ContentRevision, VersionComparison } from './version';

import { ApiContext, createApi } from '@/lib/api/factory';

const versionExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  getContentVersions: async (contentId: string, contentType: string) => {
    return request.get(
      `${endpoint}?content_id=${contentId}&content_type=${contentType}&sort=version_number:desc`
    );
  },
  compareVersions: async (versionAId: string, versionBId: string): Promise<VersionComparison> => {
    return request.post(`${endpoint}/compare`, { version_a: versionAId, version_b: versionBId });
  },
  restoreToVersion: async (contentId: string, versionId: string) => {
    return request.post(`${endpoint}/${versionId}/restore`, { content_id: contentId });
  },
  createSnapshot: async (
    contentId: string,
    contentType: string,
    data: any,
    changeSummary?: string
  ) => {
    return request.post(endpoint, {
      content_id: contentId,
      content_type: contentType,
      data,
      change_summary: changeSummary
    });
  }
});

export const versionApi = createApi<ContentVersion>('/cms/versions', {
  extensions: versionExtensionMethods
});

export const {
  create: createVersion,
  get: getVersion,
  update: updateVersion,
  delete: deleteVersion,
  list: getVersions,
  getContentVersions,
  compareVersions,
  restoreToVersion,
  createSnapshot
} = versionApi;

const revisionExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  getRevisionHistory: async (contentId: string, fromVersion?: number, toVersion?: number) => {
    let url = `${endpoint}?content_id=${contentId}`;
    if (fromVersion) url += `&from_version=${fromVersion}`;
    if (toVersion) url += `&to_version=${toVersion}`;
    return request.get(url);
  }
});

export const revisionApi = createApi<ContentRevision>('/cms/revisions', {
  extensions: revisionExtensionMethods
});

export const {
  create: createRevision,
  get: getRevision,
  list: getRevisions,
  getRevisionHistory
} = revisionApi;

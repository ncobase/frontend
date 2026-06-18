import { ContentVersion, ContentRevision, VersionComparison } from './version';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiValue } from '@/lib/api/guards';

const versionExtensionMethods = ({ request, endpoint }: ApiContext) => ({
  getContentVersions: async (contentId: string, contentType: string) => {
    return request.get(
      `${endpoint}?content_id=${assertRequiredApiValue(contentId, 'Content ID')}&content_type=${assertRequiredApiValue(contentType, 'Content type')}&sort=version_number:desc`
    );
  },
  compareVersions: async (versionAId: string, versionBId: string): Promise<VersionComparison> => {
    return request.post(`${endpoint}/compare`, {
      version_a: assertRequiredApiValue(versionAId, 'Version A ID'),
      version_b: assertRequiredApiValue(versionBId, 'Version B ID')
    });
  },
  restoreToVersion: async (contentId: string, versionId: string) => {
    return request.post(`${endpoint}/${assertRequiredApiValue(versionId, 'Version ID')}/restore`, {
      content_id: assertRequiredApiValue(contentId, 'Content ID')
    });
  },
  createSnapshot: async (
    contentId: string,
    contentType: string,
    data: any,
    changeSummary?: string
  ) => {
    return request.post(endpoint, {
      content_id: assertRequiredApiValue(contentId, 'Content ID'),
      content_type: assertRequiredApiValue(contentType, 'Content type'),
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
    let url = `${endpoint}?content_id=${assertRequiredApiValue(contentId, 'Content ID')}`;
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

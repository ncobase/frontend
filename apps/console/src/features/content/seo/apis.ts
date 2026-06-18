import { SEOData, SEOAnalysis, SEOAudit, KeywordData } from './seo';

import { ApiContext, createApi } from '@/lib/api/factory';
import { assertRequiredApiArray, assertRequiredApiValue } from '@/lib/api/guards';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get SEO data for content
  getContentSEO: async (contentId: string, contentType: string): Promise<SEOData> => {
    const params = new URLSearchParams({
      content_id: assertRequiredApiValue(contentId, 'Content ID'),
      content_type: assertRequiredApiValue(contentType, 'Content type')
    });
    return request.get(`${endpoint}?${params.toString()}`);
  },
  // Analyze SEO for content
  analyzeSEO: async (contentId: string, contentType: string): Promise<SEOAnalysis> => {
    return request.post(`${endpoint}/analyze`, {
      content_id: assertRequiredApiValue(contentId, 'Content ID'),
      content_type: assertRequiredApiValue(contentType, 'Content type')
    });
  },
  // Run SEO audit
  runAudit: async (
    contentId: string,
    contentType: string,
    auditType: string = 'full'
  ): Promise<SEOAudit> => {
    return request.post(`${endpoint}/audit`, {
      content_id: assertRequiredApiValue(contentId, 'Content ID'),
      content_type: assertRequiredApiValue(contentType, 'Content type'),
      audit_type: assertRequiredApiValue(auditType, 'Audit type')
    });
  },
  // Get keyword suggestions
  getKeywordSuggestions: async (seed: string, language: string = 'en'): Promise<KeywordData[]> => {
    const params = new URLSearchParams({
      seed: assertRequiredApiValue(seed, 'Keyword seed'),
      language: assertRequiredApiValue(language, 'Language')
    });
    return request.get(`${endpoint}/keywords/suggestions?${params.toString()}`);
  },
  // Analyze keyword density
  analyzeKeywordDensity: async (
    content: string,
    keywords: string[]
  ): Promise<Record<string, number>> => {
    return request.post(`${endpoint}/keywords/density`, {
      content: assertRequiredApiValue(content, 'Content'),
      keywords: assertRequiredApiArray(keywords, 'Keywords')
    });
  },
  // Generate meta tags
  generateMetaTags: async (content: string, keywords?: string[]): Promise<Partial<SEOData>> => {
    return request.post(`${endpoint}/meta/generate`, {
      content: assertRequiredApiValue(content, 'Content'),
      keywords
    });
  },
  // Check URL structure
  checkURL: async (
    url: string
  ): Promise<{ score: number; issues: string[]; suggestions: string[] }> => {
    return request.post(`${endpoint}/url/check`, {
      url: assertRequiredApiValue(url, 'URL')
    });
  },
  // Generate schema markup
  generateSchema: async (contentType: string, data: any): Promise<Record<string, any>> => {
    return request.post(`${endpoint}/schema/generate`, {
      content_type: assertRequiredApiValue(contentType, 'Content type'),
      data
    });
  }
});

export const seoApi = createApi<SEOData>('/cms/seo', {
  extensions: extensionMethods
});

export const {
  create: createSEOData,
  get: getSEOData,
  update: updateSEOData,
  delete: deleteSEOData,
  list: getSEODataList,
  getContentSEO,
  analyzeSEO,
  runAudit,
  getKeywordSuggestions,
  analyzeKeywordDensity,
  generateMetaTags,
  checkURL,
  generateSchema
} = seoApi;

import { SEOData, SEOAnalysis, SEOAudit, KeywordData } from './seo';

import { ApiContext, createApi } from '@/lib/api/factory';

const extensionMethods = ({ request, endpoint }: ApiContext) => ({
  // Get SEO data for content
  getContentSEO: async (contentId: string, contentType: string): Promise<SEOData> => {
    return request.get(`${endpoint}?content_id=${contentId}&content_type=${contentType}`);
  },
  // Analyze SEO for content
  analyzeSEO: async (contentId: string, contentType: string): Promise<SEOAnalysis> => {
    return request.post(`${endpoint}/analyze`, {
      content_id: contentId,
      content_type: contentType
    });
  },
  // Run SEO audit
  runAudit: async (
    contentId: string,
    contentType: string,
    auditType: string = 'full'
  ): Promise<SEOAudit> => {
    return request.post(`${endpoint}/audit`, {
      content_id: contentId,
      content_type: contentType,
      audit_type: auditType
    });
  },
  // Get keyword suggestions
  getKeywordSuggestions: async (seed: string, language: string = 'en'): Promise<KeywordData[]> => {
    return request.get(
      `${endpoint}/keywords/suggestions?seed=${encodeURIComponent(seed)}&language=${language}`
    );
  },
  // Analyze keyword density
  analyzeKeywordDensity: async (
    content: string,
    keywords: string[]
  ): Promise<Record<string, number>> => {
    return request.post(`${endpoint}/keywords/density`, { content, keywords });
  },
  // Generate meta tags
  generateMetaTags: async (content: string, keywords?: string[]): Promise<Partial<SEOData>> => {
    return request.post(`${endpoint}/meta/generate`, { content, keywords });
  },
  // Check URL structure
  checkURL: async (
    url: string
  ): Promise<{ score: number; issues: string[]; suggestions: string[] }> => {
    return request.post(`${endpoint}/url/check`, { url });
  },
  // Generate schema markup
  generateSchema: async (contentType: string, data: any): Promise<Record<string, any>> => {
    return request.post(`${endpoint}/schema/generate`, { content_type: contentType, data });
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

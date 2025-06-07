export interface SEOData {
  id?: string;
  content_id: string;
  content_type: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  schema_markup?: Record<string, any>;
  robots_meta?: string[];
  focus_keywords?: string[];
  readability_score?: number;
  seo_score?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SEOAnalysis {
  content_id: string;
  content_type: string;
  overall_score: number;
  title_analysis: {
    score: number;
    length: number;
    issues: string[];
    suggestions: string[];
  };
  description_analysis: {
    score: number;
    length: number;
    issues: string[];
    suggestions: string[];
  };
  keyword_analysis: {
    score: number;
    density: number;
    distribution: Record<string, number>;
    issues: string[];
    suggestions: string[];
  };
  content_analysis: {
    score: number;
    word_count: number;
    readability_score: number;
    heading_structure: {
      h1_count: number;
      h2_count: number;
      h3_count: number;
      issues: string[];
    };
    internal_links: number;
    external_links: number;
    images: {
      total: number;
      with_alt: number;
      without_alt: number;
    };
  };
  technical_analysis: {
    score: number;
    url_structure: {
      score: number;
      issues: string[];
    };
    meta_tags: {
      score: number;
      issues: string[];
    };
    social_tags: {
      score: number;
      issues: string[];
    };
  };
  recommendations: SEORecommendation[];
  analyzed_at: string;
}

export interface SEORecommendation {
  type: 'critical' | 'important' | 'suggestion';
  category: 'title' | 'description' | 'keywords' | 'content' | 'technical' | 'social';
  message: string;
  action: string;
  priority: number;
}

export interface KeywordData {
  keyword: string;
  search_volume?: number;
  difficulty?: number;
  competition?: string;
  cpc?: number;
  trend?: number[];
  related_keywords?: string[];
}

export interface SEOAudit {
  id?: string;
  content_id: string;
  content_type: string;
  audit_type: 'full' | 'quick' | 'technical' | 'content';
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: SEOAnalysis;
  issues_found: number;
  warnings_found: number;
  suggestions_count: number;
  created_at: string;
  completed_at?: string;
}

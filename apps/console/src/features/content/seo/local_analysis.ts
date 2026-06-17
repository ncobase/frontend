import type { Topic } from '../topic/topic';

export interface LocalSEOItem {
  id: string;
  title: string;
  content_type: string;
  score: number;
  issues: number;
  issue_categories: string[];
  analyzed_at: string;
  word_count: number;
}

export interface LocalSEOSummary {
  total_content: number;
  analyzed_content: number;
  issues_found: number;
  avg_score: number;
  optimization_rate: number;
  recent_analyses: LocalSEOItem[];
  top_content: LocalSEOItem[];
  issues_breakdown: { category: string; count: number }[];
  score_by_date: { date: string; score: number; count: number }[];
}

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const countWords = (value = '') => {
  const text = stripHtml(value);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
};

const parseKeywords = (value?: string) =>
  String(value || '')
    .split(/[,，;；\n]/)
    .map(keyword => keyword.trim())
    .filter(Boolean);

const scoreLength = (value: string | undefined, min: number, max: number) => {
  const length = String(value || '').trim().length;
  if (!length) return 0;
  if (length >= min && length <= max) return 100;
  if (length < min) return Math.max(35, Math.round((length / min) * 100));
  return Math.max(40, Math.round((max / length) * 100));
};

const getIssueBreakdown = (items: LocalSEOItem[]) => {
  const counts = new Map<string, number>();
  items.forEach(item => {
    item.issue_categories.forEach(category =>
      counts.set(category, (counts.get(category) || 0) + 1)
    );
  });

  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
};

const getDateKey = (value?: string) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
};

const getScoreByDate = (items: LocalSEOItem[]) => {
  const groups = new Map<string, { total: number; count: number }>();
  items.forEach(item => {
    const date = getDateKey(item.analyzed_at);
    const current = groups.get(date) || { total: 0, count: 0 };
    current.total += item.score;
    current.count += 1;
    groups.set(date, current);
  });

  return Array.from(groups.entries())
    .map(([date, value]) => ({
      date,
      score: Math.round(value.total / Math.max(value.count, 1)),
      count: value.count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const analyzeTopicSEO = (topic: Topic): LocalSEOItem => {
  const title = topic.seo_title || topic.title || topic.name || '';
  const description = topic.seo_description || '';
  const keywords = parseKeywords(topic.seo_keywords);
  const wordCount = countWords(topic.content);
  const issueCategories: string[] = [];

  const titleScore = scoreLength(title, 25, 70);
  const descriptionScore = scoreLength(description, 70, 170);
  const keywordScore = keywords.length >= 2 ? 100 : keywords.length === 1 ? 70 : 0;
  const contentScore = wordCount >= 300 ? 100 : wordCount >= 120 ? 75 : wordCount > 0 ? 45 : 0;

  if (!title.trim()) issueCategories.push('title');
  if (!description.trim()) issueCategories.push('description');
  if (!keywords.length) issueCategories.push('keywords');
  if (wordCount > 0 && wordCount < 120) issueCategories.push('content');

  const score = Math.round(
    titleScore * 0.3 + descriptionScore * 0.3 + keywordScore * 0.2 + contentScore * 0.2
  );

  return {
    id: topic.id || topic.slug || '',
    title: topic.title || topic.name || topic.slug || topic.id || 'Untitled content',
    content_type: topic.content_type || 'topic',
    score,
    issues: issueCategories.length,
    issue_categories: issueCategories,
    analyzed_at: topic.updated_at || topic.created_at || new Date().toISOString(),
    word_count: wordCount
  };
};

export const summarizeTopicSEO = (topics: Topic[] = []): LocalSEOSummary => {
  const items = topics.map(analyzeTopicSEO).filter(item => item.id);
  const totalScore = items.reduce((sum, item) => sum + item.score, 0);
  const issuesFound = items.reduce((sum, item) => sum + item.issues, 0);
  const optimizedCount = items.filter(item => item.score >= 80).length;

  return {
    total_content: topics.length,
    analyzed_content: items.length,
    issues_found: issuesFound,
    avg_score: items.length ? Math.round(totalScore / items.length) : 0,
    optimization_rate: items.length ? Math.round((optimizedCount / items.length) * 100) : 0,
    recent_analyses: [...items]
      .sort((a, b) => new Date(b.analyzed_at).getTime() - new Date(a.analyzed_at).getTime())
      .slice(0, 10),
    top_content: [...items].sort((a, b) => b.score - a.score).slice(0, 5),
    issues_breakdown: getIssueBreakdown(items),
    score_by_date: getScoreByDate(items)
  };
};

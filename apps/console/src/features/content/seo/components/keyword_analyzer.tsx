import React, { useEffect, useState } from 'react';

import { Card, Icons, Badge, Button } from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import { useAnalyzeKeywordDensity, useKeywordSuggestions } from '../service';

interface KeywordAnalyzerProps {
  content: string;
  keywords: string[];
}

export const KeywordAnalyzer: React.FC<KeywordAnalyzerProps> = ({ content, keywords }) => {
  const { t } = useTranslation();
  const [densityResults, setDensityResults] = useState<Record<string, number>>({});
  const [showSuggestions, setShowSuggestions] = useState(false);

  const analyzeKeywordMutation = useAnalyzeKeywordDensity();
  const { data: suggestions } = useKeywordSuggestions(keywords[0] || '', 'en');

  useEffect(() => {
    if (keywords.length > 0 && content) {
      analyzeKeywordMutation.mutate(
        { content, keywords },
        {
          onSuccess: results => {
            setDensityResults(results);
          }
        }
      );
    }
  }, [content, keywords]);

  const getDensityLevel = (density: number) => {
    if (density < 0.5) return { level: 'low', variant: 'secondary', color: 'text-gray-600' };
    if (density < 2) return { level: 'good', variant: 'success', color: 'text-green-600' };
    if (density < 4) return { level: 'high', variant: 'warning', color: 'text-yellow-600' };
    return { level: 'excessive', variant: 'danger', color: 'text-red-600' };
  };

  return (
    <Card className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h4 className='font-medium flex items-center'>
          <Icons name='IconTargetArrow' size={16} className='mr-2' />
          {t('seo.keyword_analyzer.title')}
        </h4>
        <Button variant='ghost' size='sm' onClick={() => setShowSuggestions(!showSuggestions)}>
          <Icons name='IconBulb' size={16} />
        </Button>
      </div>

      {/* Keyword Density */}
      <div className='space-y-3'>
        <h5 className='text-sm font-medium text-gray-700'>{t('seo.keyword_analyzer.density')}</h5>
        {Object.entries(densityResults).map(([keyword, density]) => {
          const { level, variant, color } = getDensityLevel(density);
          return (
            <div key={keyword} className='flex items-center justify-between'>
              <span className='text-sm text-gray-900'>{keyword}</span>
              <div className='flex items-center space-x-2'>
                <span className={`text-xs ${color}`}>{density.toFixed(1)}%</span>
                <Badge variant={variant} className='text-xs'>
                  {t(`seo.density.${level}`)}
                </Badge>
              </div>
            </div>
          );
        })}

        {keywords.length === 0 && (
          <div className='text-center py-4 text-gray-500 text-sm'>
            {t('seo.keyword_analyzer.no_keywords')}
          </div>
        )}
      </div>

      {/* Keyword Suggestions */}
      {showSuggestions && suggestions && (
        <div className='mt-6 pt-4 border-t border-gray-200'>
          <h5 className='text-sm font-medium text-gray-700 mb-3'>
            {t('seo.keyword_analyzer.suggestions')}
          </h5>
          <div className='space-y-2'>
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <div key={index} className='flex items-center justify-between text-sm'>
                <span className='text-gray-900'>{suggestion.keyword}</span>
                <div className='flex items-center space-x-2'>
                  {suggestion.search_volume && (
                    <span className='text-xs text-gray-500'>
                      {suggestion.search_volume} searches
                    </span>
                  )}
                  {suggestion.difficulty && (
                    <Badge
                      variant={
                        suggestion.difficulty < 30
                          ? 'success'
                          : suggestion.difficulty < 70
                            ? 'warning'
                            : 'danger'
                      }
                      className='text-xs'
                    >
                      {suggestion.difficulty}% difficulty
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className='mt-6 pt-4 border-t border-gray-200'>
        <h5 className='text-sm font-medium text-gray-700 mb-2'>{t('seo.keyword_analyzer.tips')}</h5>
        <ul className='text-xs text-gray-600 space-y-1'>
          <li>• {t('seo.tips.density_range')}</li>
          <li>• {t('seo.tips.natural_placement')}</li>
          <li>• {t('seo.tips.long_tail_keywords')}</li>
        </ul>
      </div>
    </Card>
  );
};

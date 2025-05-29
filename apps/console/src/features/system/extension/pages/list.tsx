import { useState, useCallback } from 'react';

import {
  Button,
  Badge,
  Icons,
  Tooltip,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

import {
  useExtensions,
  useExtensionStatus,
  useLoadExtension,
  useUnloadExtension,
  useReloadExtension
} from '../service';

import { Page, Topbar } from '@/components/layout';
import { Search } from '@/components/search/search';

export const ExtensionListPage = () => {
  const { t } = useTranslation();
  const { data: extensions, isLoading, refetch } = useExtensions();
  const { data: status } = useExtensionStatus();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const loadMutation = useLoadExtension();
  const unloadMutation = useUnloadExtension();
  const reloadMutation = useReloadExtension();

  // Flatten extensions from grouped structure
  const flattenedExtensions = extensions
    ? Object.entries(extensions).flatMap(([group, types]) =>
        Object.entries(types).flatMap(([type, exts]) => exts.map(ext => ({ ...ext, group, type })))
      )
    : [];

  // Filter extensions
  const filteredExtensions = flattenedExtensions.filter(ext => {
    const matchesSearch = !searchTerm || ext.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || ext.group === selectedGroup;
    const matchesType = !selectedType || ext.type === selectedType;
    return matchesSearch && matchesGroup && matchesType;
  });

  // Get unique groups and types for filters
  const uniqueGroups = [...new Set(flattenedExtensions.map(ext => ext.group))];
  const uniqueTypes = [...new Set(flattenedExtensions.map(ext => ext.type))];

  const handleAction = useCallback(
    async (action: string, extensionName: string) => {
      try {
        switch (action) {
          case 'load':
            await loadMutation.mutateAsync(extensionName);
            break;
          case 'unload':
            await unloadMutation.mutateAsync(extensionName);
            break;
          case 'reload':
            await reloadMutation.mutateAsync(extensionName);
            break;
        }
        refetch();
      } catch (error) {
        console.error(`Failed to ${action} extension:`, error);
      }
    },
    [loadMutation, unloadMutation, reloadMutation, refetch]
  );

  const getStatusBadge = (extensionName: string, extensionStatus: string) => {
    const statusInfo = status?.[extensionName];
    if (statusInfo) {
      return statusInfo.status === 'active' ? 'success' : 'danger';
    }
    return extensionStatus === 'active' ? 'success' : 'warning';
  };

  const getStatusText = (extensionName: string, extensionStatus: string) => {
    const statusInfo = status?.[extensionName];
    if (statusInfo) {
      return statusInfo.status;
    }
    return extensionStatus;
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group === 'all' ? '' : group);
    setSelectedType('');
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type === 'all' ? '' : type);
  };

  return (
    <Page
      title={t('extensions.list.title', 'Extension Management')}
      topbar={
        <Topbar>
          <div className='flex items-center gap-4'>
            <Search
              placeholder='Search extensions...'
              value={searchTerm}
              fieldClassName='border-slate-200/65 focus:border-primary-600 py-2'
              onSearch={handleSearchChange}
            />
            <Select value={selectedGroup} onValueChange={handleGroupChange}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='All Groups' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Groups</SelectItem>
                {uniqueGroups.map(group => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='All Types' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Types</SelectItem>
                {uniqueTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={() => refetch()}
              variant='outline-slate'
              icon='IconRefresh'
              disabled={isLoading}
            >
              Refresh
            </Button>
          </div>
        </Topbar>
      }
    >
      <div className='w-full'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-lg text-slate-600'>Loading extensions...</div>
          </div>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {filteredExtensions.map(extension => (
              <Card
                key={extension.name}
                className='border border-slate-200 hover:shadow-md transition-shadow'
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-lg font-semibold truncate'>
                      {extension.name}
                    </CardTitle>
                    <Badge variant={getStatusBadge(extension.name, extension.status)}>
                      {getStatusText(extension.name, extension.status)}
                    </Badge>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-slate-600'>
                    <Badge variant='outline' className='text-xs'>
                      {extension.group}
                    </Badge>
                    <Badge variant='outline' className='text-xs'>
                      {extension.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  {extension.description && (
                    <p className='text-sm text-slate-600 mb-4 line-clamp-2'>
                      {extension.description}
                    </p>
                  )}
                  {extension.version && (
                    <div className='text-xs text-slate-500 mb-4'>Version: {extension.version}</div>
                  )}
                  <div className='items-center gap-2 hidden'>
                    <Tooltip content='Load Extension'>
                      <Button
                        size='sm'
                        variant='outline-slate'
                        onClick={() => handleAction('load', extension.name)}
                        disabled={loadMutation.isPending}
                      >
                        <Icons name='IconPlayerPlayFilled' />
                      </Button>
                    </Tooltip>
                    <Tooltip content='Unload Extension'>
                      <Button
                        size='sm'
                        variant='outline-slate'
                        onClick={() => handleAction('unload', extension.name)}
                        disabled={unloadMutation.isPending}
                      >
                        <Icons name='IconPlayerPauseFilled' />
                      </Button>
                    </Tooltip>
                    <Tooltip content='Reload Extension'>
                      <Button
                        size='sm'
                        variant='outline-slate'
                        onClick={() => handleAction('reload', extension.name)}
                        disabled={reloadMutation.isPending}
                      >
                        <Icons name='IconRefreshDot' />
                      </Button>
                    </Tooltip>
                    <Tooltip content='View Details'>
                      <Button
                        size='sm'
                        variant='outline-slate'
                        onClick={() => {
                          // Handle view details
                          console.log('View details for:', extension.name);
                        }}
                      >
                        <Icons name='IconEye' />
                      </Button>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredExtensions.length === 0 && !isLoading && (
          <div className='text-center py-12'>
            <Icons name='IconPackage' className='w-16 h-16 text-slate-400 mx-auto mb-4' />
            <h3 className='text-lg font-medium text-slate-600 mb-2'>No Extensions Found</h3>
            <p className='text-slate-500'>
              {searchTerm || selectedGroup || selectedType
                ? 'Try adjusting your filters to see more extensions.'
                : 'No extensions are currently available.'}
            </p>
          </div>
        )}
      </div>
    </Page>
  );
};

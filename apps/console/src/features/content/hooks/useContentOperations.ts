import { useCallback } from 'react';

import { useToastMessage } from '@ncobase/react';

import { useCreateChannel, useUpdateChannel, useDeleteChannel } from '../channel/service';
import {
  useCreateDistribution,
  useUpdateDistribution,
  useDeleteDistribution
} from '../distribution/service';
import { useCreateMedia, useUpdateMedia, useDeleteMedia } from '../media/service';
import { useCreateTaxonomy, useUpdateTaxonomy, useDeleteTaxonomy } from '../taxonomy/service';
import { useCreateTopic, useUpdateTopic, useDeleteTopic } from '../topic/service';

export const useContentOperations = () => {
  const toast = useToastMessage();

  // Topic operations
  const createTopicMutation = useCreateTopic();
  const updateTopicMutation = useUpdateTopic();
  const deleteTopicMutation = useDeleteTopic();

  // Taxonomy operations
  const createTaxonomyMutation = useCreateTaxonomy();
  const updateTaxonomyMutation = useUpdateTaxonomy();
  const deleteTaxonomyMutation = useDeleteTaxonomy();

  // Media operations
  const createMediaMutation = useCreateMedia();
  const updateMediaMutation = useUpdateMedia();
  const deleteMediaMutation = useDeleteMedia();

  // Channel operations
  const createChannelMutation = useCreateChannel();
  const updateChannelMutation = useUpdateChannel();
  const deleteChannelMutation = useDeleteChannel();

  // Distribution operations
  const createDistributionMutation = useCreateDistribution();
  const updateDistributionMutation = useUpdateDistribution();
  const deleteDistributionMutation = useDeleteDistribution();

  // Topic operations
  const createTopic = useCallback(
    async (data: any) => {
      try {
        await createTopicMutation.mutateAsync(data);
        toast.success('Topic created successfully');
        return true;
      } catch (error) {
        toast.error('Failed to create topic');
        console.error('Create topic error:', error);
        return false;
      }
    },
    [createTopicMutation, toast]
  );

  const updateTopic = useCallback(
    async (data: any) => {
      try {
        await updateTopicMutation.mutateAsync(data);
        toast.success('Topic updated successfully');
        return true;
      } catch (error) {
        toast.error('Failed to update topic');
        console.error('Update topic error:', error);
        return false;
      }
    },
    [updateTopicMutation, toast]
  );

  const deleteTopic = useCallback(
    async (id: string) => {
      try {
        await deleteTopicMutation.mutateAsync(id);
        toast.success('Topic deleted successfully');
        return true;
      } catch (error) {
        toast.error('Failed to delete topic');
        console.error('Delete topic error:', error);
        return false;
      }
    },
    [deleteTopicMutation, toast]
  );

  // Taxonomy operations
  const createTaxonomy = useCallback(
    async (data: any) => {
      try {
        await createTaxonomyMutation.mutateAsync(data);
        toast.success('Taxonomy created successfully');
        return true;
      } catch (error) {
        toast.error('Failed to create taxonomy');
        console.error('Create taxonomy error:', error);
        return false;
      }
    },
    [createTaxonomyMutation, toast]
  );

  const updateTaxonomy = useCallback(
    async (data: any) => {
      try {
        await updateTaxonomyMutation.mutateAsync(data);
        toast.success('Taxonomy updated successfully');
        return true;
      } catch (error) {
        toast.error('Failed to update taxonomy');
        console.error('Update taxonomy error:', error);
        return false;
      }
    },
    [updateTaxonomyMutation, toast]
  );

  const deleteTaxonomy = useCallback(
    async (id: string) => {
      try {
        await deleteTaxonomyMutation.mutateAsync(id);
        toast.success('Taxonomy deleted successfully');
        return true;
      } catch (error) {
        toast.error('Failed to delete taxonomy');
        console.error('Delete taxonomy error:', error);
        return false;
      }
    },
    [deleteTaxonomyMutation, toast]
  );

  // Media operations
  const createMedia = useCallback(
    async (data: any) => {
      try {
        await createMediaMutation.mutateAsync(data);
        toast.success('Media uploaded successfully');
        return true;
      } catch (error) {
        toast.error('Failed to upload media');
        console.error('Create media error:', error);
        return false;
      }
    },
    [createMediaMutation, toast]
  );

  const updateMedia = useCallback(
    async (data: any) => {
      try {
        await updateMediaMutation.mutateAsync(data);
        toast.success('Media updated successfully');
        return true;
      } catch (error) {
        toast.error('Failed to update media');
        console.error('Update media error:', error);
        return false;
      }
    },
    [updateMediaMutation, toast]
  );

  const deleteMedia = useCallback(
    async (id: string) => {
      try {
        await deleteMediaMutation.mutateAsync(id);
        toast.success('Media deleted successfully');
        return true;
      } catch (error) {
        toast.error('Failed to delete media');
        console.error('Delete media error:', error);
        return false;
      }
    },
    [deleteMediaMutation, toast]
  );

  // Channel operations
  const createChannel = useCallback(
    async (data: any) => {
      try {
        await createChannelMutation.mutateAsync(data);
        toast.success('Channel created successfully');
        return true;
      } catch (error) {
        toast.error('Failed to create channel');
        console.error('Create channel error:', error);
        return false;
      }
    },
    [createChannelMutation, toast]
  );

  const updateChannel = useCallback(
    async (data: any) => {
      try {
        await updateChannelMutation.mutateAsync(data);
        toast.success('Channel updated successfully');
        return true;
      } catch (error) {
        toast.error('Failed to update channel');
        console.error('Update channel error:', error);
        return false;
      }
    },
    [updateChannelMutation, toast]
  );

  const deleteChannel = useCallback(
    async (id: string) => {
      try {
        await deleteChannelMutation.mutateAsync(id);
        toast.success('Channel deleted successfully');
        return true;
      } catch (error) {
        toast.error('Failed to delete channel');
        console.error('Delete channel error:', error);
        return false;
      }
    },
    [deleteChannelMutation, toast]
  );

  // Distribution operations
  const createDistribution = useCallback(
    async (data: any) => {
      try {
        await createDistributionMutation.mutateAsync(data);
        toast.success('Distribution created successfully');
        return true;
      } catch (error) {
        toast.error('Failed to create distribution');
        console.error('Create distribution error:', error);
        return false;
      }
    },
    [createDistributionMutation, toast]
  );

  const updateDistribution = useCallback(
    async (data: any) => {
      try {
        await updateDistributionMutation.mutateAsync(data);
        toast.success('Distribution updated successfully');
        return true;
      } catch (error) {
        toast.error('Failed to update distribution');
        console.error('Update distribution error:', error);
        return false;
      }
    },
    [updateDistributionMutation, toast]
  );

  const deleteDistribution = useCallback(
    async (id: string) => {
      try {
        await deleteDistributionMutation.mutateAsync(id);
        toast.success('Distribution deleted successfully');
        return true;
      } catch (error) {
        toast.error('Failed to delete distribution');
        console.error('Delete distribution error:', error);
        return false;
      }
    },
    [deleteDistributionMutation, toast]
  );

  // Bulk operations for topics
  const bulkDeleteTopics = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map(id => deleteTopicMutation.mutateAsync(id)));
        toast.success(`${ids.length} topics deleted successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to delete topics');
        console.error('Bulk delete topics error:', error);
        return false;
      }
    },
    [deleteTopicMutation, toast]
  );

  const bulkUpdateTopicStatus = useCallback(
    async (ids: string[], status: number) => {
      try {
        await Promise.all(ids.map(id => updateTopicMutation.mutateAsync({ id, status })));
        toast.success(`${ids.length} topics updated successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to update topics');
        console.error('Bulk update topics error:', error);
        return false;
      }
    },
    [updateTopicMutation, toast]
  );

  // Bulk operations for other entities
  const bulkDeleteTaxonomies = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map(id => deleteTaxonomyMutation.mutateAsync(id)));
        toast.success(`${ids.length} taxonomies deleted successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to delete taxonomies');
        console.error('Bulk delete taxonomies error:', error);
        return false;
      }
    },
    [deleteTaxonomyMutation, toast]
  );

  const bulkDeleteMedia = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map(id => deleteMediaMutation.mutateAsync(id)));
        toast.success(`${ids.length} media files deleted successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to delete media files');
        console.error('Bulk delete media error:', error);
        return false;
      }
    },
    [deleteMediaMutation, toast]
  );

  const bulkDeleteChannels = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map(id => deleteChannelMutation.mutateAsync(id)));
        toast.success(`${ids.length} channels deleted successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to delete channels');
        console.error('Bulk delete channels error:', error);
        return false;
      }
    },
    [deleteChannelMutation, toast]
  );

  const bulkUpdateChannelStatus = useCallback(
    async (ids: string[], status: number) => {
      try {
        await Promise.all(ids.map(id => updateChannelMutation.mutateAsync({ id, status })));
        toast.success(`${ids.length} channels updated successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to update channels');
        console.error('Bulk update channels error:', error);
        return false;
      }
    },
    [updateChannelMutation, toast]
  );

  const bulkDeleteDistributions = useCallback(
    async (ids: string[]) => {
      try {
        await Promise.all(ids.map(id => deleteDistributionMutation.mutateAsync(id)));
        toast.success(`${ids.length} distributions deleted successfully`);
        return true;
      } catch (error) {
        toast.error('Failed to delete distributions');
        console.error('Bulk delete distributions error:', error);
        return false;
      }
    },
    [deleteDistributionMutation, toast]
  );

  return {
    // Topic operations
    createTopic,
    updateTopic,
    deleteTopic,
    bulkDeleteTopics,
    bulkUpdateTopicStatus,

    // Taxonomy operations
    createTaxonomy,
    updateTaxonomy,
    deleteTaxonomy,
    bulkDeleteTaxonomies,

    // Media operations
    createMedia,
    updateMedia,
    deleteMedia,
    bulkDeleteMedia,

    // Channel operations
    createChannel,
    updateChannel,
    deleteChannel,
    bulkDeleteChannels,
    bulkUpdateChannelStatus,

    // Distribution operations
    createDistribution,
    updateDistribution,
    deleteDistribution,
    bulkDeleteDistributions,

    // Loading states - Topics
    isCreatingTopic: createTopicMutation.isPending,
    isUpdatingTopic: updateTopicMutation.isPending,
    isDeletingTopic: deleteTopicMutation.isPending,

    // Loading states - Taxonomies
    isCreatingTaxonomy: createTaxonomyMutation.isPending,
    isUpdatingTaxonomy: updateTaxonomyMutation.isPending,
    isDeletingTaxonomy: deleteTaxonomyMutation.isPending,

    // Loading states - Media
    isCreatingMedia: createMediaMutation.isPending,
    isUpdatingMedia: updateMediaMutation.isPending,
    isDeletingMedia: deleteMediaMutation.isPending,

    // Loading states - Channels
    isCreatingChannel: createChannelMutation.isPending,
    isUpdatingChannel: updateChannelMutation.isPending,
    isDeletingChannel: deleteChannelMutation.isPending,

    // Loading states - Distributions
    isCreatingDistribution: createDistributionMutation.isPending,
    isUpdatingDistribution: updateDistributionMutation.isPending,
    isDeletingDistribution: deleteDistributionMutation.isPending
  };
};

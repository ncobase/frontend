import React, { useEffect } from 'react';

import { Card, Button, Icons, Form, Section } from '@ncobase/react';
import { useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router';

import { useQueryMedia, useUpdateMedia } from '../service';

import { Page, Topbar } from '@/components/layout';

export const MediaEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToastMessage();

  const { data: media, isLoading } = useQueryMedia(id!);
  const updateMediaMutation = useUpdateMedia();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    if (media) {
      reset({
        title: media.title,
        description: media.description,
        alt: media.alt,
        type: media.type
      });
    }
  }, [media, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateMediaMutation.mutateAsync({ id, ...data });
      toast.success('Media updated successfully');
      navigate(`/content/media/${id}`);
      // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to update media');
    }
  };

  if (isLoading) {
    return (
      <Page sidebar title='Edit Media'>
        <div className='flex items-center justify-center h-64'>
          <Icons name='IconLoader2' className='animate-spin' size={32} />
        </div>
      </Page>
    );
  }

  if (!media) {
    return (
      <Page sidebar title='Edit Media'>
        <Card className='text-center py-12'>
          <Icons name='IconAlertCircle' size={48} className='mx-auto text-red-400 mb-4' />
          <h3 className='text-lg font-medium text-gray-900 mb-2'>Media not found</h3>
          <Button onClick={() => navigate('/content/media')}>Back to Media</Button>
        </Card>
      </Page>
    );
  }

  const fields = [
    {
      title: 'Title',
      name: 'title',
      type: 'text',
      placeholder: 'Enter media title',
      rules: { required: 'Title is required' }
    },
    {
      title: 'Type',
      name: 'type',
      type: 'select',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'File', value: 'file' }
      ]
    },
    {
      title: 'Description',
      name: 'description',
      type: 'textarea',
      placeholder: 'Enter media description'
    },
    {
      title: 'Alt Text',
      name: 'alt',
      type: 'text',
      placeholder: 'Enter alt text for accessibility'
    }
  ];

  return (
    <Page
      sidebar
      title='Edit Media'
      topbar={
        <Topbar
          title={media.title}
          left={[
            <Button variant='outline' size='sm' onClick={() => navigate(`/content/media/${id}`)}>
              <Icons name='IconArrowLeft' size={16} className='mr-2' />
              Back
            </Button>
          ]}
        />
      }
      className='px-4 sm:px-6 lg:px-8 py-8 space-y-4'
    >
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Form */}
        <div className='lg:col-span-2'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <Section
              title='Media Information'
              icon='IconPhoto'
              className='mb-6 rounded-lg overflow-hidden shadow-sm transition-shadow hover:shadow-md'
            >
              <Form
                control={control}
                errors={errors}
                fields={fields}
                className='grid grid-cols-1 gap-4'
              />
            </Section>

            <div className='flex justify-end space-x-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate(`/content/media/${id}`)}
              >
                Cancel
              </Button>
              <Button type='submit' loading={updateMediaMutation.isPending}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div>
          <Card className='p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Current File</h3>
            <div className='bg-gray-50 rounded-lg p-4 text-center'>
              {media.type === 'image' && media.url ? (
                <img
                  src={media.url}
                  alt={media.alt || media.title}
                  className='w-full max-h-48 object-contain rounded'
                />
              ) : (
                <div className='py-8'>
                  <Icons
                    name={
                      media.type === 'video'
                        ? 'IconMovie'
                        : media.type === 'audio'
                          ? 'IconMusic'
                          : 'IconFile'
                    }
                    size={48}
                    className='mx-auto text-gray-400 mb-2'
                  />
                  <p className='text-sm text-gray-600'>{media.title}</p>
                </div>
              )}
            </div>

            <div className='mt-4 space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Size:</span>
                <span className='text-gray-900'>
                  {media.size ? `${(media.size / 1024).toFixed(1)} KB` : 'Unknown'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-500'>Type:</span>
                <span className='text-gray-900'>{media.mime_type}</span>
              </div>
              {media.width && media.height && (
                <div className='flex justify-between'>
                  <span className='text-gray-500'>Dimensions:</span>
                  <span className='text-gray-900'>
                    {media.width} × {media.height}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

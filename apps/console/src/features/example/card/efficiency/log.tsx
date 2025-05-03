import { useState } from 'react';

import {
  Button,
  Form,
  Section,
  EditorField,
  InputField,
  SelectField,
  MultiSelectField,
  RadioField
} from '@ncobase/react';
import { useForm } from 'react-hook-form';

import { CardLayout } from '../layout';

export const LogPage = () => {
  const [formData, setFormData] = useState({});
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = data => {
    console.log('Form submitted:', data);
    setFormData(data);
  };

  // Example image upload function (simulated)
  const handleImageUpload = async file => {
    // In a real implementation, you would upload the file to a server
    // and return the URL of the uploaded file
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Simulate network delay
        setTimeout(() => {
          resolve(reader.result);
        }, 1000);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <CardLayout>
      <h1 className='text-2xl font-bold mb-6'>Example Form with Rich Text Editor</h1>

      <Form control={control} errors={errors} onSubmit={handleSubmit(onSubmit)} layout='single'>
        <Section
          title='Content Editor'
          subtitle='Create and edit content with rich text formatting'
          collapsible={false}
        >
          {/* Basic text input */}
          <InputField
            name='title'
            title='Title'
            placeholder='Enter post title'
            rules={{ required: 'Title is required' }}
          />

          {/* Rich text editor field */}
          <EditorField
            name='content'
            title='Post Content'
            placeholder='Write your post content here...'
            rules={{ required: 'Content is required' }}
            minHeight='300px'
            uploadImage={handleImageUpload}
            showBubbleMenu={true}
            showFloatingMenu={true}
          />

          {/* Categories */}
          <SelectField
            name='category'
            title='Category'
            placeholder='Select a category'
            options={[
              { label: 'Technology', value: 'technology' },
              { label: 'Business', value: 'business' },
              { label: 'Design', value: 'design' },
              { label: 'Marketing', value: 'marketing' }
            ]}
          />

          {/* Tags */}
          <MultiSelectField
            name='tags'
            title='Tags'
            placeholder='Select tags'
            options={[
              { label: 'React', value: 'react' },
              { label: 'TypeScript', value: 'typescript' },
              { label: 'UI/UX', value: 'ui-ux' },
              { label: 'Web Development', value: 'web-development' },
              { label: 'Design Systems', value: 'design-systems' }
            ]}
          />

          {/* Published status */}
          <RadioField
            name='status'
            title='Publication Status'
            defaultValue='draft'
            options={[
              { label: 'Published', value: 'published' },
              { label: 'Draft', value: 'draft' },
              { label: 'Scheduled', value: 'scheduled' }
            ]}
          />

          {/* Submit buttons */}
          <div className='flex justify-end gap-4 mt-6'>
            <Button variant='outline-slate'>Cancel</Button>
            <Button type='submit'>Save Post</Button>
          </div>
        </Section>
      </Form>

      {/* Preview of submitted data */}
      {Object.keys(formData).length > 0 && (
        <div className='mt-10 border-t pt-6'>
          <h2 className='text-xl font-bold mb-4'>Submitted Form Data:</h2>
          <pre className='bg-slate-100 p-4 rounded-md overflow-auto max-h-96'>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </CardLayout>
  );
};

import { useState, useCallback } from 'react';

import { Card, Button, Icons, Editor } from '@ncobase/react';

import { CardLayout } from '../layout';

import { useLanguage } from '@/hooks/use_language';

// Mock image upload function
const mockImageUpload = async (file: File): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Simulate network delay
      setTimeout(() => {
        resolve(reader.result as string);
      }, 1000);
    };
    reader.readAsDataURL(file);
  });
};

export const EditorPage = () => {
  const { currentLanguage } = useLanguage();

  const [content, setContent] = useState(
    "<h1>Welcome to the Ncobase Editor</h1><p>Start typing to test out the editor's features...</p>"
  );
  const [title, setTitle] = useState('Untitled Document');
  const [saved, setSaved] = useState(false);
  const [savingStatus, setSavingStatus] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleContentChange = useCallback((html: string) => {
    setContent(html);
    setSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setSavingStatus('Saving...');

    // Simulate saving to a database
    setTimeout(() => {
      setSaved(true);
      setSavingStatus('Document saved successfully!');

      setTimeout(() => {
        setSavingStatus('');
      }, 2000);
    }, 1000);
  }, [title, content]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <CardLayout>
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-bold'>Rich Text Editor</h2>
        <Button variant='ghost' onClick={toggleDarkMode}>
          <Icons name={darkMode ? 'IconSun' : 'IconMoon'} className='mr-2' />
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>

      <div className='mb-6 p-4'>
        <div className='flex items-center justify-between mb-4 gap-2'>
          <input
            type='text'
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setSaved(false);
            }}
            placeholder='Document Title'
            className='px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500'
          />

          <div className='flex items-center gap-2'>
            <Button onClick={handleSave} size='sm' disabled={saved}>
              <Icons name='IconDeviceFloppy' className='mr-2' />
              {saved ? 'Saved' : 'Save Document'}
            </Button>
            {savingStatus && (
              <span
                className={`text-sm ${savingStatus.includes('success') ? 'text-green-500' : 'text-blue-500'}`}
              >
                {savingStatus}
              </span>
            )}
          </div>
        </div>

        <Card className='p-0 overflow-hidden rounded-md'>
          <Editor
            locale={currentLanguage.key as any}
            content={content}
            onChange={handleContentChange}
            onSave={handleSave}
            uploadImage={mockImageUpload}
            darkMode={darkMode}
            showBubbleMenu={true}
            placeholder='Start typing...'
          />
        </Card>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Text Formatting</h4>
          <p className='text-slate-600 dark:text-slate-300 mb-3'>
            Format your text with bold, italic, underline, and more. The editor supports a wide
            range of formatting options.
          </p>
          <Button className='w-full'>
            <Icons name='IconTypography' className='mr-2' />
            Formatting Guide
          </Button>
        </Card>

        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Media Support</h4>
          <p className='text-slate-600 dark:text-slate-300 mb-3'>
            Easily insert and manage images. Upload from your device with drag and drop support.
          </p>
          <Button className='w-full'>
            <Icons name='IconPhoto' className='mr-2' />
            Media Guidelines
          </Button>
        </Card>

        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Tables & Lists</h4>
          <p className='text-slate-600 dark:text-slate-300 mb-3'>
            Create structured content with tables, ordered and unordered lists, and task lists.
          </p>
          <Button className='w-full'>
            <Icons name='IconTable' className='mr-2' />
            Table Documentation
          </Button>
        </Card>

        <Card className='p-4'>
          <h4 className='font-medium mb-2'>Code Blocks</h4>
          <p className='text-slate-600 dark:text-slate-300 mb-3'>
            Insert code blocks with syntax highlighting for various programming languages.
          </p>
          <Button className='w-full'>
            <Icons name='IconCode' className='mr-2' />
            Code Examples
          </Button>
        </Card>
      </div>

      <div className='p-4 bg-slate-50 dark:bg-slate-800 rounded-md'>
        <h3 className='font-medium mb-2'>Editor Features:</h3>
        <ul className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Rich Text Formatting</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Multiple Heading Levels</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Bullet & Numbered Lists</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Task Lists</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Tables</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Code Blocks</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Image Upload</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Links</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Text Alignment</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Text Color</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Dark Mode Support</span>
          </li>
          <li className='flex items-center'>
            <Icons name='IconCheck' className='text-green-500 mr-2' />
            <span>Keyboard Shortcuts</span>
          </li>
        </ul>
      </div>

      <div className='mt-6'>
        <h3 className='font-medium mb-2'>Current Document Stats:</h3>
        <div className='flex flex-wrap gap-4'>
          <div className='bg-white dark:bg-slate-700 p-3 rounded-md border border-slate-200 dark:border-slate-600'>
            <span className='text-sm text-slate-500 dark:text-slate-400'>Word Count</span>
            <p className='text-xl font-semibold'>
              {content.split(/\s+/).filter(word => word.length > 0).length}
            </p>
          </div>
          <div className='bg-white dark:bg-slate-700 p-3 rounded-md border border-slate-200 dark:border-slate-600'>
            <span className='text-sm text-slate-500 dark:text-slate-400'>Character Count</span>
            <p className='text-xl font-semibold'>{content.replace(/<[^>]*>/g, '').length}</p>
          </div>
          <div className='bg-white dark:bg-slate-700 p-3 rounded-md border border-slate-200 dark:border-slate-600'>
            <span className='text-sm text-slate-500 dark:text-slate-400'>Last Edited</span>
            <p className='text-xl font-semibold'>{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </CardLayout>
  );
};

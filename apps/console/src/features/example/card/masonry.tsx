import { Card, CardContent, CardFooter, CardHeader, CardTitle, Icons } from '@ncobase/react';
import { randomId } from '@ncobase/utils';
import { useTranslation } from 'react-i18next';

import { UITopbar } from '../ui/elements';

import { Page } from '@/components/layout';

const records = [
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2019/09/07/19/09/clouds-4459530_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2023/10/09/08/45/ai-generated-8303649_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2018/04/15/20/50/cube-3322835_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2017/09/07/10/09/triangle-2724452_640.png'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2022/10/01/14/27/tangle-7491630_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2023/09/19/18/31/scribble-8263261_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2019/12/13/17/36/illustration-4693515_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2023/11/09/09/05/unicorn-8376844_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2020/05/24/13/57/luck-5214413_640.jpg'
  },
  {
    title: 'Title ',
    user: randomId(),
    url: 'https://cdn.pixabay.com/photo/2018/07/27/05/02/stones-3565221_640.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-1.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-2.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-3.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-4.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-5.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-6.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-7.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-8.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-9.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-10.jpg'
  },
  {
    title: randomId().toLocaleUpperCase(),
    user: randomId(),
    url: 'https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-11.jpg'
  }
];
export const Masonry = ({ ...rest }) => {
  const { t } = useTranslation();
  return (
    <Page sidebar {...rest} topbar={<UITopbar title={t('example.masonry.title')} />}>
      <div className='columns-1 sm:columns-2 md:columns-3 xl:columns-4 2xl:columns-5'>
        {records.map(record => (
          <Card className='mb-4 inline-block w-full' key={record.title}>
            <CardHeader className='py-4'>
              <CardTitle>
                <p className='truncate text-slate-600'>{record.title}</p>
              </CardTitle>
            </CardHeader>
            <CardContent className='p-0'>
              <div className='group relative block rounded-md transition-all duration-500'>
                <img
                  src={record.url}
                  alt={record.title}
                  className='w-full object-cover object-center'
                />
              </div>
            </CardContent>
            <CardFooter className='justify-between py-4'>
              <div className='flex-1 flex gap-x-2'>
                <Icons name='IconUser' className='text-slate-500' />
                <span className='text-slate-500'>{record.user}</span>
              </div>
              <div className='flex gap-x-2'>
                <Icons name='IconEdit' className='text-slate-400' />
                <Icons name='IconTrash' className='text-slate-400' />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Page>
  );
};

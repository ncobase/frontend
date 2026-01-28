import { Button } from '@/components/elements';

export const topbarLeftSection = ({
  handleView
}: {
  handleView: (record: any, mode: string) => void;
}) => [
  <div key='actions' className='rounded-md flex items-center justify-between gap-x-1'>
    <Button icon='IconPlus' onClick={() => handleView(null, 'create')} tooltip='Create Product' />
  </div>
];

export const topbarRightSection = () => [];

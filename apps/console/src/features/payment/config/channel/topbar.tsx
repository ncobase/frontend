import { Button } from '@/components/elements';

export const topbarLeftSection = ({
  handleView
}: {
  handleView: (_record: any, _mode: string) => void;
}) => [
  <div key='actions' className='rounded-md flex items-center justify-between gap-x-1'>
    <Button icon='IconPlus' onClick={() => handleView(null, 'create')} tooltip='Add Channel' />
  </div>
];

export const topbarRightSection = () => [];

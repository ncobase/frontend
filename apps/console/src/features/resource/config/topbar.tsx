import { Button } from '@/components/elements';

export const topbarLeftSection = ({
  handleView,
  handleUpload
}: {
  handleView: (record: any, mode: string) => void;
  handleUpload: () => void;
}) => [
  <div key='actions' className='rounded-md flex items-center justify-between gap-x-1'>
    <Button icon='IconUpload' onClick={handleUpload} tooltip='Upload' />
  </div>
];

export const topbarRightSection = () => [];

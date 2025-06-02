import { Button, DropdownControl, LayoutControl, ScreenControl } from '@/components/elements';

export const topbarLeftSection = ({ handleView }) => [
  <div className='rounded-md flex items-center justify-between gap-x-1'>
    <Button icon='IconPlus' onClick={() => handleView(null, 'create')} tooltip='Create Option' />
  </div>
];

export const topbarRightSection = [<DropdownControl />, <LayoutControl />, <ScreenControl />];

import { Button, ScreenControl } from '@/components/elements';

export const topbarLeftSection = ({ setShowBulkImport, handleCreate }) => [
  <Button icon='IconPlus' onClick={handleCreate} tooltip='Create New Option' />,
  <Button
    icon='IconUpload'
    onClick={() => setShowBulkImport(true)}
    tooltip='Import Options from JSON'
  />
];

export const topbarRightSection = [<ScreenControl />];

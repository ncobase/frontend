import { Button, ScreenControl } from '@/components/elements';

export const topbarLeftSection = ({ handleView, setShowImportExport }) => [
  <Button icon='IconPlus' onClick={() => handleView(null, 'create')} tooltip='Create Dictionary' />,
  <Button icon='IconUpload' onClick={() => setShowImportExport(true)} tooltip='Import/Export' />
];

export const topbarRightSection = [<ScreenControl />];

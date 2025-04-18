import { Page } from '@/components/layout';

export const BasicLayout = ({ children, ...rest }) => {
  return (
    <Page sidebar submenu {...rest}>
      {children}
    </Page>
  );
};

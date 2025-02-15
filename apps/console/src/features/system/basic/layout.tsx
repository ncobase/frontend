import { Page } from '@/layout';

export const BasicLayout = ({ children, ...rest }) => {
  return (
    <Page sidebar submenu {...rest}>
      {children}
    </Page>
  );
};

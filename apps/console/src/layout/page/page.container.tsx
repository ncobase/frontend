import { HtmlHTMLAttributes } from 'react';
import React from 'react';

import { Container } from '@ncobase/react';

import { usePageContext } from './page.context';

interface PageContainerProps extends React.PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>> {}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  ...rest
}): JSX.Element => {
  const { layout, topbar, submenu } = usePageContext();

  if (!layout && !topbar && !submenu) return <>{children}</>;

  return (
    <Container className={className} {...rest}>
      {children}
    </Container>
  );
};

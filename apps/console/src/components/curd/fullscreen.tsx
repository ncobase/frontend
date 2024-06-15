import React from 'react';

import { CommonProps } from '.';

export interface FullscreenViewProps<T extends object> extends CommonProps<T> {}

export const FullscreenView = <T extends object>(_props: FullscreenViewProps<T>) => {
  return <>FullScreen View</>;
};

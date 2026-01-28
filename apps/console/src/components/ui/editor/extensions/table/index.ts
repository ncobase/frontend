import { Table as TableOriginal } from '@tiptap/extension-table';
import { ReactNodeViewRenderer } from '@tiptap/react';

import { TableComponent } from './components/table';

export const CustomTable = TableOriginal.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableComponent);
  }
});

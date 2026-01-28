import React, { useEffect } from 'react';

import { useTable } from '../table.context';

export const KeyboardNavigation: React.FC = () => {
  const { internalData, columns, activeCell, setActiveCell, setSelectedCells } = useTable();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeCell) return;

      const { rowId, colKey } = activeCell;
      const rowIndex = internalData.findIndex(row => row.id === rowId);
      const colIndex = columns.findIndex(col => col.dataIndex === colKey);

      if (rowIndex === -1 || colIndex === -1) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (rowIndex > 0) {
            const prevRowId = internalData[rowIndex - 1].id;
            setActiveCell({ rowId: prevRowId, colKey });
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (rowIndex < internalData.length - 1) {
            const nextRowId = internalData[rowIndex + 1].id;
            setActiveCell({ rowId: nextRowId, colKey });
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (colIndex > 0) {
            const prevColKey = columns[colIndex - 1].dataIndex || '';
            setActiveCell({ rowId, colKey: prevColKey });
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (colIndex < columns.length - 1) {
            const nextColKey = columns[colIndex + 1].dataIndex || '';
            setActiveCell({ rowId, colKey: nextColKey });
          }
          break;

        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            // Move to previous cell or previous row's last cell
            if (colIndex > 0) {
              const prevColKey = columns[colIndex - 1].dataIndex || '';
              setActiveCell({ rowId, colKey: prevColKey });
            } else if (rowIndex > 0) {
              const prevRowId = internalData[rowIndex - 1].id;
              const lastColKey = columns[columns.length - 1].dataIndex || '';
              setActiveCell({ rowId: prevRowId, colKey: lastColKey });
            }
          } else {
            // Move to next cell or next row's first cell
            if (colIndex < columns.length - 1) {
              const nextColKey = columns[colIndex + 1].dataIndex || '';
              setActiveCell({ rowId, colKey: nextColKey });
            } else if (rowIndex < internalData.length - 1) {
              const nextRowId = internalData[rowIndex + 1].id;
              const firstColKey = columns[0].dataIndex || '';
              setActiveCell({ rowId: nextRowId, colKey: firstColKey });
            }
          }
          break;

        case 'Enter':
          // Start editing the active cell (handled by cell component)
          break;

        case 'Escape':
          // Clear selection
          setActiveCell(null);
          setSelectedCells([]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCell, internalData, columns, setActiveCell, setSelectedCells]);

  return null; // This is just for the keyboard event handling
};

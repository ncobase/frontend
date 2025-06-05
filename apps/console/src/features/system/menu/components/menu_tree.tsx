import { useState, useCallback, useMemo } from 'react';

import {
  Button,
  Icons,
  Badge,
  Tooltip,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger
} from '@ncobase/react';
import { useTranslation } from 'react-i18next';

interface MenuTreeProps {
  menus: any[];
  onEdit: (_menu: any) => void;
  onDelete: (_menu: any) => void;
  onReorder: (_menus: any[]) => void;
  onToggleStatus: (_menu: any) => void;
}

export const MenuTree: React.FC<MenuTreeProps> = ({ menus, onEdit, onDelete, onToggleStatus }) => {
  const { t } = useTranslation();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Build tree structure
  const menuTree = useMemo(() => {
    const tree = [];
    const menuMap = new Map();

    // Create menu map
    menus.forEach(menu => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // Build tree
    menus.forEach(menu => {
      const menuItem = menuMap.get(menu.id);
      if (menu.parent_id && menuMap.has(menu.parent_id)) {
        menuMap.get(menu.parent_id).children.push(menuItem);
      } else {
        tree.push(menuItem);
      }
    });

    return tree;
  }, [menus]);

  const toggleExpanded = useCallback((menuId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  }, []);

  const renderMenuItem = useCallback(
    (menu: any, level: number = 0) => {
      const hasChildren = menu.children && menu.children.length > 0;
      const isExpanded = expandedItems.has(menu.id);

      return (
        <div key={menu.id} className='select-none'>
          <div
            className='flex items-center justify-between p-2 hover:bg-slate-50 rounded'
            style={{ paddingLeft: `${level * 20 + 8}px` }}
          >
            <div className='flex items-center space-x-2 flex-1'>
              {hasChildren ? (
                <Button variant='ghost' size='xs' onClick={() => toggleExpanded(menu.id)}>
                  <Icons name={isExpanded ? 'IconChevronDown' : 'IconChevronRight'} size={14} />
                </Button>
              ) : (
                <div className='w-6' />
              )}

              {menu.icon && <Icons name={menu.icon} className='w-4 h-4 text-slate-500' />}

              <div className='flex-1'>
                <div className='flex items-center space-x-2'>
                  <span className='font-medium'>{menu.label || menu.name}</span>
                  {menu.hidden && (
                    <Badge variant='outline-slate' size='xs'>
                      {t('menu.status.hidden')}
                    </Badge>
                  )}
                  {menu.disabled && (
                    <Badge variant='danger' size='xs'>
                      {t('common.disabled')}
                    </Badge>
                  )}
                  {menu.perms && (
                    <Tooltip content={t('menu.permission_required', { perm: menu.perms })}>
                      <Icons name='IconLock' className='w-3 h-3 text-amber-500' />
                    </Tooltip>
                  )}
                </div>
                {menu.path && <div className='text-xs text-slate-500 font-mono'>{menu.path}</div>}
              </div>
            </div>

            <div className='flex items-center space-x-1'>
              <Badge variant='outline-slate' size='xs'>
                {menu.order || 0}
              </Badge>

              <Dropdown>
                <DropdownTrigger asChild>
                  <Button variant='ghost' size='xs'>
                    <Icons name='IconDots' size={14} />
                  </Button>
                </DropdownTrigger>
                <DropdownContent align='end'>
                  <DropdownItem onClick={() => onEdit(menu)}>
                    <Icons name='IconPencil' className='mr-2' />
                    {t('actions.edit')}
                  </DropdownItem>
                  <DropdownItem onClick={() => onEdit({ parent_id: menu.id })}>
                    <Icons name='IconPlus' className='mr-2' />
                    {t('menu.actions.add_child')}
                  </DropdownItem>
                  <DropdownItem onClick={() => onToggleStatus(menu)}>
                    <Icons
                      name={menu.disabled ? 'IconCircleCheck' : 'IconCircleMinus'}
                      className='mr-2'
                    />
                    {menu.disabled ? t('actions.enable') : t('actions.disable')}
                  </DropdownItem>
                  <DropdownItem
                    onClick={() => onDelete(menu)}
                    className='text-red-600 hover:text-red-700'
                  >
                    <Icons name='IconTrash' className='mr-2' />
                    {t('actions.delete')}
                  </DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
          </div>

          {/* Render children */}
          {hasChildren && isExpanded && (
            <div>{menu.children.map(child => renderMenuItem(child, level + 1))}</div>
          )}
        </div>
      );
    },
    [expandedItems, toggleExpanded, onEdit, onDelete, onToggleStatus, t]
  );

  return (
    <div className='space-y-1'>
      {menuTree.length === 0 ? (
        <div className='text-center py-8 text-slate-500'>{t('menu.no_menus')}</div>
      ) : (
        menuTree.map(menu => renderMenuItem(menu))
      )}
    </div>
  );
};

import { useCallback, useEffect, useMemo, useState } from 'react';

import { Form, Modal, useToastMessage } from '@ncobase/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { QueryFormParams, queryFields } from '../config/query';
import { tableColumns } from '../config/table';
import { topbarLeftSection, topbarRightSection } from '../config/topbar';
import { useMenuList } from '../hooks';
import { MenuTree } from '../menu';
import {
  useCreateMenu,
  useDeleteMenu,
  useMoveMenu,
  useUpdateMenu,
  useToggleMenuStatus
} from '../service';

import { CreateMenuPage } from './create';
import { EditorMenuPage } from './editor';
import { MenuViewerPage } from './viewer';

import { CurdView } from '@/components/curd';

export const MenuListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mode } = useParams<{ mode: string; slug: string }>();
  const toast = useToastMessage();

  const { data, fetchData, loading, refetch } = useMenuList();

  const [viewType, setViewType] = useState<string | undefined>(mode);
  const [selectedRecord, setSelectedRecord] = useState<MenuTree | null>(null);
  const [moveDialog, setMoveDialog] = useState<{
    open: boolean;
    menu: MenuTree | null;
  }>({ open: false, menu: null });

  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    reset: queryReset
  } = useForm<QueryFormParams>();

  const {
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue,
    handleSubmit: handleFormSubmit
  } = useForm<MenuTree>();

  const createMenuMutation = useCreateMenu();
  const updateMenuMutation = useUpdateMenu();
  const deleteMenuMutation = useDeleteMenu();
  const toggleStatusMutation = useToggleMenuStatus();
  const moveMenuMutation = useMoveMenu();

  const {
    control: moveControl,
    formState: { errors: moveErrors },
    reset: resetMoveForm,
    handleSubmit: handleMoveSubmit
  } = useForm<{ parent_id: string; order: number }>();

  const vmode = 'flatten' as 'flatten' | 'modal';

  useEffect(() => {
    if (mode) {
      setViewType(mode);
    } else {
      setViewType(undefined);
    }
  }, [mode]);

  const onQuery = handleQuerySubmit(async queryData => {
    await fetchData({ ...queryData, cursor: '' });
    await refetch();
  });

  const onResetQuery = () => {
    queryReset();
  };

  const handleView = useCallback(
    (record: MenuTree | null, type: string) => {
      setSelectedRecord(record);
      setViewType(type);

      if (vmode === 'flatten') {
        navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
      }
    },
    [navigate, vmode]
  );

  const handleClose = useCallback(() => {
    setSelectedRecord(null);
    setViewType(undefined);
    formReset();

    if (vmode === 'flatten' && viewType) {
      navigate(-1);
    }
  }, [formReset, navigate, vmode, viewType]);

  const onSuccess = useCallback(() => {
    handleClose();
    refetch();
  }, [handleClose, refetch]);

  const handleCreate = useCallback(
    (data: MenuTree) => {
      createMenuMutation.mutate(data, { onSuccess });
    },
    [createMenuMutation, onSuccess]
  );

  const handleUpdate = useCallback(
    (data: MenuTree) => {
      updateMenuMutation.mutate(data, { onSuccess });
    },
    [updateMenuMutation, onSuccess]
  );

  const handleDelete = useCallback(
    (record: MenuTree) => {
      if (record.id) {
        deleteMenuMutation.mutate(record.id, { onSuccess });
      }
    },
    [deleteMenuMutation, onSuccess]
  );

  const handleToggleStatus = useCallback(
    (record: MenuTree, action: 'enable' | 'disable' | 'show' | 'hide') => {
      if (record.id) {
        toggleStatusMutation.mutate({ id: record.id, action }, { onSuccess });
      }
    },
    [toggleStatusMutation, onSuccess]
  );

  const handleMove = useCallback(
    (record: MenuTree) => {
      resetMoveForm({
        parent_id: record.parent_id || 'root',
        order: record.order ?? 99
      });
      setMoveDialog({ open: true, menu: record });
    },
    [resetMoveForm]
  );

  const flattenedMenus = useMemo(() => {
    const flatten = (items: MenuTree[] = []): MenuTree[] =>
      items.flatMap(item => [item, ...flatten(item.children || [])]);
    return flatten(data?.items || []);
  }, [data?.items]);

  const blockedParentIds = useMemo(() => {
    const selected = moveDialog.menu;
    if (!selected?.id) return new Set<string>();

    const collect = (item: MenuTree): string[] => [
      item.id!,
      ...(item.children || []).flatMap(child => collect(child))
    ];
    return new Set(collect(selected));
  }, [moveDialog.menu]);

  const moveParentOptions = useMemo(
    () => [
      { label: t('menu.no_parent', 'No Parent (Root Level)'), value: 'root' },
      ...flattenedMenus
        .filter(menu => menu.id && !blockedParentIds.has(menu.id))
        .map(menu => ({
          label: `${menu.name || menu.label || menu.slug || menu.id}${menu.path ? ` (${menu.path})` : ''}`,
          value: menu.id || ''
        }))
    ],
    [blockedParentIds, flattenedMenus, t]
  );

  const handleConfirmMove = useCallback(
    handleMoveSubmit(async values => {
      if (!moveDialog.menu?.id) return;
      try {
        await moveMenuMutation.mutateAsync({
          id: moveDialog.menu.id,
          parentId: values.parent_id && values.parent_id !== 'root' ? values.parent_id : null,
          order: Number(values.order ?? 99)
        });
        toast.success(t('messages.success'), {
          description: t('menu.messages.move_success', 'Menu position updated')
        });
        setMoveDialog({ open: false, menu: null });
        refetch();
      } catch (error) {
        toast.error(t('messages.error'), {
          description: error['message'] || t('menu.messages.move_failed', 'Failed to move menu')
        });
      }
    }),
    [handleMoveSubmit, moveDialog.menu, moveMenuMutation, toast, t, refetch]
  );

  const handleConfirm = useCallback(
    handleFormSubmit((data: MenuTree) => {
      return viewType === 'create' ? handleCreate(data) : handleUpdate(data);
    }),
    [handleFormSubmit, viewType, handleCreate, handleUpdate]
  );

  const tableConfig = {
    columns: tableColumns({ handleView, handleDelete, handleToggleStatus, handleMove }),
    topbarLeft: topbarLeftSection({ handleView }),
    topbarRight: topbarRightSection,
    title: t('system.menus.title')
  };

  return (
    <>
      <CurdView
        viewMode={vmode}
        title={tableConfig.title}
        topbarLeft={tableConfig.topbarLeft}
        topbarRight={tableConfig.topbarRight}
        columns={tableConfig.columns}
        data={data?.items || []}
        queryFields={queryFields({ queryControl })}
        onQuery={onQuery}
        onResetQuery={onResetQuery}
        maxTreeLevel={-1} // Support unlimited nesting
        isAllExpanded
        paginated={false}
        fetchData={fetchData}
        loading={loading}
        createComponent={
          <CreateMenuPage
            viewMode={vmode}
            onSubmit={handleConfirm}
            control={formControl}
            errors={formErrors}
          />
        }
        viewComponent={record => (
          <MenuViewerPage viewMode={vmode} handleView={handleView} record={record?.id} />
        )}
        editComponent={record => (
          <EditorMenuPage
            viewMode={vmode}
            record={record?.id}
            onSubmit={handleConfirm}
            control={formControl}
            setValue={setFormValue}
            errors={formErrors}
          />
        )}
        type={viewType}
        record={selectedRecord}
        onConfirm={handleConfirm}
        onCancel={handleClose}
      />
      <Modal
        isOpen={moveDialog.open}
        onCancel={() => setMoveDialog({ open: false, menu: null })}
        title={t('menu.move.title', 'Move Menu')}
        description={t('menu.move.description', {
          defaultValue: 'Change parent and order for "{{name}}"',
          name: moveDialog.menu?.name || moveDialog.menu?.label || moveDialog.menu?.id
        })}
        confirmText={t('actions.save', 'Save')}
        confirmDisabled={moveMenuMutation.isPending}
        onConfirm={handleConfirmMove}
        className='max-w-xl'
      >
        <Form
          id='move-menu'
          className='grid grid-cols-1 gap-4'
          control={moveControl}
          errors={moveErrors}
          fields={[
            {
              title: t('menu.fields.parent', 'Parent Menu'),
              name: 'parent_id',
              type: 'select',
              options: moveParentOptions
            },
            {
              title: t('menu.fields.order', 'Sort Order'),
              name: 'order',
              type: 'number',
              rules: {
                min: {
                  value: 0,
                  message: t('menu.validation.order_min', 'Order must be a positive number')
                }
              }
            }
          ]}
        />
      </Modal>
    </>
  );
};

import { useState, useEffect, useCallback, useMemo } from 'react';

import { isUndefined } from '@ncobase/utils';
import {
  useForm,
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormReset
} from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';

// Types
type CrudParams<T> = {
  fetchList: (_query?: { [key: string]: any }) => Promise<T[]>;
  fetchItem: (_id: string) => Promise<T>;
  createItem: (_data: T) => Promise<void>;
  updateItem: (_id: string, _data: T) => Promise<void>;
  deleteItem: (_id: string) => Promise<void>;
};

type CrudHooks<T, Q> = {
  items: T[];
  selectedItem: T | null;
  viewType: 'view' | 'edit' | 'create' | undefined;
  handleDialogView: (_record: T | null, _type: string) => void;
  handleDialogClose: () => void;
  handleCreate: (_data: T) => void;
  handleUpdate: (_data: T) => void;
  handleDelete: (_id: string) => void;
  queryControl: Control<Q>;
  queryErrors: FieldErrors<Q>;
  handleQuerySubmit: UseFormHandleSubmit<Q>;
  queryReset: UseFormReset<Q>;
  formControl: Control<T>;
  formErrors: FieldErrors<T>;
  handleConfirm: () => void;
  setFormValue: UseFormSetValue<T>;
  refetch: () => Promise<void>;
  loading: boolean;
};

/**
 * Custom hook for CRUD operations
 * @param param0 CRUD parameters
 * @returns CRUD hooks
 */
export function useCrud<T extends { id?: string }, Q>({
  fetchList,
  fetchItem,
  createItem,
  updateItem,
  deleteItem
}: CrudParams<T>): CrudHooks<T, Q> {
  const [items, setItems] = useState<T[]>([]);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [viewType, setViewType] = useState<'view' | 'edit' | 'create'>();
  const [loading, setLoading] = useState<boolean>(false);

  // Form setup
  const {
    handleSubmit: handleFormSubmit,
    control: formControl,
    formState: { errors: formErrors },
    reset: formReset,
    setValue: setFormValue
  } = useForm<T>();

  // Query form setup
  const {
    handleSubmit: handleQuerySubmit,
    control: queryControl,
    formState: { errors: queryErrors },
    reset: queryReset
  } = useForm<Q>();

  // Router hooks
  const { mode, slug } = useParams<{ mode: string; slug: string }>();
  const navigate = useNavigate();

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedItems = await fetchList();
      setItems(fetchedItems);
    } catch (error) {
      console.error('Error fetching list:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchList]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle URL parameters
  useEffect(() => {
    const fetchItemData = async () => {
      if (!isUndefined(slug) && !isUndefined(mode) && !selectedItem) {
        try {
          setLoading(true);
          const record = await fetchItem(slug);
          setSelectedItem(record);
          setViewType(mode as 'view' | 'edit');

          // Set form values
          if (record) {
            Object.entries(record).forEach(([key, value]) => {
              setFormValue(key as any, value as any);
            });
          }
        } catch (error) {
          console.error('Error fetching item:', error);
        } finally {
          setLoading(false);
        }
      } else if (mode === 'create') {
        setSelectedItem(null);
        setViewType('create');
        formReset();
      } else if (isUndefined(mode) && isUndefined(slug)) {
        setSelectedItem(null);
        setViewType(undefined);
        formReset();
      }
    };

    fetchItemData();
  }, [mode, slug, selectedItem, fetchItem, setFormValue, formReset]);

  // Navigate to view
  const handleDialogView = useCallback(
    (record: T | null, type: string) => {
      setSelectedItem(record);
      setViewType(type as any);
      navigate(`${type}${record?.id ? `/${record.id}` : ''}`);
    },
    [navigate]
  );

  // Close dialog and reset
  const handleDialogClose = useCallback(() => {
    setSelectedItem(null);
    setViewType(undefined);
    formReset();
    fetchData();
    navigate('');
  }, [formReset, navigate, fetchData]);

  // Create item
  const handleCreate = useCallback(
    async (data: T) => {
      try {
        setLoading(true);
        await createItem(data);
        handleDialogClose();
        await fetchData();
      } catch (error) {
        console.error('Error creating item:', error);
      } finally {
        setLoading(false);
      }
    },
    [createItem, handleDialogClose, fetchData]
  );

  // Update item
  const handleUpdate = useCallback(
    async (data: T) => {
      if (selectedItem?.id) {
        try {
          setLoading(true);
          await updateItem(selectedItem.id, data);
          handleDialogClose();
          await fetchData();
        } catch (error) {
          console.error('Error updating item:', error);
        } finally {
          setLoading(false);
        }
      }
    },
    [selectedItem, updateItem, handleDialogClose, fetchData]
  );

  // Delete item
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        await deleteItem(id);
        await fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setLoading(false);
      }
    },
    [deleteItem, fetchData]
  );

  // Form submission handler
  const handleConfirm = useMemo(
    () =>
      handleFormSubmit((data: T) => {
        switch (viewType) {
          case 'edit':
            return handleUpdate(data);
          case 'create':
            return handleCreate(data);
          default:
            return;
        }
      }),
    [handleFormSubmit, viewType, handleUpdate, handleCreate]
  );

  // Manual refetch function
  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    items,
    selectedItem,
    viewType,
    handleDialogView,
    handleDialogClose,
    handleCreate,
    handleUpdate,
    handleDelete,
    queryControl,
    queryErrors,
    handleQuerySubmit,
    queryReset,
    formControl,
    formErrors,
    handleConfirm,
    setFormValue,
    refetch,
    loading
  };
}

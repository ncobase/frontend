// import { useState, useEffect, useCallback, useMemo } from 'react';

// import { isUndefined } from '@ncobase/utils';
// import {
//   useForm,
//   Control,
//   FieldErrors,
//   UseFormHandleSubmit,
//   UseFormSetValue,
//   UseFormReset
// } from 'react-hook-form';
// import { useNavigate, useParams } from 'react-router-dom';

// type CrudParams<T> = {
//   fetchList: (query?: { [key: string]: any }) => Promise<T[]>;
//   fetchItem: (id: string) => Promise<T>;
//   createItem: (data: T) => Promise<void>;
//   updateItem: (id: string, data: T) => Promise<void>;
//   deleteItem: (id: string) => Promise<void>;
// };

// type CrudHooks<T, Q> = {
//   items: T[];
//   selectedItem: T | null;
//   viewType: 'view' | 'edit' | 'create' | undefined;
//   handleDialogView: (record: T | null, type: 'view' | 'edit' | 'create') => void;
//   handleDialogClose: () => void;
//   handleCreate: (data: T) => void;
//   handleUpdate: (data: T) => void;
//   handleDelete: (id: string) => void;
//   queryControl: Control<Q>;
//   queryErrors: FieldErrors<Q>;
//   handleQuerySubmit: UseFormHandleSubmit<Q>;
//   queryReset: UseFormReset<Q>;
//   formControl: Control<T>;
//   formErrors: FieldErrors<T>;
//   handleConfirm: () => void;
//   setFormValue: UseFormSetValue<T>;
// };

// export function useCrud<T, Q>({
//   fetchList,
//   fetchItem,
//   createItem,
//   updateItem,
//   deleteItem
// }: CrudParams<T>): CrudHooks<T, Q> {
//   const [items, setItems] = useState<T[]>([]);
//   const [selectedItem, setSelectedItem] = useState<T | null>(null);
//   const [viewType, setViewType] = useState<'view' | 'edit' | 'create'>();

//   const {
//     handleSubmit: handleFormSubmit,
//     control: formControl,
//     formState: { errors: formErrors },
//     reset: formReset,
//     setValue: setFormValue
//   } = useForm<T>();

//   const {
//     handleSubmit: handleQuerySubmit,
//     control: queryControl,
//     formState: { errors: queryErrors },
//     reset: queryReset
//   } = useForm<Q>();

//   const { mode, slug } = useParams<{ mode: string; slug: string }>();
//   const navigate = useNavigate();

//   const fetchData = useCallback(async () => {
//     const fetchedItems = await fetchList();
//     setItems(fetchedItems);
//   }, [fetchList]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     const fetchItemData = async () => {
//       if (!isUndefined(slug) && !isUndefined(mode) && !selectedItem) {
//         const record = await fetchItem(slug);
//         setSelectedItem(record);
//         setViewType(mode as 'view' | 'edit');
//         if (record) {
//           for (const key in record) {
//             setFormValue(key as any, (record as any)[key]);
//           }
//         }
//       } else if (mode === 'create') {
//         setSelectedItem(null);
//         setViewType('create');
//       } else if (isUndefined(mode) && isUndefined(slug)) {
//         setSelectedItem(null);
//         setViewType(undefined);
//       }
//     };
//     fetchItemData();
//   }, [mode, slug, selectedItem, fetchItem, setFormValue]);

//   const handleDialogView = useCallback(
//     (record: T | null, type: 'view' | 'edit' | 'create') => {
//       setSelectedItem(record);
//       setViewType(type);
//       navigate(`${type}${record ? `/${(record as any).id}` : ''}`);
//     },
//     [navigate]
//   );

//   const handleDialogClose = useCallback(() => {
//     setSelectedItem(null);
//     setViewType(undefined);
//     formReset();
refetch();
//     navigate('');
//   }, [formReset, navigate]);

//   const handleCreate = useCallback(
//     async (data: T) => {
//       await createItem(data);
//       handleDialogClose();
//       fetchData();
//     },
//     [createItem, handleDialogClose, fetchData]
//   );

//   const handleUpdate = useCallback(
//     async (data: T) => {
//       if (selectedItem && (selectedItem as any).id) {
//         await updateItem((selectedItem as any).id, data);
//         handleDialogClose();
//         fetchData();
//       }
//     },
//     [selectedItem, updateItem, handleDialogClose, fetchData]
//   );

//   const handleDelete = useCallback(
//     async (id: string) => {
//       await deleteItem(id);
//       fetchData();
//     },
//     [deleteItem, fetchData]
//   );

//   const handleConfirm = useMemo(
//     () =>
//       handleFormSubmit((data: T) => {
//         switch (viewType) {
//           case 'edit':
//             return handleUpdate(data);
//           case 'create':
//             return handleCreate(data);
//         }
//       }),
//     [handleFormSubmit, viewType, handleUpdate, handleCreate]
//   );

//   return {
//     items,
//     selectedItem,
//     viewType,
//     handleDialogView,
//     handleDialogClose,
//     handleCreate,
//     handleUpdate,
//     handleDelete,
//     queryControl,
//     queryErrors,
//     handleQuerySubmit,
//     queryReset,
//     formControl,
//     formErrors,
//     handleConfirm,
//     setFormValue
//   };
// }

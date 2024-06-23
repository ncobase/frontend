// import { useEffect, useState } from 'react';

// import { useForm, UseFormReturn } from 'react-hook-form';
// import { useParams, useNavigate } from 'react-router-dom';

// interface CrudService<T> {
//   list: () => T[];
//   create: (data: T) => void;
//   update: (data: T) => void;
// }

// interface QueryFields<T> {
//   (control: UseFormReturn<T>): JSX.Element[];
// }

// export const useCrudPage = <T extends object>(
//   services: CrudService<T>,
//   queryFields: QueryFields<T>
// ) => {
//   const { mode, slug } = useParams<{ mode: string; slug: string }>();
//   const navigate = useNavigate();

//   const {
//     handleSubmit: handleQuerySubmit,
//     control: queryControl,
//     reset: queryReset
//   } = useForm<any>({});

//   const onQuery = handleQuerySubmit(data => {
//     console.log(data);
//   });

//   const onResetQuery = () => {
//     queryReset();
//   };

//   const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
//   const [viewType, setViewType] = useState<'view' | 'edit' | 'create'>();

//   useEffect(() => {
//     if (slug) {
//       const record = services.list().find(item => item.id === slug) || null;
//       setSelectedRecord(record);
//       setViewType(mode as 'view' | 'edit');
//     } else if (mode === 'create') {
//       setSelectedRecord(null);
//       setViewType('create');
//     } else {
//       setSelectedRecord(null);
//       setViewType(undefined);
//     }
//   }, [mode, slug]);

//   const handleDialogView = (record: T | null, type: 'view' | 'edit' | 'create') => {
//     setSelectedRecord(record);
//     setViewType(type);
//     navigate(`${type}${record ? `/${record.id}` : ''}`);
//   };

//   const handleDialogClose = () => {
//     setSelectedRecord(null);
//     setViewType(undefined);
//     formReset();
//     navigate('');
//   };

//   const {
//     control: formControl,
//     formState: { errors: formErrors },
//     reset: formReset,
//     setValue: setFormValue,
//     handleSubmit: handleFormSubmit
//   } = useForm<T>({});

//   const handleCreate = (data: T) => {
//     services.create(data);
//     handleDialogClose();
//   };

//   const handleUpdate = (data: T) => {
//     services.update(data);
//     handleDialogClose();
//   };

//   const handleConfirm = handleFormSubmit((data: T) => {
//     return {
//       create: handleCreate,
//       edit: handleUpdate
//     }[viewType](data);
//   });

//   const items = services.list();

//   return {
//     items,
//     viewType,
//     selectedRecord,
//     formControl,
//     formErrors,
//     queryControl,
//     queryFields: queryFields(queryControl),
//     onQuery,
//     onResetQuery,
//     handleDialogView,
//     handleDialogClose,
//     handleConfirm
//   };
// };

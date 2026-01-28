# 📄 Toast

## Overview

The toast provides temporary, self-dismissing popup notifications used
for user feedback such as success, error, or info messages.

## Components

- **ToastProvider**: Wraps the app to provide toast context.
- **ToastContainer**: Renders and positions toast messages.
- **Toast Hooks**: Provides methods to show and manage toasts.

## Setup

```tsx
import { ToastProvider, ToastContainer } from '@ncobase/react';

const App = () => (
  <ToastProvider>
    {/* app content */}
    <ToastContainer position='top-right' />
  </ToastProvider>
);
```

## Usage Example

```tsx
import { useToastMessage } from '@ncobase/react';

const MyComponent = () => {
  const toast = useToastMessage();

  const save = async () => {
    const id = toast.info('Saving...', { duration: 0 });
    try {
      await saveData();
      toast.update(id, { message: 'Saved!', type: 'success' });
    } catch {
      toast.error('Failed to save');
    }
  };

  return <button onClick={save}>Submit</button>;
};
```

## API Reference

```tsx
const { success, error, warning, info, custom, dismiss, clear, update, toasts } = useToastMessage();
```

```tsx
<ToastContainer position='top-right' maxToasts={5} className='custom-class' />
```

## Best Practices

- Keep toast messages short.
- Use for temporary, user-driven feedback.
- Avoid too many toasts at once.

## Troubleshooting

- Ensure `ToastProvider` wraps your app.
- Confirm `ToastContainer` is rendered.
- Autoplay restrictions may block audio-based toasts.

# Portal

## Overview

`Portal` renders children into a DOM node outside the parent hierarchy — useful for modals, tooltips, dropdowns, and toasts.

## Installation

```tsx
import { Portal } from '@ncobase/react';
```

## Usage

### Basic

```tsx
<Portal>
  <div className='modal'>Modal content</div>
</Portal>
```

Renders to `document.body` by default.

### Custom Container

```tsx
const ref = useRef<HTMLDivElement>(null);

<Portal container={ref.current}>
  <div className='tooltip'>Tooltip</div>
</Portal>;
```

### Mount/Unmount Callbacks

```tsx
<Portal
  onMount={() => (document.body.style.overflow = 'hidden')}
  onUnmount={() => (document.body.style.overflow = '')}
>
  <div className='modal'>Modal content</div>
</Portal>
```

### Conditional

```tsx
{
  show && (
    <Portal>
      <div className='modal'>Hello Portal</div>
    </Portal>
  );
}
```

### Disable Portal

```tsx
<Portal disablePortal={true}>
  <div>Rendered inline</div>
</Portal>
```

## Props

| Prop            | Type                  | Default         | Description                       |
| --------------- | --------------------- | --------------- | --------------------------------- |
| `children`      | `React.ReactNode`     | Required        | Content to render                 |
| `container`     | `HTMLElement \| null` | `document.body` | Optional container element        |
| `onMount`       | `() => void`          | —               | Called when portal mounts         |
| `onUnmount`     | `() => void`          | —               | Called when portal unmounts       |
| `disablePortal` | `boolean`             | `false`         | If `true`, renders content inline |

## Notes

- **SSR**: Only renders on the client.
- **React 18**: Uses `createPortal`, fully supported.
- **Performance**: Minimal, but creates a separate render tree.
- **Accessibility**: Manage focus for modals using tools like `focus-trap-react`.

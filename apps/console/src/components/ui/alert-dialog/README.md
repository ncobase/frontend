# AlertDialog Component

A dialog for displaying confirmation or alert messages with actions.

## Basic Usage

```tsx
import { AlertDialog, Button } from '@ncobase/react';

// Simple alert dialog
<AlertDialog
  title="Delete Item"
  description="Are you sure you want to delete this item? This action cannot be undone."
  trigger={<Button variant="destructive">Delete Item</Button>}
  onCancel={() => console.log('Cancelled')}
  onConfirm={() => handleDelete()}
/>

// Controlled usage
const [isOpen, setIsOpen] = useState(false);

<AlertDialog
  title="Confirm Changes"
  description="Your changes will be saved."
  isOpen={isOpen}
  onChange={() => setIsOpen(!isOpen)}
  cancelText="Discard"
  confirmText="Save"
  onCancel={() => setIsOpen(false)}
  onConfirm={() => {
    saveChanges();
    setIsOpen(false);
  }}
/>

// With custom footer
<AlertDialog
  title="Custom Actions"
  description="Choose an action below."
  footer={
    <div className="flex gap-2">
      <Button variant="outline">Option 1</Button>
      <Button variant="outline">Option 2</Button>
      <Button variant="primary">Confirm</Button>
    </div>
  }
/>
```

## Props

| Prop        | Type            | Description                                  |
| ----------- | --------------- | -------------------------------------------- |
| title       | string          | Dialog title                                 |
| description | string          | Dialog description                           |
| children    | React.ReactNode | Dialog children elements                     |
| trigger     | React.ReactNode | Element that triggers the dialog             |
| footer      | React.ReactNode | Custom footer content                        |
| className   | string          | Additional CSS class names                   |
| isOpen      | boolean         | Controls whether dialog is open              |
| onChange    | () => void      | Called when dialog opens or closes           |
| onCancel    | () => void      | Called when Cancel is clicked                |
| cancelText  | string          | Text for Cancel button (default: "Cancel")   |
| onConfirm   | () => void      | Called when Confirm is clicked               |
| confirmText | string          | Text for Confirm button (default: "Confirm") |

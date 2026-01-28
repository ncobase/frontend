# Alert Component

A simple alert component for displaying messages with various styles.

## Basic Usage

```tsx
import { Alert, Icons, Button } from '@ncobase/react';

// Basic usage
<Alert
  title="Success!"
  description="Your action has been completed successfully."
  variant="default"
/>

// With icon
<Alert
  title="Warning"
  description="Please review your information before continuing."
  variant="destructive"
  icon={<Icons name="IconAlertTriangle" />}
/>

// With custom content
<Alert variant="default">
  <AlertTitle>Custom Content</AlertTitle>
  <AlertDescription>
    <p>You can also use the component with custom children.</p>
    <Button size="sm" className="mt-2">Take Action</Button>
  </AlertDescription>
</Alert>
```

## Props

| Prop        | Type                       | Description                  |
| ----------- | -------------------------- | ---------------------------- |
| title       | string                     | Alert title                  |
| description | string                     | Alert description            |
| children    | React.ReactNode            | Alert children elements      |
| icon        | React.ReactNode            | Icon to display in the alert |
| className   | string                     | Additional CSS class names   |
| variant     | 'default' \| 'destructive' | Alert style variant          |

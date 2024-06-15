declare module '*.svg' {
  import React from 'react';
  export const ReactComponet: React.FC<React.SVGProps<SVGSVGElement>>;
  const content: string;
  export default content;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const content: Record<string, string>;
  export default content;
}

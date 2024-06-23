import '@/assets/styles/globals.css';
import '@ncobase/react/dist/index.css';

/** Tailwind's Preflight Style Override */
const naiveStyleOverride = () => {
  const meta = document.createElement('meta');
  meta.name = 'naive-ui-style';
  document.head.appendChild(meta);
};

export const setupStyles = () => {
  naiveStyleOverride();
};

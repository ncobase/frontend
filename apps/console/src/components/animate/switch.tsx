import { Routes, useLocation } from 'react-router-dom';

interface AnimatedSwitchProps extends React.PropsWithChildren {}

export const AnimatedSwitch: React.FC<AnimatedSwitchProps> = ({ children }) => {
  const location = useLocation();

  return <Routes location={location}>{children}</Routes>;
};

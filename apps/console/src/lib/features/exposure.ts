type EnvValue = string | boolean | undefined;

interface FeatureEnv {
  readonly MODE?: string;
  readonly PROD?: boolean | string;
  readonly VITE_ENABLE_BUILDER_ROUTES?: EnvValue;
  readonly VITE_ENABLE_EXAMPLE_ROUTES?: EnvValue;
}

export type ConsoleFeature = 'builder' | 'example';

export const FEATURE_ROUTE_PREFIXES: Record<ConsoleFeature, string[]> = {
  builder: ['/builder'],
  example: ['/example']
};

const truthyValues = new Set(['1', 'true', 'yes', 'on', 'enabled']);
const falsyValues = new Set(['0', 'false', 'no', 'off', 'disabled']);

export const parseFeatureFlag = (value: EnvValue): boolean | undefined => {
  if (typeof value === 'boolean') return value;
  if (typeof value !== 'string') return undefined;

  const normalized = value.trim().toLowerCase();
  if (truthyValues.has(normalized)) return true;
  if (falsyValues.has(normalized)) return false;
  return undefined;
};

const isProductionEnv = (env: FeatureEnv): boolean => {
  if (typeof env.PROD === 'boolean') return env.PROD;
  return env.PROD === 'true' || env.MODE === 'production';
};

export const isConsoleFeatureEnabled = (
  feature: ConsoleFeature,
  env: FeatureEnv = import.meta.env
): boolean => {
  const explicitFlag =
    feature === 'builder' ? env.VITE_ENABLE_BUILDER_ROUTES : env.VITE_ENABLE_EXAMPLE_ROUTES;
  const parsed = parseFeatureFlag(explicitFlag);

  if (parsed !== undefined) return parsed;

  return !isProductionEnv(env);
};

export const isFeaturePath = (path: string, feature: ConsoleFeature): boolean =>
  FEATURE_ROUTE_PREFIXES[feature].some(prefix => path === prefix || path.startsWith(`${prefix}/`));

export const isFeaturePathEnabled = (path: string, env: FeatureEnv = import.meta.env): boolean => {
  const matchedFeature = (Object.keys(FEATURE_ROUTE_PREFIXES) as ConsoleFeature[]).find(feature =>
    isFeaturePath(path, feature)
  );

  if (!matchedFeature) return true;
  return isConsoleFeatureEnabled(matchedFeature, env);
};

export const filterRoutesByFeatureExposure = <Route extends { path: string }>(
  routes: Route[],
  env: FeatureEnv = import.meta.env
): Route[] => routes.filter(route => isFeaturePathEnabled(route.path, env));

export const filterMenuTreeByFeatureExposure = <Menu extends { path?: string; children?: Menu[] }>(
  menus: Menu[],
  env: FeatureEnv = import.meta.env
): Menu[] => {
  return menus.flatMap(menu => {
    if (menu.path && !isFeaturePathEnabled(menu.path, env)) return [];

    if (!menu.children?.length) return [menu];

    const children = filterMenuTreeByFeatureExposure(menu.children, env);
    if (!children.length && (!menu.path || menu.path === '-')) return [];

    if (children.length === menu.children.length) return [menu];

    return [{ ...menu, children }];
  });
};

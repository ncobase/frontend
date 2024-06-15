export interface HostVariables {
  readonly HOST: string;
  readonly PORT: string;
  readonly PATH: string;
}

type EnvironmentValue = 'production' | 'test' | 'development';

export interface EnvironmentNames {
  [key: string]: HostVariables;
}

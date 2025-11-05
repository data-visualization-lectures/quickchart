export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'radar' | 'polarArea';

export interface DatasetConfig {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  borderWidth?: number;
}

export interface ChartConfig {
  type: ChartType;
  data: {
    labels: string[];
    datasets: DatasetConfig[];
  };
  options?: {
    responsive?: boolean;
    maintainAspectRatio?: boolean;
    title?: {
      display?: boolean;
      text?: string;
    };
    plugins?: {
      title?: {
        display?: boolean;
        text?: string;
      };
      legend?: {
        display?: boolean;
      };
    };
  };
}

export interface QuickChartParams {
  chart: ChartConfig;
  width?: number;
  height?: number;
  backgroundColor?: string;
  format?: 'png' | 'webp' | 'jpg' | 'svg' | 'pdf' | 'base64';
  version?: string;
  encoding?: 'url' | 'base64';
}

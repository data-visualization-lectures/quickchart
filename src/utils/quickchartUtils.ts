import { QuickChartParams, ChartConfig } from '../types/chart';

const BASE_URL = 'https://quickchart.io/chart';

export function generateQuickChartUrl(params: QuickChartParams): string {
  const queryParams = new URLSearchParams();

  // Chart configuration is the most important parameter
  queryParams.append('c', JSON.stringify(params.chart));

  // Optional visual parameters
  if (params.width !== undefined) {
    queryParams.append('w', params.width.toString());
  }
  if (params.height !== undefined) {
    queryParams.append('h', params.height.toString());
  }
  if (params.backgroundColor) {
    queryParams.append('bkg', params.backgroundColor);
  }
  if (params.format) {
    queryParams.append('f', params.format);
  }
  if (params.version) {
    queryParams.append('v', params.version);
  }
  if (params.encoding) {
    queryParams.append('encoding', params.encoding);
  }

  return `${BASE_URL}?${queryParams.toString()}`;
}

export function downloadChartImage(
  url: string,
  filename: string = 'chart'
): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'doughnut', label: 'Doughnut Chart' },
  { value: 'radar', label: 'Radar Chart' },
  { value: 'polarArea', label: 'Polar Area Chart' },
] as const;

export const OUTPUT_FORMATS = [
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'jpg', label: 'JPG' },
  { value: 'svg', label: 'SVG' },
  { value: 'pdf', label: 'PDF' },
] as const;

export const CHART_JS_VERSIONS = [
  { value: '3', label: 'Chart.js 3' },
  { value: '4', label: 'Chart.js 4' },
] as const;

// Default sample chart configuration
export const DEFAULT_CHART_CONFIG: ChartConfig = {
  type: 'bar',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sample Data',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    title: {
      display: true,
      text: 'Sample Chart',
    },
    plugins: {},
  },
};

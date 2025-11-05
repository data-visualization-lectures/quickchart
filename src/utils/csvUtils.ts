import Papa from 'papaparse';
import { ChartConfig } from '../types/chart';

export interface ParsedCSVData {
  labels: string[];
  values: number[];
  error?: string;
}

export class CSVParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CSVParseError';
  }
}

/**
 * CSV ファイルを読み込み、解析する
 * @param file - CSV ファイル
 * @returns Promise<ParsedCSVData>
 */
export function parseCSVFile(file: File): Promise<ParsedCSVData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const parsed = Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: false,
        });

        if (parsed.errors && parsed.errors.length > 0) {
          reject(new CSVParseError('CSV ファイルの解析に失敗しました'));
          return;
        }

        const result = validateAndTransformCSV(parsed.data);
        resolve(result);
      } catch (error) {
        reject(
          new CSVParseError(
            error instanceof Error ? error.message : 'ファイル読み込みエラー'
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new CSVParseError('ファイルの読み込みに失敗しました'));
    };

    reader.readAsText(file);
  });
}

/**
 * CSV データを検証し、チャート用に変換
 * @param data - Papa Parse の結果
 * @returns ParsedCSVData
 */
function validateAndTransformCSV(data: any[]): ParsedCSVData {
  // データが空の場合
  if (!data || data.length === 0) {
    throw new CSVParseError('CSVファイルにデータが含まれていません');
  }

  // ヘッダーキーを取得
  const firstRow = data[0];
  const keys = Object.keys(firstRow);

  if (keys.length < 2) {
    throw new CSVParseError('最小2列が必要です（ラベル列 + 値列）');
  }

  // 最初の列をラベル、2番目の列を値として使用
  const labelKey = keys[0];
  const valueKey = keys[1];

  const labels: string[] = [];
  const values: number[] = [];

  for (const row of data) {
    const label = String(row[labelKey]).trim();
    const value = parseFloat(row[valueKey]);

    // 検証
    if (!label) {
      throw new CSVParseError('ラベルが空の行があります');
    }

    if (isNaN(value)) {
      throw new CSVParseError(
        `"${label}" の値が数値ではありません: ${row[valueKey]}`
      );
    }

    labels.push(label);
    values.push(value);
  }

  if (labels.length === 0) {
    throw new CSVParseError('有効なデータ行が見つかりません');
  }

  return { labels, values };
}

/**
 * CSV データから ChartConfig を生成
 * @param csvData - パース済みCSVデータ
 * @param title - チャートタイトル
 * @param datasetLabel - データセットラベル
 * @returns ChartConfig
 */
export function createChartConfigFromCSV(
  csvData: ParsedCSVData,
  title: string = 'Chart from CSV',
  datasetLabel: string = 'Value'
): ChartConfig {
  return {
    type: 'bar',
    data: {
      labels: csvData.labels,
      datasets: [
        {
          label: datasetLabel,
          data: csvData.values,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: title.length > 0,
          text: title,
        },
      },
    },
  };
}

/**
 * CSV ファイルの文字列を返す（サンプル）
 */
export function generateSampleCSV(): string {
  return `Label,Value
January,12
February,19
March,3
April,5
May,2`;
}

/**
 * サンプル CSV ファイルをダウンロード
 */
export function downloadSampleCSV(): void {
  const csv = generateSampleCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', 'sample.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

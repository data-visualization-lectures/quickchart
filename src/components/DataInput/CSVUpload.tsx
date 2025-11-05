import { useState } from 'react';
import { ChartConfig } from '../../types/chart';
import {
  parseCSVFile,
  createChartConfigFromCSV,
  CSVParseError,
  ParsedCSVData,
} from '../../utils/csvUtils';
import { DEFAULT_CHART_CONFIG } from '../../utils/quickchartUtils';

interface CSVUploadProps {
  onDataLoad: (config: ChartConfig) => void;
}

export function CSVUpload({ onDataLoad }: CSVUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCSVData] = useState<ParsedCSVData | null>(() => {
    // 初期状態でサンプルデータをセット
    return {
      labels: DEFAULT_CHART_CONFIG.data.labels,
      values: (DEFAULT_CHART_CONFIG.data.datasets[0]?.data as number[]) || [],
    };
  });
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイル形式チェック
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('CSV ファイルのみアップロード可能です');
      setCSVData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await parseCSVFile(file);
      setCSVData(data);
      setError(null);
    } catch (err) {
      setError(
        err instanceof CSVParseError
          ? err.message
          : 'ファイルの解析に失敗しました'
      );
      setCSVData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyData = () => {
    if (!csvData) return;

    const config = createChartConfigFromCSV(
      csvData,
      '',
      'Value'
    );
    onDataLoad(config);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
        <label className="cursor-pointer">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <div className="text-sm text-gray-600">
              <p className="font-medium">CSV ファイルを選択</p>
              <p className="text-xs">またはドラッグ＆ドロップ</p>
            </div>
          </div>
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
          <p className="font-medium">エラー:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">ファイルを解析中...</p>
        </div>
      )}

      {/* Data Preview */}
      {csvData && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-800 font-medium">
              ✓ CSV ファイルが正常に読み込まれました
            </p>
          </div>

          {/* Preview Table */}
          <div className="border border-gray-300 rounded-lg">
            <button
              onClick={() => toggleSection('preview')}
              className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
            >
              <span className="font-semibold text-gray-700">
                データプレビュー
              </span>
              <span className="text-gray-500">
                {expandedSection === 'preview' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'preview' && (
              <div className="overflow-x-auto">
                <div className="px-4 py-3 border-t border-gray-300 bg-white">
                  {csvData.labels.length > 5 && (
                    <p className="text-xs text-gray-600 mb-3">
                      最初の5行を表示（全 {csvData.labels.length} 行）
                    </p>
                  )}
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          ラベル
                        </th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">
                          値
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvData.labels.slice(0, 5).map((label, index) => (
                        <tr
                          key={index}
                          className={
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }
                        >
                          <td className="px-4 py-2 text-gray-700">{label}</td>
                          <td className="px-4 py-2 text-gray-700">
                            {csvData.values[index]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Apply Data Button */}
          <button
            onClick={handleApplyData}
            className="w-full px-4 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition"
          >
            このデータを使用
          </button>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
            <p>
              CSV は以下の形式で使用されます：<br />
              1列目: ラベル（X軸）、2列目: 値（Y軸）
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

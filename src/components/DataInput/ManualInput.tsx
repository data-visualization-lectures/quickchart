import { useState } from 'react';
import { ChartConfig } from '../../types/chart';

interface ManualInputProps {
  chartConfig: ChartConfig;
  onChange: (config: ChartConfig) => void;
}

export function ManualInput({ chartConfig, onChange }: ManualInputProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('dataset-0');

  const updateChartConfig = (updates: Partial<ChartConfig>) => {
    onChange({
      ...chartConfig,
      ...updates,
    });
  };

  const updateDatasetLabel = (index: number, label: string) => {
    const newDatasets = [...chartConfig.data.datasets];
    newDatasets[index] = {
      ...newDatasets[index],
      label,
    };
    updateChartConfig({
      ...chartConfig,
      data: {
        ...chartConfig.data,
        datasets: newDatasets,
      },
    });
  };

  const updateDatasetData = (index: number, data: number[]) => {
    const newDatasets = [...chartConfig.data.datasets];
    newDatasets[index] = {
      ...newDatasets[index],
      data,
    };
    updateChartConfig({
      ...chartConfig,
      data: {
        ...chartConfig.data,
        datasets: newDatasets,
      },
    });
  };

  const updateLabels = (labels: string[]) => {
    updateChartConfig({
      ...chartConfig,
      data: {
        ...chartConfig.data,
        labels,
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
      {/* Datasets Section */}
      {chartConfig.data.datasets.map((dataset, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <button
            onClick={() => toggleSection(`dataset-${index}`)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <span className="font-semibold text-gray-700">
              データセット
            </span>
            <span className="text-gray-500">
              {expandedSection === `dataset-${index}` ? '−' : '+'}
            </span>
          </button>
          {expandedSection === `dataset-${index}` && (
            <div className="px-4 py-3 border-t border-gray-300 bg-white space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  系列
                </label>
                <input
                  type="text"
                  value={dataset.label}
                  onChange={(e) => updateDatasetLabel(index, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ラベル
                </label>
                <textarea
                  value={chartConfig.data.labels.join('\n')}
                  onChange={(e) =>
                    updateLabels(
                      e.target.value.split('\n').filter((l) => l.trim())
                    )
                  }
                  placeholder="ラベルを1行ずつ入力"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  データ
                </label>
                <textarea
                  value={dataset.data.join('\n')}
                  onChange={(e) =>
                    updateDatasetData(
                      index,
                      e.target.value
                        .split('\n')
                        .map((v) => parseFloat(v.trim()) || 0)
                        .filter((v) => !isNaN(v))
                    )
                  }
                  placeholder="データを1行ずつ入力"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Data Table Preview */}
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
              {chartConfig.data.labels.length > 5 && (
                <p className="text-xs text-gray-600 mb-3">
                  最初の5行を表示（全 {chartConfig.data.labels.length} 行）
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
                  {chartConfig.data.labels.slice(0, 5).map((label, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-2 text-gray-700">{label}</td>
                      <td className="px-4 py-2 text-gray-700">
                        {chartConfig.data.datasets[0]?.data[index] ?? '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

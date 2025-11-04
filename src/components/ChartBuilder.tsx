import { useState } from 'react';
import { ChartConfig } from '../types/chart';
import {
  CHART_TYPES,
  OUTPUT_FORMATS,
  CHART_JS_VERSIONS,
} from '../utils/quickchartUtils';

interface ChartBuilderProps {
  chartConfig: ChartConfig;
  onChange: (config: ChartConfig) => void;
  width: number;
  height: number;
  backgroundColor: string;
  format: string;
  version: string;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onFormatChange: (format: string) => void;
  onVersionChange: (version: string) => void;
}

export function ChartBuilder({
  chartConfig,
  onChange,
  width,
  height,
  backgroundColor,
  format,
  version,
  onWidthChange,
  onHeightChange,
  onBackgroundColorChange,
  onFormatChange,
  onVersionChange,
}: ChartBuilderProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('chartType');

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

  const updateChartTitle = (title: string) => {
    updateChartConfig({
      ...chartConfig,
      options: {
        ...chartConfig.options,
        plugins: {
          ...chartConfig.options?.plugins,
          title: {
            display: title.length > 0,
            text: title,
          },
        },
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        チャート設定
      </h2>

      {/* Chart Type Section */}
      <div className="border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection('chartType')}
          className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-700">チャートタイプ</span>
          <span className="text-gray-500">
            {expandedSection === 'chartType' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'chartType' && (
          <div className="px-4 py-3 border-t border-gray-300 bg-white">
            <select
              value={chartConfig.type}
              onChange={(e) =>
                updateChartConfig({ type: e.target.value as any })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CHART_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Chart Title Section */}
      <div className="border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection('title')}
          className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-700">タイトル</span>
          <span className="text-gray-500">
            {expandedSection === 'title' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'title' && (
          <div className="px-4 py-3 border-t border-gray-300 bg-white">
            <input
              type="text"
              value={chartConfig.options?.plugins?.title?.text || ''}
              onChange={(e) => updateChartTitle(e.target.value)}
              placeholder="チャートタイトルを入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Labels Section */}
      <div className="border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection('labels')}
          className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-700">ラベル</span>
          <span className="text-gray-500">
            {expandedSection === 'labels' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'labels' && (
          <div className="px-4 py-3 border-t border-gray-300 bg-white space-y-2">
            <textarea
              value={chartConfig.data.labels.join('\n')}
              onChange={(e) =>
                updateLabels(
                  e.target.value.split('\n').filter((l) => l.trim())
                )
              }
              placeholder="ラベルを1行ずつ入力"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        )}
      </div>

      {/* Datasets Section */}
      {chartConfig.data.datasets.map((dataset, index) => (
        <div key={index} className="border border-gray-300 rounded-lg">
          <button
            onClick={() => toggleSection(`dataset-${index}`)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
          >
            <span className="font-semibold text-gray-700">
              データセット {index + 1}
            </span>
            <span className="text-gray-500">
              {expandedSection === `dataset-${index}` ? '−' : '+'}
            </span>
          </button>
          {expandedSection === `dataset-${index}` && (
            <div className="px-4 py-3 border-t border-gray-300 bg-white space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ラベル
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
                  データ（カンマ区切り）
                </label>
                <textarea
                  value={dataset.data.join(', ')}
                  onChange={(e) =>
                    updateDatasetData(
                      index,
                      e.target.value
                        .split(',')
                        .map((v) => parseFloat(v.trim()) || 0)
                        .filter((v) => !isNaN(v))
                    )
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Visual Settings Section */}
      <div className="border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection('visual')}
          className="w-full px-4 py-3 flex justify-between items-center hover:bg-gray-50 transition"
        >
          <span className="font-semibold text-gray-700">ビジュアル設定</span>
          <span className="text-gray-500">
            {expandedSection === 'visual' ? '−' : '+'}
          </span>
        </button>
        {expandedSection === 'visual' && (
          <div className="px-4 py-3 border-t border-gray-300 bg-white space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                幅: {width}px
              </label>
              <input
                type="range"
                min="200"
                max="1200"
                step="50"
                value={width}
                onChange={(e) => onWidthChange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                高さ: {height}px
              </label>
              <input
                type="range"
                min="200"
                max="800"
                step="50"
                value={height}
                onChange={(e) => onHeightChange(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                背景色
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => onBackgroundColorChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出力形式
              </label>
              <select
                value={format}
                onChange={(e) => onFormatChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {OUTPUT_FORMATS.map((fmt) => (
                  <option key={fmt.value} value={fmt.value}>
                    {fmt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart.js バージョン
              </label>
              <select
                value={version}
                onChange={(e) => onVersionChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CHART_JS_VERSIONS.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

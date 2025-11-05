import { useState } from 'react';
import { ChartConfig } from '../../types/chart';
import {
  CHART_TYPES,
  CHART_JS_VERSIONS,
} from '../../utils/quickchartUtils';

interface CommonSettingsProps {
  chartConfig: ChartConfig;
  onChange: (config: ChartConfig) => void;
  width: number;
  height: number;
  backgroundColor: string;
  version: string;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  onBackgroundColorChange: (color: string) => void;
  onVersionChange: (version: string) => void;
}

export function CommonSettings({
  chartConfig,
  onChange,
  width,
  height,
  backgroundColor,
  version,
  onWidthChange,
  onHeightChange,
  onBackgroundColorChange,
  onVersionChange,
}: CommonSettingsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('chartType');

  const updateChartConfig = (updates: Partial<ChartConfig>) => {
    onChange({
      ...chartConfig,
      ...updates,
    });
  };

  const updateChartTitle = (title: string) => {
    updateChartConfig({
      ...chartConfig,
      options: {
        ...chartConfig.options,
        title: {
          display: title.length > 0,
          text: title,
        },
      },
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-4">
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
              value={chartConfig.options?.title?.text || ''}
              onChange={(e) => updateChartTitle(e.target.value)}
              placeholder="チャートタイトルを入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

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

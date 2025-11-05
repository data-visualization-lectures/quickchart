import { useState } from 'react';
import { ChartConfig } from '../types/chart';
import { ManualInput } from './DataInput/ManualInput';
import { CSVUpload } from './DataInput/CSVUpload';
import { CommonSettings } from './DataInput/CommonSettings';

interface ChartBuilderProps {
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

export function ChartBuilder({
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
}: ChartBuilderProps) {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');

  const handleCSVDataLoad = (config: ChartConfig) => {
    onChange(config);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Data Input Section */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          データの読み込み
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'manual'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            手入力
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-4 py-3 font-medium transition ${
              activeTab === 'csv'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            CSV アップロード
          </button>
        </div>

        {/* Data Input Tabs */}
        <div className="space-y-6">
          {activeTab === 'manual' && (
            <ManualInput
              chartConfig={chartConfig}
              onChange={onChange}
            />
          )}

          {activeTab === 'csv' && (
            <CSVUpload onDataLoad={handleCSVDataLoad} />
          )}
        </div>
      </div>

      {/* Common Settings */}
      <div className="border-t border-gray-300 pt-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          チャート設定
        </h2>
        <CommonSettings
          chartConfig={chartConfig}
          onChange={onChange}
          width={width}
          height={height}
          backgroundColor={backgroundColor}
          version={version}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
          onBackgroundColorChange={onBackgroundColorChange}
          onVersionChange={onVersionChange}
        />
      </div>
    </div>
  );
}

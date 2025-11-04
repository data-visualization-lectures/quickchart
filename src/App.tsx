import { useState } from 'react';
import { ChartConfig } from './types/chart';
import { DEFAULT_CHART_CONFIG } from './utils/quickchartUtils';
import { ChartBuilder } from './components/ChartBuilder';
import { Preview } from './components/Preview';

function App() {
  const [chartConfig, setChartConfig] = useState<ChartConfig>(DEFAULT_CHART_CONFIG);
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(300);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [format, setFormat] = useState('png');
  const [version, setVersion] = useState('2.9.4');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            QuickChart UI
          </h1>
          <p className="text-gray-600 text-sm md:text-base mt-1">
            Chart.js チャートを簡単に生成できるツール
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Chart Builder */}
          <div className="bg-white rounded-lg shadow-md">
            <ChartBuilder
              chartConfig={chartConfig}
              onChange={setChartConfig}
              width={width}
              height={height}
              backgroundColor={backgroundColor}
              format={format}
              version={version}
              onWidthChange={setWidth}
              onHeightChange={setHeight}
              onBackgroundColorChange={setBackgroundColor}
              onFormatChange={setFormat}
              onVersionChange={setVersion}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="bg-white rounded-lg shadow-md">
            <Preview
              chartConfig={chartConfig}
              width={width}
              height={height}
              backgroundColor={backgroundColor}
              format={format}
              version={version}
            />
          </div>
        </div>

        {/* Mobile stacked layout note */}
        <div className="lg:hidden mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <p>
            💡 上の設定パネルでチャートを編集すると、下のプレビューが自動更新されます。
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>
            Powered by{' '}
            <a
              href="https://quickchart.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              QuickChart
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

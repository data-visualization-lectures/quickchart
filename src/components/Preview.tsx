import { ChartConfig } from '../types/chart';
import { generateQuickChartUrl, copyToClipboard, downloadChartImage } from '../utils/quickchartUtils';
import { useState } from 'react';

interface PreviewProps {
  chartConfig: ChartConfig;
  width: number;
  height: number;
  backgroundColor: string;
  version: string;
}

export function Preview({
  chartConfig,
  width,
  height,
  backgroundColor,
  version,
}: PreviewProps) {
  const [copied, setCopied] = useState(false);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);

  const url = generateQuickChartUrl({
    chart: chartConfig,
    width,
    height,
    backgroundColor,
    format: 'png',
    version,
  });

  const imageUrl = url;

  const handleCopyUrl = async () => {
    try {
      await copyToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDownload = async (fmt?: string) => {
    const finalFormat = fmt || 'png';
    const downloadUrl = url.replace(/&f=\w+/, `&f=${finalFormat}`);
    setDownloadingFormat(finalFormat);
    try {
      downloadChartImage(downloadUrl, `chart.${finalFormat}`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800">
        プレビュー
      </h2>

      {/* Preview Image Container */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 flex justify-center items-center min-h-[300px]">
        <div className="flex flex-col items-center gap-2">
          <img
            src={imageUrl}
            alt="Chart Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              width: 'auto',
              height: 'auto',
            }}
            onError={() => (
              <div className="text-center text-gray-500">
                <p className="mb-2">チャートの読み込みに失敗しました</p>
                <p className="text-sm">設定を確認してください</p>
              </div>
            )}
          />
        </div>
      </div>

      {/* Download Options */}
      <div className="border border-gray-300 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">ダウンロード:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {['png', 'webp', 'jpg', 'svg', 'pdf'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleDownload(fmt)}
              disabled={downloadingFormat === fmt}
              className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                downloadingFormat === fmt
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {downloadingFormat === fmt ? '処理中...' : fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* URL Display & Copy */}
      <div className="border border-gray-300 rounded-lg p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">生成された URL:</p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={url}
            readOnly
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-xs font-mono overflow-x-auto text-gray-600"
          />
          <button
            onClick={handleCopyUrl}
            className={`px-4 py-2 rounded-md transition text-sm font-medium whitespace-nowrap ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {copied ? 'コピーしました' : 'コピー'}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p>
          このURL は直接ブラウザで開くか、Markdown や HTML に埋め込むことができます。
        </p>
      </div>
    </div>
  );
}

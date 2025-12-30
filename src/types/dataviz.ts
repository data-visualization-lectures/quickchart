/**
 * dataviz-auth-client.js リファクタリング対応
 * グローバルに公開されるSupabaseクライアントの型定義
 */

declare global {
    interface Window {
        /**
         * dataviz-auth-client.js によって公開されるSupabaseクライアント
         * リファクタリング後: window.supabase → window.datavizSupabase
         * 
         * Note: 型定義は @supabase/supabase-js をインストールすることで
         * より厳密な型チェックが可能になります
         */
        datavizSupabase?: any;

        /**
         * 後方互換性のため残されている可能性のある旧名称
         * @deprecated Use window.datavizSupabase instead
         */
        supabase?: any;
    }
}

export { };

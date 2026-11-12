# データ整形ラボ v2 — 静的Webツール収益化プロトタイプ

このパッケージは前回のCSV/JSONツールを拡張した**公開準備用ソース**です。**サイトの公開・広告契約・収益発生はまだ行っていません。**

## 実装済み

- CSV ⇄ JSON（引用符、セル内改行、BOM対応）、CSV/TSV、JSON整形・圧縮、URL値のエンコード/デコード
- コピー・ファイル読込・ダウンロード、スマホ対応、日本語使い方ガイド
- `config/offers.json` による **承認済みアフィリエイト広告** の表示（初期状態は非表示）
- 広告表示位置にPRラベル、広告リンクに `rel="nofollow sponsored noopener noreferrer"`
- `npm test` と `npm run check`、GitHub Actionsで週次テスト・簡易稼働確認・レポートを生成
- サーバーレスで運用できる構成。変換データを送信するAPIや外部解析タグは未設定

## ローカルで確認

```bash
cd auto_revenue_v2
python -m http.server 8000
# http://localhost:8000 を開く
```

※ `index.html` を直接開いても基本の変換機能は動きますが、ブラウザの制限により`config/offers.json`の読み込みはローカルサーバーが必要です。

テスト（Node.js 22+）：

```bash
npm test
npm run check
npm run report
npm run build
```

## Cloudflare Pagesで公開する手順（目安費用0円〜）

1. 必ず `about.html` と `privacy.html` の【公開前に】を実際の運営情報に修正。メールアドレスを掲載する場合は迷惑メール対策を検討する。
2. GitHubにリポジトリを作成し、このフォルダーの中身をリポジトリ直下にpushする。**公開リポジトリに秘密鍵や個人情報を含めない。**
3. Cloudflare PagesのGit連携でリポジトリを接続。フレームワークは `None`、Build commandは空欄、Build commandは `npm run build`、Output directoryは `dist` を指定。ビルド時に公開用ファイルのみコピーされます。
4. 公開URLで機能を確認。独自ドメインは任意（ドメイン取得費用がかかる場合あり）。`https://<公開ドメイン>/`をGoogle Search Consoleに登録し、必要に応じてサイトマップを生成する。
5. GitHubリポジトリの Settings > Secrets and variables > Actions > Variables から `SITE_URL` に公開URL（https）を登録。GitHub Actionsを有効にして週次チェックを確認。
6. 広告配信する際はA8.net等の審査・提携条件を確認。**承認済み案件の指定されたリンクURL**だけを `config/offers.json` に設定し、`enabled:true`にする。PR表示が適切か、運用規約上リンク加工が許可されるか必ず確認。

### 注意：GitHub Actionsの稼働確認

GitHub Actionsのスケジュールは時刻どおり実行されないことがあり、リポジトリの設定等によって停止することもあります。監視やレポートの作成はサイトへの訪問数・売上を収集するものではありません。異常時のメール通知はGitHubの通知設定に依存します。

## コスト（参考）

- 静的ホスティング: Cloudflare Pages無料枠内の利用を想定（契約前に最新条件を確認）
- CI/監視: GitHub Actionsの無料枠等を想定（上限に注意）
- 独自ドメイン: 任意（有料になる場合あり）
- 広告用の外部API、AI自動投稿、DBは**使用しません**

## 収益化計画

1. 最初は本当の利用価値がある変換ツールを充実させ、検索経由の流入を検証。
2. 利用者に合ったサービスが承認されたときだけ広告を表示する。広告の有無でツールの機能を制限しない。
3. 月間訪問者数・紹介リンクのクリック数・承認成果数を別途測定し、データに基づいて記事とツールを改善。
4. 収益が検証できるまで有料API、課金システム、広告費を導入しない。

**収益は未発生で、今後の成果は保証されません。収益の自動化と集客の自動化は別問題です。**

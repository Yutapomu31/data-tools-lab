# データ整形ラボ — 構築・公開・運用手順と作業履歴

> **更新日:** 2026-11-13（JST）  
> **運営者表示名:** Yutapomu31  
> **リポジトリ:** https://github.com/Yutapomu31/data-tools-lab  
> **本番URL:** https://data-tools-lab.porxmu-31al-78.workers.dev/  
> **現在の段階:** サイト公開・監視設定済み。Google Search Consoleでサイトマップの取得状態を調査中。収益化はこれから。  
>
> **記録方針:** [x] = 完了、[ ] = 未完了。ユーザーからの報告とGitHubで確認した事実を区別する。個人情報、認証トークン、メールのパスワードなどは書かない。

## 1. 全体の進捗チェックリスト

### 初期準備・公開
- [x] 配布ZIPのダウンロードと展開
- [x] GitHubアカウントを準備
- [x] Cloudflareアカウントを準備
- [x] GitHubリポジトリ `Yutapomu31/data-tools-lab` を作成
- [x] サイトのコードをGitHubに配置
- [x] ChatGPTとGitHubを連携し、対象リポジトリへのアクセスを許可
- [x] 運営者表示名を `Yutapomu31` に決定
- [x] 問い合わせメールを設定し、受信を確認
- [x] 運営者情報ページとプライバシーポリシーを整備（PR #1）
- [x] Cloudflare Workersのビルド・Preview設定を修正（PR #1）
- [x] Previewでトップ、運営者、プライバシー、CSV⇄JSON、JSON整形/圧縮、URLエンコード/デコードを確認
- [x] PR #1をレビュー・マージ
- [x] Cloudflare Production URLを有効化し、表示を確認（利用者報告）

### 自動監視
- [x] `.github/workflows/maintenance.yaml` を導入
- [x] GitHub Actionsの変数 `SITE_URL` にProduction URLを設定（利用者報告）
- [x] Actionsを手動実行して成功（GitHub実行履歴でも確認）
- [x] `weekly-report` のサイト稼働状況 `OK` を確認（利用者報告）
- [ ] 定期実行が翌週以降も継続することを確認
- [ ] 障害時に通知を受信できることを確認

### 検索エンジン
- [x] `sitemap.xml` を追加し、ビルド成果物に含める（PR #2）
- [x] `robots.txt` にSitemap URLを追加（PR #2）
- [x] Google Search Console用メタタグを `index.html` に追加（PR #3）
- [x] PR #2・#3をマージ
- [x] Search Consoleにサイトのプロパティを追加し、所有権確認
- [x] Search Consoleへ `sitemap.xml` を送信
- [x] ブラウザでサイトマップXMLを表示できることを確認
- [x] Search Consoleの公開URLライブテストが成功
- [ ] サイトマップの状態が「成功しました」になることを確認（現在「取得できませんでした／読み込めませんでした」、検出0ページ）
- [ ] トップページとガイドページのインデックス状況を確認
- [ ] 検索パフォーマンスの定期的な記録を開始

### 収益化
- [ ] ASP（例：A8.netなど）を比較・登録
- [ ] 収益受取先・必要情報を登録（外部サービス上で管理。リポジトリには保存しない）
- [ ] 提携候補の案件を検討・申請
- [ ] 承認された案件だけ広告設定に追加
- [ ] 広告表示・PR表示・提携規約・プライバシーポリシーを確認
- [ ] クリック数・成果・収益の振り返り方法を決定

## 2. システム構成と重要ファイル

| 対象 | 役割 |
| --- | --- |
| GitHub | ソース管理、PRレビュー、Actions |
| Cloudflare Workers | Webサイトの配信、Preview・Productionビルド |
| Google Search Console | 検索エンジンへの登録状態・検索結果の確認 |
| `index.html` | トップページ、Google所有権確認メタタグ |
| `about.html` | 運営者情報・問い合わせ窓口 |
| `privacy.html` | 個人情報・広告・解析に関する方針 |
| `guide.html` | 変換ツールの使用方法と制約 |
| `assets/app.mjs`, `assets/tools.mjs` | ブラウザ内での変換処理 |
| `config/offers.json` | 広告案件設定。初期状態では `enabled: false` |
| `robots.txt`, `sitemap.xml` | 検索エンジン向け設定 |
| `wrangler.jsonc` | Cloudflare Workerの静的ファイル配信とPreview設定 |
| `scripts/build.mjs` | 公開用ファイルを `dist/` に生成 |
| `scripts/check-site.mjs` | 必須ファイル・設定を検査 |
| `scripts/weekly-report.mjs` | `SITE_URL` のHTTP応答確認とレポート生成 |
| `.github/workflows/maintenance.yaml` | push・手動実行・週次の自動テストと監視 |

### ローカル確認の基本コマンド

Node.jsをインストール済みの環境でリポジトリ直下から実行する。

```bash
npm test
npm run check
npm run report
npm run build
```

`npm run report` は環境変数 `SITE_URL` を参照する。未設定なら稼働状況は「未設定」になる。GitHub Actionsではリポジトリ変数 `SITE_URL` を使用する。

## 3. 実施した主な作業手順

### 3-1. GitHubとCloudflareでサイトを公開

1. GitHubアカウントとCloudflareアカウントを用意。
2. GitHubに `Yutapomu31/data-tools-lab` を作成してサイトソースを配置。
3. Cloudflare WorkersへGitHubリポジトリを接続。
4. ビルドコマンドに `npm run build` を使用。公開用静的ファイルは `dist/` に生成。
5. `wrangler.jsonc` で `assets.directory` を `./dist` とし、Preview利用のため `previews: {}` を追加。
6. CloudflareのPreviewでページと変換機能を確認し、Productionドメインを有効化。
7. 本番URLで表示を確認。

**既往トラブル:** `npx wrangler preview` が `Your Wrangler configuration is missing a previews block` で失敗。PR #1で `wrangler.jsonc` を追加して解消。

### 3-2. 運営者情報とプライバシー

1. `about.html` の運営者名を `Yutapomu31` に設定。
2. 問い合わせアドレスをサイト上に設定。アドレスの送受信を確認。
3. `privacy.html` の収集・利用目的、ホスティング記録、広告・解析について記載。
4. Cloudflare Web Analyticsは未登録・無効、外部広告・解析サービスは未導入と確認。
5. Observabilityの有効・無効は未確認。独自ログ転送や解析を導入する場合は再検討。
6. PR #1のレビュー後にマージ。

**注意:** 公開リポジトリに載せたメールアドレスは公開情報になる。パスワード・APIキー・個人の秘密はコミットしない。

### 3-3. 週次監視の設定・結果確認

1. GitHubの **Settings → Secrets and variables → Actions → Variables** を開く。
2. Repository variableに `SITE_URL` を追加し、本番URLを設定。
3. **Actions → Weekly quality check and uptime report → Run workflow** を選び、`main` で実行。
4. 成功したワークフローの `weekly-report` artifactを確認。
5. レポートの `サイト稼働状況: OK` とHTTP応答を確認。

**自動実行:** `.github/workflows/maintenance.yaml` の `cron: '15 1 * * 1'` は原則 **毎週月曜10:15 JST**。GitHub Actionsのスケジュールは遅延や停止の可能性があるため、定期的に実行状況を確認する。

**監視範囲:** トップURLのHTTP応答とテスト。ブラウザ操作、全ページ、広告成果、検索流入、売上は監視対象外。

### 3-4. サイトマップとSearch Consoleの登録

1. PR #2で `sitemap.xml` を追加し、`robots.txt` にSitemapのURLを追加。
2. `scripts/build.mjs` に `sitemap.xml` を追加して `dist/` へコピー。
3. Search ConsoleでURLプレフィックスのプロパティ `https://data-tools-lab.porxmu-31al-78.workers.dev/` を登録。
4. 最初の「HTMLファイル」方式は、指定された確認ファイルが配信されておらず失敗。
5. Googleから発行された `google-site-verification` のHTMLメタタグをPR #3で `index.html` の `<head>` 内に追加し、マージ後に所有権を確認。**確認タグは削除しない。**
6. Search Consoleの **インデックス作成 → サイトマップ** から `sitemap.xml` を送信。
7. ブラウザで `https://data-tools-lab.porxmu-31al-78.workers.dev/sitemap.xml` を開き、XML表示を確認。
8. Search ConsoleのURL検査で該当URLを「公開URLをテスト」したところ、ライブテストは成功。

**未解決:** サイトマップ詳細は「サイトマップを読み込めませんでした」および検出ページ数0のまま（2026-11-12時点の画面）。ライブテスト成功は、サイトマップとしての正常な解析を意味しない。サイトマップXML自体にインデックス登録リクエストは不要。

## 4. 作業中・次に取り組むこと

### 最優先：サイトマップの取得状況

- [ ] Search Consoleの **サイトマップ → /sitemap.xml** でステータスと最終読み込み日時を再確認。
- [ ] 「成功しました」になれば検出ページ数を記録し、この項目を完了。
- [ ] 失敗が続く場合は、URLのHTTPステータス、`Content-Type`、リダイレクト、Cloudflareのアクセス制限・WAF・bot対策、Googleの取得時刻とエラーを確認。
- [ ] 必要な原因が特定できた場合に限り、GitHubで修正PRを作成。短時間での再送信の繰り返しは避ける。

### 検索流入の準備

- [ ] Search ConsoleのURL検査でトップページと `guide.html` を確認。
- [ ] 必要に応じてWebページに対して「インデックス登録をリクエスト」。
- [ ] 検索パフォーマンス画面の表示回数、クリック数、検索クエリを定期的に確認。
- [ ] CSV↔JSONの使用例、エラー対処例、URLエンコードの解説など、検索者の疑問に答えるコンテンツを増やす。

### ASP・広告の準備

- [ ] ASPの利用条件・審査要件を比較し、適切なものへ登録。
- [ ] 有用かつ承認済みの案件のみ `config/offers.json` へ追加。
- [ ] アフィリエイトリンクにPR表記と `rel="nofollow sponsored noopener noreferrer"` 等があるか確認。
- [ ] 広告タグ、Cookie、外部解析を追加する場合、公開前に `privacy.html` とCSP（`_headers`）を見直す。
- [ ] 実際の広告成果やアクセス状況に応じて改善。**収益は未保証**。

## 5. GitHubを使った変更の標準手順

今後は、原則以下の流れで改修・文書更新する。

1. 最新の `main` を確認し、変更目的と対象ファイルを明確化。
2. 作業用ブランチを新規作成。**`main` に直接コミットしない。**
3. 変更・テストを行い、GitHubへコミット・pushする。
4. PRを作成し、概要、変更点、確認結果、リスク、マージ前チェック項目を記載。
5. GitHub ActionsとCloudflare Previewの結果を確認。
6. 運営者がPRの差分と動作をレビューし、問題なければマージ。
7. Productionのデプロイ状態と公開ページを確認。
8. 本ファイルの進捗・履歴・未解決事項を更新する。

**例外:** 書き込み操作が利用できない場合は、差分や手順を提示し、未実施の操作を実施済みとは記載しない。

## 6. 作業履歴

| 日付（JST） | 作業 | 状態・参照 |
| --- | --- | --- |
| 2026-11-11〜12 | GitHub・Cloudflareでサイトを構築し、監視を設定 | 完了 |
| 2026-11-12 | 運営者ページ、プライバシー、Cloudflare Preview設定 | [PR #1](https://github.com/Yutapomu31/data-tools-lab/pull/1) マージ済み |
| 2026-11-12 | 本番URL有効化、監視変数設定、手動監視とレポート確認 | 完了（ユーザー報告、Actionsの成功履歴あり） |
| 2026-11-12 | XMLサイトマップとrobots.txtの整備 | [PR #2](https://github.com/Yutapomu31/data-tools-lab/pull/2) マージ済み |
| 2026-11-12 | Search Console所有権確認タグを追加 | [PR #3](https://github.com/Yutapomu31/data-tools-lab/pull/3) マージ済み |
| 2026-11-12 | Search Consoleサイトマップを送信、ブラウザ表示・ライブテスト成功 | Googleのサイトマップ読み込みは未解決 |
| 2026-11-13 | この運用記録を作成 | 文書用PR（マージ前） |

### 今後の追記テンプレート

新しい作業が完了したら、以下をコピーして下に追加する。関連するチェックリストも更新する。

```markdown
### YYYY-MM-DD: 作業名
- 目的:
- 実施内容:
- 対象ファイル・設定:
- 確認方法:
- 確認結果: 成功 / 失敗 / 未確認
- 関連PR・URL:
- 残課題:
- 次のアクション:
```

## 7. 注意事項と参照リンク

- [本番サイト](https://data-tools-lab.porxmu-31al-78.workers.dev/)
- [GitHubリポジトリ](https://github.com/Yutapomu31/data-tools-lab)
- [GitHub Actions](https://github.com/Yutapomu31/data-tools-lab/actions)
- [GitHub Actions Variables](https://github.com/Yutapomu31/data-tools-lab/settings/variables/actions)
- [Cloudflareダッシュボード](https://dash.cloudflare.com/)
- [Google Search Console](https://search.google.com/search-console)
- [サイトマップ](https://data-tools-lab.porxmu-31al-78.workers.dev/sitemap.xml)

**公開リポジトリの注意:** 認証トークン、パスワード、秘密鍵、銀行情報等はこの文書やGitの履歴に記録しない。設定を変更したら、サイトの説明・ポリシー・本書を実態に合わせて更新する。

# Research Workshop Data Template

GitHub Pagesで使える、HTMLとJSONデータを分離した研究会サイトです。

## 主なページ
- `index.html`: トップページ、最新3件のお知らせ、複数日プログラム、登壇者、実行委員
- `news.html`: お知らせ一覧
- `location.html`: 開催場所、住所、アクセス、地図
- `registration.html`: 参加登録、旅費支援、宿泊費支援
- `archive.html`: 開催記録一覧
- `archive-detail.html?id=...`: 過去回の詳細とプログラム
- `en/`: 英語版各ページ

## 主に編集するデータ
- `data/program.json`: `days` 配列に日を追加し、各日の `sessions` にプログラムを追加
- `data/location.json`: 会場・住所・アクセス
- `data/registration.json`: 登録条件と旅費・宿泊費支援
- `data/committee.json`: 実行委員名、所属、役割、ホームページURL
- `data/archive.json`: 過去回の概要と複数日プログラム。各回に一意の `id` を設定

## ローカル確認
JSONを `fetch()` するため、HTMLの直接ダブルクリックではなく、VS Code Live Server等のローカルサーバーを使用してください。

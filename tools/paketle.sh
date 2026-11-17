#!/bin/sh
# Yayın paketi: site/ klasörünün içeriğini hosting'e yüklemek için tek bir zip dosyası yapar.
# Kullanım:  sh tools/paketle.sh      ->  yayin/meira-site-YYYYMMDD.zip
#
# Paneldeki dosya yöneticisinde public_html içine yükleyip "Extract / Çıkart" deyin; dosyalar doğrudan
# public_html altına açılır (index.html, .htaccess, en/, api/ ...). Önce betiği çalıştırın:
# node tools/build.mjs (sayfalar ve önbellek sürümleri güncel olsun).
#
# Pakete girmeyenler: form kayıt dosyası (api/submissions.log), macOS ve düzenleyici artıkları.
set -e
cd "$(dirname "$0")/.."
mkdir -p yayin
OUT="yayin/meira-site-$(date +%Y%m%d).zip"
rm -f "$OUT"
(cd site && zip -rq -X "../$OUT" . \
  -x 'api/submissions.log' -x '*.DS_Store' -x '._*' -x '*.swp' -x '*~')
echo "Hazır: $OUT ($(du -h "$OUT" | cut -f1))"
echo "İçinde .htaccess: $(unzip -l "$OUT" | grep -c '\.htaccess$') dosya (kök ve en/)"

<?php
/**
 * Meira: teklif ve iletişim formu uç noktası.
 *
 * İstemci (components.js) JSON gönderir ve JSON yanıt bekler:
 *   başarı: { success: true, message, reference, mode: 'demo' | 'production' }
 *   hata:   { success: false, error }
 * JavaScript kapalıysa form düz POST olarak gelir; bu durumda sade bir HTML yanıt sayfası döner.
 *
 * Yayına alma:
 *   1. $TO_EMAIL ve $FROM_EMAIL değerlerini gerçek adreslerle değiştirin. $FROM_EMAIL, sitenin alan adında olmalı
 *      (SPF/DKIM için). [DOĞRULANACAK] Şu anki adresler yer tutucudur.
 *   2. $DEMO_MODE = false yapın. Demo modunda e-posta gönderilmez, yalnızca submissions.log'a satır yazılır.
 *   3. api/submissions.log dosyası web'den erişilemez olmalı (.htaccess bunu engeller; nginx için README).
 */

declare(strict_types=1);
date_default_timezone_set('Europe/Istanbul');

// ==========================================
// 1. AYARLAR
// ==========================================
$DEMO_MODE   = true;
$TO_EMAIL    = 'info@meira.com.tr';
$FROM_EMAIL  = 'noreply@meira.com.tr';
$BRAND_NAME  = 'Meira Türkiye';
$LOG_FILE    = __DIR__ . '/submissions.log';
$RATE_LIMIT  = 5;     // aynı IP'den en fazla bu kadar talep
$RATE_WINDOW = 600;   // ... bu kadar saniye içinde (10 dakika)

// Formdaki konu seçenekleriyle aynı olmalı (iletisim.html, #contactSubject)
$ALLOWED_SUBJECTS = [
    'Fiyat ve Numune Teklifi',
    'Toptan Satış & Bayilik',
    'Özel Markalı Üretim (OEM/ODM)',
    'Merkezi Klima (HVAC) Projelendirme',
    'Teknik Destek ve Servis',
];

// ==========================================
// 2. YANIT YARDIMCILARI
// ==========================================
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$wantsJson   = stripos($contentType, 'application/json') !== false
            || stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
header('Referrer-Policy: same-origin');

function h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** JSON (JS istemcisi) ya da sade HTML (JS kapalı) yanıt verir ve çıkar. */
function respond(bool $ok, int $status, array $payload): void
{
    global $wantsJson;
    http_response_code($status);
    if ($wantsJson) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['success' => $ok] + $payload, JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Content-Type: text/html; charset=UTF-8');
    $title = $ok ? 'Talebiniz alındı' : 'Talebiniz gönderilemedi';
    $body  = $ok
        ? 'Teklif talebiniz alındı. Referans numaranız: <strong>' . h($payload['reference'] ?? '-') . '</strong>'
        : h($payload['error'] ?? 'Bir hata oluştu.');
    echo '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
       . '<meta name="robots" content="noindex"><title>' . h($title) . '</title>'
       . '<style>body{margin:0;font:17px/1.7 system-ui,sans-serif;background:#F7F4EF;color:#141C27;display:grid;place-items:center;min-height:100vh}'
       . 'main{max-width:36rem;padding:2rem}h1{font:400 2rem/1.2 Georgia,serif;margin:0 0 1rem}a{color:#141C27}</style></head>'
       . '<body><main><h1>' . h($title) . '</h1><p>' . $body . '</p><p><a href="../iletisim.html">İletişim sayfasına dön</a></p></main></body></html>';
    exit;
}

/** Başlık ve log satırları için: satır sonlarını ve kontrol karakterlerini kaldırır. */
function oneLine(string $s, int $max): string
{
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    $s = trim(preg_replace('/\s+/u', ' ', $s) ?? '');
    return mb_substr($s, 0, $max, 'UTF-8');
}

/** E-posta başlığı için UTF-8 kodlama (RFC 2047). */
function encodeHeader(string $s): string
{
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

// ==========================================
// 3. İSTEK KONTROLLERİ
// ==========================================
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(false, 405, ['error' => 'Geçersiz istek türü (POST gereklidir).']);
}

$raw = file_get_contents('php://input', false, null, 0, 64 * 1024) ?: '';
$data = [];
if ($raw !== '' && stripos($contentType, 'application/json') !== false) {
    $json = json_decode($raw, true);
    if (is_array($json)) {
        $data = $json;
    }
}
if (!$data) {
    $data = $_POST;
}

// Honeypot: botlar gizli alanı doldurur; sessizce başarılı görünür
if (!empty($data['hp_company_website'])) {
    respond(true, 200, ['message' => 'Talebiniz alındı.', 'reference' => '-', 'mode' => $DEMO_MODE ? 'demo' : 'production']);
}

// Hız sınırı: IP'nin kendisi değil, özeti tutulur; dosya web kökünün dışında (sistem geçici klasörü)
$ip     = $_SERVER['REMOTE_ADDR'] ?? 'bilinmiyor';
$ipKey  = hash('sha256', $ip . '|meira');
$rlFile = sys_get_temp_dir() . '/meira-quote-ratelimit.json';
$now    = time();
$fh = @fopen($rlFile, 'c+');
if ($fh && flock($fh, LOCK_EX)) {
    $rl = json_decode(stream_get_contents($fh) ?: '{}', true) ?: [];
    foreach ($rl as $k => $times) {
        $rl[$k] = array_values(array_filter((array) $times, fn($t) => $t > $now - $RATE_WINDOW));
        if (!$rl[$k]) unset($rl[$k]);
    }
    if (count($rl[$ipKey] ?? []) >= $RATE_LIMIT) {
        flock($fh, LOCK_UN);
        fclose($fh);
        respond(false, 429, ['error' => 'Kısa sürede çok sayıda talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.']);
    }
    $rl[$ipKey][] = $now;
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($rl));
    flock($fh, LOCK_UN);
    fclose($fh);
}

// ==========================================
// 4. ALANLAR VE DOĞRULAMA
// ==========================================
$name    = oneLine((string) ($data['name'] ?? ''), 120);
$email   = oneLine((string) ($data['email'] ?? ''), 254);
$phone   = oneLine((string) ($data['phone'] ?? ''), 40);
$company = oneLine((string) ($data['company'] ?? ''), 160);
$subject = oneLine((string) ($data['subject'] ?? ''), 120);
$message = trim(mb_substr(str_replace("\r\n", "\n", (string) ($data['message'] ?? '')), 0, 6000, 'UTF-8'));

if (!in_array($subject, $ALLOWED_SUBJECTS, true)) {
    $subject = 'Teklif Talebi';
}

if ($name === '' || $email === '' || $message === '') {
    respond(false, 400, ['error' => 'Lütfen zorunlu alanları (ad soyad, e-posta, mesaj) doldurun.']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 400, ['error' => 'Lütfen geçerli bir e-posta adresi girin.']);
}
if ($phone !== '' && !preg_match('/^[0-9+()\s.\-]{6,40}$/', $phone)) {
    $phone = ''; // geçersiz telefon gönderimi engellemez, yalnızca kullanılmaz
}

$refNo     = 'MR-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3)));
$timestamp = date('d.m.Y H:i');

// ==========================================
// 5. E-POSTA
// ==========================================
$mailSubject = "[$BRAND_NAME] $subject - $refNo";

$rows = [
    ['Referans', h($refNo)],
    ['Tarih', h($timestamp)],
    ['Ad soyad', h($name)],
    ['E-posta', '<a href="mailto:' . h($email) . '" style="color:#141C27;">' . h($email) . '</a>'],
    ['Telefon', $phone !== '' ? h($phone) : '-'],
    ['Firma', $company !== '' ? h($company) : '-'],
    ['Konu', h($subject)],
    ['IP', h($ip)],
];
$rowsHtml = '';
foreach ($rows as [$label, $value]) {
    $rowsHtml .= '<tr><td style="padding:6px 0;color:#5C6573;width:120px;vertical-align:top;">' . $label . '</td><td style="padding:6px 0;">' . $value . '</td></tr>';
}

$htmlContent = '<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"></head>'
    . '<body style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#F7F4EF;color:#141C27;padding:24px;margin:0;">'
    . '<div style="max-width:620px;margin:0 auto;background:#FCFBF8;border:1px solid #E1D9CB;">'
    . '<div style="background:#141C27;padding:20px 24px;color:#F4EFE6;">'
    . '<div style="font-family:Georgia,serif;font-size:20px;letter-spacing:0.2em;">MEIRA</div>'
    . '<div style="margin-top:4px;font-size:12px;color:#C3C8D0;">Web sitesi teklif ve iletişim talebi</div></div>'
    . '<div style="padding:24px;"><table style="width:100%;border-collapse:collapse;font-size:14px;">' . $rowsHtml . '</table>'
    . '<div style="margin-top:20px;padding:16px;background:#F7F4EF;border:1px solid #E1D9CB;">'
    . '<div style="font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#5C6573;margin-bottom:8px;">Mesaj ve teklif listesi</div>'
    . '<pre style="margin:0;white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.6;">' . h($message) . '</pre></div></div>'
    . '<div style="padding:12px 24px;font-size:11px;color:#5C6573;text-align:center;">Bu e-posta ' . h($BRAND_NAME) . ' web sitesi teklif formundan iletilmiştir.</div>'
    . '</div></body></html>';

$mailSent = true;
if (!$DEMO_MODE) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'From: ' . encodeHeader($BRAND_NAME) . ' <' . $FROM_EMAIL . '>',
        'Reply-To: ' . encodeHeader($name) . ' <' . $email . '>',
    ];
    $mailSent = @mail($TO_EMAIL, encodeHeader($mailSubject), $htmlContent, implode("\r\n", $headers), '-f' . $FROM_EMAIL);
}

// ==========================================
// 6. KAYIT (tek satır; kişisel veri saklama süresi için bkz. gizlilik.html)
// ==========================================
$logEntry = '[' . date('Y-m-d H:i:s') . '] REF: ' . $refNo
    . ' | KİŞİ: ' . $name . ' <' . $email . '>'
    . ' | TEL: ' . ($phone ?: '-')
    . ' | FİRMA: ' . ($company ?: '-')
    . ' | KONU: ' . $subject
    . ' | GÖNDERİM: ' . ($DEMO_MODE ? 'demo' : ($mailSent ? 'ok' : 'hata')) . "\n";
@file_put_contents($LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);

if ($mailSent) {
    respond(true, 200, [
        'message'   => 'Teklif talebiniz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.',
        'reference' => $refNo,
        'mode'      => $DEMO_MODE ? 'demo' : 'production',
    ]);
}

respond(false, 500, ['error' => 'E-posta gönderilirken bir sunucu hatası oluştu. Lütfen doğrudan ' . $TO_EMAIL . ' adresine yazın.']);

<?php
/**
 * DummyCosmetics – Kurumsal İletişim ve Teklif Formu API Endpoint'i
 * Hosting ortamında info@dummycosmetics.com.tr adresine bildirim gönderir.
 * 
 * Gerçek sunucuya taşındığında aşağıdaki AYARLAR bölümünden
 * $DEMO_MODE değerini false yapmanız yeterlidir.
 */

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

// ==========================================
// 1. AYARLAR (İleride gerçek sunucuya göre düzenleyin)
// ==========================================
$DEMO_MODE   = true; // Test/Demo modunda mailler yerel log dosyasına kaydedilir ve başarılı yanıt döner.
$TO_EMAIL    = 'info@dummycosmetics.com.tr';
$FROM_EMAIL  = 'noreply@dummycosmetics.com.tr';
$BRAND_NAME  = 'DummyCosmetics Türkiye';
$LOG_FILE    = __DIR__ . '/submissions.log';

// Sadece POST isteklerine izin ver
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Geçersiz istek türü (POST gereklidir).']);
    exit;
}

// Girdi verilerini topla (JSON veya form-data)
$rawInput = file_get_contents('php://input');
$data = [];
if (!empty($rawInput)) {
    $json = json_decode($rawInput, true);
    if (is_array($json)) {
        $data = $json;
    }
}
if (empty($data)) {
    $data = $_POST;
}

// Anti-Spam: Honeypot kontrolü (botlar gizli alanı doldurur)
if (!empty($data['hp_company_website'])) {
    // Bot yakalandı; sessizce başarılı dön
    echo json_encode(['success' => true, 'message' => 'Talebiniz alındı.']);
    exit;
}

// Alanları temizle
$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$phone   = trim($data['phone'] ?? '');
$company = trim($data['company'] ?? '');
$subject = trim($data['subject'] ?? 'Teklif Talebi');
$message = trim($data['message'] ?? '');
$items   = $data['items'] ?? [];

// Doğrulama
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Lütfen zorunlu alanları (Ad Soyad, E-posta, Mesaj) doldurun.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Lütfen geçerli bir e-posta adresi girin.']);
    exit;
}

$refNo = 'DC-' . date('Ymd') . '-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
$timestamp = date('d.m.Y H:i:s');

// E-posta İçeriği Hazırla
$mailSubject = "[$BRAND_NAME] $subject - $refNo";

$plainContent = "DUMMYCOSMETICS WEB SİTESİ TEKLİF & İLETİŞİM TALEBİ\n";
$plainContent .= "====================================================\n";
$plainContent .= "Referans No : $refNo\n";
$plainContent .= "Tarih        : $timestamp\n";
$plainContent .= "Ad Soyad     : $name\n";
$plainContent .= "E-posta      : $email\n";
$plainContent .= "Telefon      : " . ($phone ?: '-') . "\n";
$plainContent .= "Firma        : " . ($company ?: '-') . "\n";
$plainContent .= "Konu         : $subject\n";
$plainContent .= "----------------------------------------------------\n";
$plainContent .= "MESAJ İÇERİĞİ VE TEKLİF EDİLEN ÜRÜNLER:\n\n";
$plainContent .= $message . "\n";
$plainContent .= "====================================================\n";
$plainContent .= "İstemci IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Bilinmiyor') . "\n";

// HTML E-posta Gövdesi
$htmlContent = "
<!DOCTYPE html>
<html>
<head><meta charset='UTF-8'></head>
<body style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#f4f4f5;color:#18181b;padding:24px;margin:0;'>
  <div style='max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:12px;overflow:hidden;'>
    <div style='background:#1e1b18;padding:20px 24px;color:#f7f5f0;'>
      <h2 style='margin:0;font-size:18px;font-weight:600;letter-spacing:-0.02em;'>$BRAND_NAME</h2>
      <p style='margin:4px 0 0;font-size:12px;color:#b2aba2;'>Web Sitesi Teklif & İletişim Bildirimi · Ref: $refNo</p>
    </div>
    <div style='padding:24px;'>
      <table style='width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;'>
        <tr><td style='padding:6px 0;color:#71717a;width:120px;'>Tarih:</td><td style='font-weight:500;'>$timestamp</td></tr>
        <tr><td style='padding:6px 0;color:#71717a;'>Gönderen:</td><td style='font-weight:600;'>$name</td></tr>
        <tr><td style='padding:6px 0;color:#71717a;'>E-posta:</td><td><a href='mailto:$email' style='color:#1e1b18;'>$email</a></td></tr>
        <tr><td style='padding:6px 0;color:#71717a;'>Telefon:</td><td>" . ($phone ? "<a href='tel:$phone' style='color:#1e1b18;'>$phone</a>" : "-") . "</td></tr>
        <tr><td style='padding:6px 0;color:#71717a;'>Firma:</td><td>" . htmlspecialchars($company ?: '-') . "</td></tr>
        <tr><td style='padding:6px 0;color:#71717a;'>Konu:</td><td style='font-weight:500;'>" . htmlspecialchars($subject) . "</td></tr>
      </table>
      <div style='background:#fafafa;border:1px solid #e4e4e7;border-radius:8px;padding:16px;margin-top:16px;'>
        <div style='font-size:11px;text-transform:uppercase;letter-spacing:0.06em;color:#71717a;margin-bottom:8px;font-weight:600;'>Talep & Ürün Detayları</div>
        <pre style='margin:0;white-space:pre-wrap;font-family:inherit;font-size:13px;line-height:1.6;color:#18181b;'>" . htmlspecialchars($message) . "</pre>
      </div>
    </div>
    <div style='background:#f4f4f5;padding:12px 24px;font-size:11px;color:#a1a1aa;text-align:center;'>
      Bu e-posta DummyCosmetics web sitesi teklif formundan iletilmiştir.
    </div>
  </div>
</body>
</html>";

$mailSent = false;

if (!$DEMO_MODE) {
    // Gerçek Gönderim: PHP mail() fonksiyonu
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'From: ' . $BRAND_NAME . ' <' . $FROM_EMAIL . '>',
        'Reply-To: ' . $name . ' <' . $email . '>',
        'X-Mailer: PHP/' . phpversion()
    ];
    $mailSent = @mail($TO_EMAIL, $mailSubject, $htmlContent, implode("\r\n", $headers));
} else {
    // Demo Modu: Başarılı say ve yerel loga yaz
    $mailSent = true;
}

// Log kaydı oluştur
$logEntry = "[" . date('Y-m-d H:i:s') . "] REF: $refNo | KIM: $name <$email> | TEL: $phone | FIRMA: $company | KONU: $subject | DEMO: " . ($DEMO_MODE ? 'EVET' : 'HAYIR') . "\n";
@file_put_contents($LOG_FILE, $logEntry, FILE_APPEND | LOCK_EX);

if ($mailSent) {
    echo json_encode([
        'success'   => true,
        'message'   => 'Teklif talebiniz başarıyla alındı. Satış ve teknik ekibimiz en kısa sürede sizinle iletişime geçecektir.',
        'reference' => $refNo,
        'mode'      => $DEMO_MODE ? 'demo' : 'production'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => 'E-posta gönderilirken bir sunucu hatası oluştu. Lütfen doğrudan info@dummycosmetics.com.tr adresine yazınız.'
    ]);
}

<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/libs/PHPMailer/Exception.php';
require __DIR__ . '/libs/PHPMailer/PHPMailer.php';
require __DIR__ . '/libs/PHPMailer/SMTP.php';

// Always return JSON with UTF-8 charset
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "Method not allowed"]);
  exit;
}

// Grab form fields
// Basic sanitization and trimming
$name     = trim($_POST['name'] ?? '');
$email    = trim($_POST['email'] ?? '');
$phone    = trim($_POST['phone'] ?? '');
$artist   = trim($_POST['artist'] ?? '');
$message  = trim($_POST['message'] ?? '');
$referrer = trim($_POST['referrer'] ?? '');

// Validate required fields and email format
if (!$name || !$email || !$message) {
  http_response_code(400);
  echo json_encode(["error" => "Missing required fields"]);
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(["error" => "Invalid email address"]);
  exit;
}

// Map artist slugs to inboxes
$artistEmails = [
  "austin-stirling" => "austinstirling@catharsisba.com",
  "chris-summers"   => "thesumofc@catharsisba.com",
];

// Always send to main inbox
$mainInbox = "info@catharsisba.com";

// Pull SMTP login from environment
$smtpUser = getenv("SMTP_USER") ?: $mainInbox;
$smtpPass = getenv("SMTP_PASS") ?: '';

// Friendly display value for artist
$artistDisplay = $artist ?: 'Not specified';

$mail = new PHPMailer(true);

try {
  // SMTP setup (Hostinger)
  $mail->isSMTP();
  $mail->Host       = 'smtp.hostinger.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = $smtpUser;
  $mail->Password   = $smtpPass;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  // Sender info
  $mail->setFrom($smtpUser, "Catharsis Body Art Website");
  $mail->addReplyTo($email, $name);

  // Recipients
  $mail->addAddress($mainInbox); // always studio inbox
  if ($artist && isset($artistEmails[$artist])) {
    $mail->addAddress($artistEmails[$artist]); // also send to artist
  }

  // Email content to studio
  $mail->isHTML(true);
  $mail->Subject = "New contact form submission from $name";
  $mail->Body    = "
    <h3>New Website Inquiry</h3>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Phone:</strong> {$phone}</p>
    <p><strong>Artist:</strong> {$artistDisplay}</p>
    <p><strong>Message:</strong><br/>" . nl2br(htmlspecialchars($message)) . "</p>
    <hr/>
    <p><strong>Referrer:</strong> {$referrer}</p>
  ";
  $mail->AltBody =
    "Name: $name\n" .
    "Email: $email\n" .
    "Phone: $phone\n" .
    "Artist: " . ($artist ?: "Not specified") . "\n\n" .
    "Message:\n$message\n\n" .
    "Referrer: $referrer";

  $mail->send();

  // 🔔 Confirmation email to client
  $confirm = new PHPMailer(true);
  $confirm->isSMTP();
  $confirm->Host       = 'smtp.hostinger.com';
  $confirm->SMTPAuth   = true;
  $confirm->Username   = $smtpUser;
  $confirm->Password   = $smtpPass;
  $confirm->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $confirm->Port       = 587;

  $confirm->setFrom($mainInbox, "Catharsis Body Art");
  $confirm->addAddress($email, $name);
  $confirm->isHTML(true);
  $confirm->Subject = "We received your message, {$name}";
  $confirm->Body    = "
    <p>Hi {$name},</p>
    <p>Thanks for reaching out to <strong>Catharsis Body Art</strong>. We’ve received your inquiry and will reply soon.</p>

    <h4>Your submission:</h4>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Phone:</strong> {$phone}</p>
    <p><strong>Artist:</strong> {$artistDisplay}</p>
    <p><strong>Message:</strong><br/>" . nl2br(htmlspecialchars($message)) . "</p>

    <hr/>
    <p><em>This is an automated confirmation — please do not reply to this email.</em></p>
    <p>Submitted on: " . date("F j, Y, g:i a") . "</p>
    <p>Studio Address: 5801 N. Green St. Suite 106, Brownsburg, IN 46112</p>
    <p>Phone: (317) 286-7092</p>
  ";
  $confirm->AltBody =
    "Hi {$name},\n\n" .
    "Thanks for reaching out to Catharsis Body Art. We’ve received your inquiry and will reply soon.\n\n" .
    "Your submission:\n" .
    "Name: $name\n" .
    "Email: $email\n" .
    "Phone: $phone\n" .
    "Artist: " . ($artist ?: "Not specified") . "\n\n" .
    "Message:\n$message\n\n" .
    "Submitted on: " . date("F j, Y, g:i a") . "\n" .
    "Studio: 5801 N. Green St. Suite 106, Brownsburg, IN 46112\n" .
    "Phone: (317) 286-7092";

  $confirm->send();

  echo json_encode(["success" => true, "message" => "Message sent"]);
} catch (Exception $e) {
  // Log the exception message server-side (if writable) but don't expose sensitive info in response
  error_log("Lead form mailer error: " . $e->getMessage());
  http_response_code(500);
  $userMessage = "Mailer Error: an internal error occurred while sending the message.";
  echo json_encode(["error" => $userMessage]);
}

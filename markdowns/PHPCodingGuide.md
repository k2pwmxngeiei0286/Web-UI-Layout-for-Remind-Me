# Modern PHP 8+ Architecture & Security Guide
### คู่มือสถาปัตยกรรมและการเขียน PHP ยุคใหม่ (PHP 8.x+)

> [!NOTE]
> - **หมวดหมู่ (Category):** Backend & Web Development
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** PHP 8.x, PSR-4 Autoloading, OWASP Top 10 Defense, Strict Typing, PDO Prepared Statements
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 แนวทางปฏิบัติที่ดีที่สุดสำหรับ Modern PHP: Strict Types, Input Filtering, XSS Escaping, PDO Prepared Statements, Password Hashing, Session Security, PSR-4 Clean Architecture และ Logic/Template Separation
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Strict Types and Return Types (การบังคับใช้ strict_types และ Type Declarations)](#หัวข้อที่-1-strict-types-and-return-types-การบังคับใช้-strict_types-และ-type-declarations)
2. [หัวข้อที่ 2: Input Validation and Filtering (การตรวจสอบและกรองข้อมูลอินพุตด้วย filter_input)](#หัวข้อที่-2-input-validation-and-filtering-การตรวจสอบและกรองข้อมูลอินพุตด้วย-filter_input)
3. [หัวข้อที่ 3: Output Escaping for XSS (การทำ Escaping ป้องกัน Cross-Site Scripting ด้วย htmlspecialchars)](#หัวข้อที่-3-output-escaping-for-xss-การทำ-escaping-ป้องกัน-cross-site-scripting-ด้วย-htmlspecialchars)
4. [หัวข้อที่ 4: PDO Prepared Statements (การป้องกัน SQL Injection ด้วย Parameter Binding)](#หัวข้อที่-4-pdo-prepared-statements-การป้องกัน-sql-injection-ด้วย-parameter-binding)
5. [หัวข้อที่ 5: Password Hashing and Verification (การจัดการรหัสผ่านด้วย password_hash และ password_verify)](#หัวข้อที่-5-password-hashing-and-verification-การจัดการรหัสผ่านด้วย-password_hash-และ-password_verify)
6. [หัวข้อที่ 6: Session Handling and Cookies (การตั้งค่า Session Cookie ปลอดภัยและการหมุนเวียน Session ID)](#หัวข้อที่-6-session-handling-and-cookies-การตั้งค่า-session-cookie-ปลอดภัยและการหมุนเวียน-session-id)
7. [หัวข้อที่ 7: Error Handling and Exceptions (การจัดการ Exception ที่ขอบเขตหน้าบ้านและระบบ Log ปลอดภัย)](#หัวข้อที่-7-error-handling-and-exceptions-การจัดการ-exception-ที่ขอบเขตหน้าบ้านและระบบ-log-ปลอดภัย)
8. [หัวข้อที่ 8: Autoloading and Namespaces (การจัดโครงสร้าง PSR-4 และ Constructor Injection)](#หัวข้อที่-8-autoloading-and-namespaces-การจัดโครงสร้าง-psr-4-และ-constructor-injection)
9. [หัวข้อที่ 9: Configuration and Secrets (การโหลดความลับผ่าน Environment และ Fail-Fast Architecture)](#หัวข้อที่-9-configuration-and-secrets-การโหลดความลับผ่าน-environment-และ-fail-fast-architecture)
10. [หัวข้อที่ 10: Separating Logic from Templates (การแยก Business Logic ออกจาก Presentation Layer)](#หัวข้อที่-10-separating-logic-from-templates-การแยก-business-logic-ออกจาก-presentation-layer)

---

## หัวข้อที่ 1: Strict Types and Return Types (การบังคับใช้ strict_types และ Type Declarations)

- **สรุปสาระสำคัญ:** การกำหนดข้อตกลงชนิดข้อมูลแบบเข้มงวดด้วย `declare(strict_types=1)` รวมถึงการระบุ scalar types และ return types ให้กับพารามิเตอร์และฟังก์ชันอย่างชัดเจนที่ขอบเขตการทำงาน เพื่อหลีกเลี่ยงข้อผิดพลาดจากการแปลงชนิดข้อมูลอัตโนมัติ (type coercion)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** โค้ดที่ไม่มีการกำหนดชนิดข้อมูลของพารามิเตอร์และผลลัพธ์ และรับค่าจาก superglobal (`$_POST`) มาคำนวณโดยตรง ปล่อยให้ PHP ทำการแปลงชนิดข้อมูลอัตโนมัติ ทำให้ผู้รีวิวโค้ดไม่สามารถระบุได้ว่าค่าสตริง ค่าทศนิยม ค่าติดลบ หรือค่าที่ขาดหายไปนั้นถูกต้องหรือไม่
- **ตัวอย่างโค้ด:**

```php
<?php
// invoice.php
// Untyped request values let PHP coerce strings during math.
function invoiceTotal($subtotal, $tax)
{
    return $subtotal + $tax;
}
echo invoiceTotal($_POST['subtotal'], $_POST['tax']);
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การประกาศ `declare(strict_types=1)` ร่วมกับการกำหนดชนิดข้อมูลพารามิเตอร์และ return type เป็น `int` ชัดเจน พร้อมตรวจสอบความถูกต้องของอินพุตก่อนประมวลผล เพื่อป้องกันไม่ให้ข้อมูลแปลงชนิดผิดพลาดที่ขอบเขตฟังก์ชัน
- **ตัวอย่างโค้ด:**

```php
<?php
// src/Billing/InvoiceTotal.php
declare(strict_types=1);

// Strict types make cents stay integers at the function boundary.
function invoiceTotalCents(int $subtotalCents, int $taxCents): int
{
    if ($subtotalCents < 0 || $taxCents < 0) {
        throw new InvalidArgumentException('Invoice amounts must be positive.');
    }
    return $subtotalCents + $taxCents;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การกำหนดข้อตกลงชนิดข้อมูลแบบเข้มงวดด้วย `declare(strict_types=1)` รวมถึงการระบุ scalar types และ return types ให้กับพารามิเตอร์และฟังก์ชันอย่างชัดเจนที่ขอบเขตการทำงาน เพื่อหลีกเลี่ยงข้อผิดพลาดจากการแปลงชนิดข้อมูลอัตโนมัติ (type coercion)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Input Validation and Filtering (การตรวจสอบและกรองข้อมูลอินพุตด้วย filter_input)

- **สรุปสาระสำคัญ:** การตรวจสอบและปรับมาตรฐานข้อมูลอินพุต (Validation & Normalization) จากคำขอของผู้ใช้ตั้งแต่ขอบเขตภายนอก (boundary) ก่อนจะส่งต่อข้อมูลไปยังคิวรี โดเมนโลจิก หรือเทมเพลต

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การดึงข้อมูลดิบจาก superglobal เช่น `$_GET` มาใช้งานโดยตรงโดยไม่ตรวจสอบชนิดข้อมูล ทำให้โค้ดปะปนกรณีข้อมูลขาดหาย ข้อมูลไม่ถูกต้อง หรือค่าว่างเข้าด้วยกัน และส่งผ่านค่าที่ไม่ปลอดภัยลึกลงไปในแอปพลิเคชัน
- **ตัวอย่างโค้ด:**

```php
<?php
// public/orders.php
// Raw $_GET values mix missing, invalid, and empty cases.
$orderId = $_GET['order_id'];
if (!$orderId) {
    echo 'Missing order id';
}
$order = $orders->findById($orderId);
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การใช้ฟังก์ชันกรองข้อมูลเช่น `filter_input` เพื่อตรวจสอบความถูกต้องของอินพุตว่าเป็นจำนวนเต็มบวก หากข้อมูลไม่ถูกต้องให้หยุดทำงานทันทีพร้อมส่ง HTTP Response Status Code 400 เพื่อให้โค้ดส่วนอื่นได้รับเฉพาะข้อมูลที่ถูกต้อง
- **ตัวอย่างโค้ด:**

```php
<?php
// public/orders.php
declare(strict_types=1);

// Validate and normalize the boundary value before using it.
$orderId = filter_input(
    INPUT_GET,
    'order_id',
    FILTER_VALIDATE_INT,
    ['options' => ['min_range' => 1]]
);

if ($orderId === false || $orderId === null) {
    http_response_code(400);
    echo 'Invalid order id';
    return;
}

$order = $orders->findById($orderId);
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การตรวจสอบและปรับมาตรฐานข้อมูลอินพุต (Validation & Normalization) จากคำขอของผู้ใช้ตั้งแต่ขอบเขตภายนอก (boundary) ก่อนจะส่งต่อข้อมูลไปยังคิวรี โดเมนโลจิก หรือเทมเพลต

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Output Escaping for XSS (การทำ Escaping ป้องกัน Cross-Site Scripting ด้วย htmlspecialchars)

- **สรุปสาระสำคัญ:** การแปลงตัวอักษรพิเศษ (Escaping) ข้อมูลที่ไม่น่าไว้วางใจก่อนนำไปแสดงผลในหน้า HTML เพื่อป้องกันไม่ให้ข้อมูลของผู้ใช้กลายเป็นมาร์กอัปหรือสคริปต์อันตราย (XSS)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การส่งออกข้อมูลจากฐานข้อมูลหรือตัวแปร superglobal เช่น `$_GET` ไปยังเทมเพลตโดยตรง ทำให้เบราว์เซอร์ประมวลผลข้อความเหล่านั้นเป็นโค้ด HTML หรือ JavaScript หากข้อมูลนั้นมีแท็กสคริปต์ซ่อนอยู่
- **ตัวอย่างโค้ด:**

```php
<?php
// templates/profile.php
// Direct output treats user content as trusted HTML.
?>
<h1><?= $user['name'] ?></h1>
<p><?= $_GET['bio'] ?></p>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การใช้ฟังก์ชัน Helper สำหรับทำการ Escape เช่น `htmlspecialchars` พร้อมตั้งค่า `ENT_QUOTES | ENT_SUBSTITUTE` และการเข้ารหัส `UTF-8` ช่วยแปลงอักขระพิเศษในข้อความให้เป็นเอนทิตีที่ปลอดภัยก่อนแสดงผลลง HTML
- **ตัวอย่างโค้ด:**

```php
<?php
// templates/profile.php
declare(strict_types=1);

// Escape text before it becomes HTML output.
function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
?>
<h1><?= e($user['name']) ?></h1>
<p><?= e($user['bio']) ?></p>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การแปลงตัวอักษรพิเศษ (Escaping) ข้อมูลที่ไม่น่าไว้วางใจก่อนนำไปแสดงผลในหน้า HTML เพื่อป้องกันไม่ให้ข้อมูลของผู้ใช้กลายเป็นมาร์กอัปหรือสคริปต์อันตราย (XSS)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: PDO Prepared Statements (การป้องกัน SQL Injection ด้วย Parameter Binding)

- **สรุปสาระสำคัญ:** การแยกโครงสร้างคำสั่ง SQL ออกจากข้อมูลอย่างเด็ดขาดโดยใช้ Prepared Statements และ Parameter Binding ร่วมกับ PDO แทนการนำค่าจากคำขอไปต่อสตริง SQL

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การต่อสตริงคำสั่ง SQL โดยแทรกค่าอินพุตจาก `$_GET` เข้าไปตรงๆ ทำให้ขอบเขตของคิวรีไม่ปลอดภัย เกิดช่องโหว่ SQL Injection และเลือกคอลัมน์ทั้งหมด (`SELECT *`) ทำให้ยากต่อการตรวจสอบและควบคุมขอบเขตข้อมูล
- **ตัวอย่างโค้ด:**

```php
<?php
// users.php
$email = $_GET['email'];
// Interpolating request data makes the query boundary unsafe.
$sql = "SELECT * FROM users WHERE email = '$email' AND active = 1";
$user = $pdo->query($sql)->fetch();
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การเตรียมคำสั่ง SQL ล่วงหน้าด้วยข้อความตัวแทนพารามิเตอร์ (placeholders เช่น `:email`) ระบุคอลัมน์ที่ต้องการอย่างชัดเจน และผูกค่าข้อมูลผ่าน `execute()` เพื่อรักษาขอบเขตความปลอดภัยของฐานข้อมูล
- **ตัวอย่างโค้ด:**

```php
<?php
// src/UserRepository.php
declare(strict_types=1);

final class UserRepository
{
    public function __construct(private PDO $pdo) {}

    public function findActiveByEmail(string $email): ?array
    {
        // Placeholders keep SQL structure separate from user data.
        $stmt = $this->pdo->prepare(
            'SELECT id, email, name FROM users WHERE email = :email AND active = 1'
        );
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        return $user === false ? null : $user;
    }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การแยกโครงสร้างคำสั่ง SQL ออกจากข้อมูลอย่างเด็ดขาดโดยใช้ Prepared Statements และ Parameter Binding ร่วมกับ PDO แทนการนำค่าจากคำขอไปต่อสตริง SQL

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Password Hashing and Verification (การจัดการรหัสผ่านด้วย password_hash และ password_verify)

- **สรุปสาระสำคัญ:** การใช้ API จัดการรหัสผ่านมาตรฐานของ PHP (`password_hash`, `password_verify`, `password_needs_rehash`) ในการเข้ารหัสและตรวจสอบ แทนการคิดค้นวิธีแฮชหรือใช้ฟังก์ชันทั่วไป

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ฟังก์ชันแฮชที่รวดเร็วและไม่เหมาะสมกับการเก็บรหัสผ่าน เช่น `md5()` การเปรียบเทียบแฮชตรงๆ และการผูกผลการเข้าสู่ระบบเข้ากับการเปลี่ยนค่า Session โดยตรงในไฟล์เดียว
- **ตัวอย่างโค้ด:**

```php
<?php
// login.php
// md5 is too fast and not designed for stored passwords.
$hash = md5($_POST['password']);
if ($hash === $user['password_hash']) {
    $_SESSION['user_id'] = $user['id'];
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การเรียกใช้ `password_hash()` ร่วมกับ `PASSWORD_DEFAULT` ซึ่งจะเก็บข้อมูลอัลกอริทึมและค่า cost ไว้ในข้อความแฮชโดยอัตโนมัติ ตรวจสอบด้วย `password_verify()` และใช้ `password_needs_rehash()` เพื่ออัปเกรดแฮชเมื่อมีการเปลี่ยนเกณฑ์มาตรฐาน
- **ตัวอย่างโค้ด:**

```php
<?php
// src/Auth/Passwords.php
declare(strict_types=1);

function hashPassword(string $plainPassword): string
{
    // Let PHP choose the current password-safe algorithm and cost.
    return password_hash($plainPassword, PASSWORD_DEFAULT);
}

function verifyPassword(string $plainPassword, string $storedHash): bool
{
    return password_verify($plainPassword, $storedHash);
}

function shouldRehash(string $storedHash): bool
{
    return password_needs_rehash($storedHash, PASSWORD_DEFAULT);
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้ API จัดการรหัสผ่านมาตรฐานของ PHP (`password_hash`, `password_verify`, `password_needs_rehash`) ในการเข้ารหัสและตรวจสอบ แทนการคิดค้นวิธีแฮชหรือใช้ฟังก์ชันทั่วไป

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Session Handling and Cookies (การตั้งค่า Session Cookie ปลอดภัยและการหมุนเวียน Session ID)

- **สรุปสาระสำคัญ:** การตั้งค่าแฟล็กของ Session Cookie อย่างรัดกุมก่อนเริ่มเปิดใช้งาน Session และการทำการสลับเปลี่ยน Session ID (`session_regenerate_id`) ทุกครั้งเมื่อสถานะการยืนยันตัวตนเปลี่ยนไป

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้พฤติกรรม Cookie แบบเริ่มต้นโดยไม่มีการป้องกัน ไม่หมุนเวียน Session ID เมื่อเข้าสู่ระบบ และการรับค่าบทบาทสิทธิ์ (role) จากอินพุตของคำขอ เช่น `$_GET['role']` มาบันทึกเป็นสถานะสิทธิ์การใช้งานโดยตรง
- **ตัวอย่างโค้ด:**

```php
<?php
// login.php
session_start();
if ($_POST['password'] === $user['password']) {
    $_SESSION['user_id'] = $user['id'];
    // Request-controlled roles should not become authorization state.
    $_SESSION['role'] = $_GET['role'];
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การกำหนดค่า Session Cookie Parameters (เช่น `secure => true`, `httponly => true`, `samesite => 'Lax'`) ล่วงหน้าก่อนเปิด `session_start()` และการเรียก `session_regenerate_id(true)` เพื่อลบ Session ID เก่าและสร้างใหม่ทันทีที่ยืนยันตัวตนสำเร็จ
- **ตัวอย่างโค้ด:**

```php
<?php
// src/Auth/Session.php
declare(strict_types=1);

// Cookie flags are configured before the session starts.
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => true,
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function signIn(int $userId): void
{
    session_regenerate_id(true);
    $_SESSION['user_id'] = $userId;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การตั้งค่าแฟล็กของ Session Cookie อย่างรัดกุมก่อนเริ่มเปิดใช้งาน Session และการทำการสลับเปลี่ยน Session ID (`session_regenerate_id`) ทุกครั้งเมื่อสถานะการยืนยันตัวตนเปลี่ยนไป

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Error Handling and Exceptions (การจัดการ Exception ที่ขอบเขตหน้าบ้านและระบบ Log ปลอดภัย)

- **สรุปสาระสำคัญ:** การดักจับ Exception ที่ขอบเขตหลักของแอปพลิเคชัน (Front Controller) บันทึกข้อมูลบริบทข้อผิดพลาดลง Log สำหรับผู้พัฒนา และส่งข้อความตอบกลับทั่วไปที่ปลอดภัยให้แก่ผู้ใช้งาน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การผสมผสานระบบ Routing เข้ากับการ `include` ไฟล์ตามอินพุต `$_GET` โดยตรง และการสั่ง `die($error->getMessage())` ซึ่งเป็นการเปิดเผยข้อความข้อผิดพลาดดิบของระบบออกไปยังผู้ใช้งาน
- **ตัวอย่างโค้ด:**

```php
<?php
// public/index.php
try {
    // This lets the request choose a file and exposes raw failures.
    include $_GET['page'] . '.php';
} catch (Exception $error) {
    die($error->getMessage());
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การใช้ครอบบล็อก `try-catch` ระดับ Front Controller บันทึก Exception พร้อมเส้นทางคำขอลงใน Logger สำหรับนักพัฒนา และตอบกลับผู้ใช้ด้วยข้อความทั่วไปพร้อมกำหนด HTTP Status Code 500
- **ตัวอย่างโค้ด:**

```php
<?php
// public/index.php
declare(strict_types=1);

try {
    $response = $router->dispatch($request);
    $response->send();
} catch (Throwable $error) {
    // Log details for developers but send users a safe response.
    $logger->error('Unhandled request failure', [
        'path' => $request->path(),
        'exception' => $error,
    ]);
    http_response_code(500);
    echo 'Something went wrong.';
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การดักจับ Exception ที่ขอบเขตหลักของแอปพลิเคชัน (Front Controller) บันทึกข้อมูลบริบทข้อผิดพลาดลง Log สำหรับผู้พัฒนา และส่งข้อความตอบกลับทั่วไปที่ปลอดภัยให้แก่ผู้ใช้งาน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Autoloading and Namespaces (การจัดโครงสร้าง PSR-4 และ Constructor Injection)

- **สรุปสาระสำคัญ:** การใช้ Namespaces และระบบ Autoloading เพื่อทำให้โครงสร้างไฟล์ ความเป็นเจ้าของโค้ด และ Dependencies ชัดเจน โดยไม่ต้องพึ่งพาการโหลดไฟล์ด้วย `require_once` ต่อเนื่องกัน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้สายการดึงไฟล์ด้วย `require_once` ซ้ำๆ ร่วมกับตัวแปรระดับโกลบอล (`global $db`) และฟังก์ชันอิสระ ทำให้ซ่อนแหล่งที่มาของ Dependencies และเกิด Tight Coupling ต่อลำดับการโหลดไฟล์
- **ตัวอย่างโค้ด:**

```php
<?php
// profile.php
// Manual includes and globals hide where dependencies come from.
require_once 'db.php';
require_once 'users.php';
require_once 'helpers.php';

function profile_for($id) {
    global $db;
    return find_profile($db, $id);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การจัดกลุ่มคลาสเข้าตาม Namespace และฉีด Dependencies ผ่าน Constructor Injection ให้ระบบ Autoloading เชื่อมโยงชื่อคลาสกับไฟล์โดยอัตโนมัติ ทำให้ติดตามโค้ดและทำ Unit Test ได้ง่าย
- **ตัวอย่างโค้ด:**

```php
<?php
// src/Service/UserProfileService.php
declare(strict_types=1);

namespace App\Service;

use App\Repository\UserRepository;

// Namespace and constructor injection make ownership visible.
final class UserProfileService
{
    public function __construct(private UserRepository $users) {}

    public function profileFor(int $userId): array
    {
        return $this->users->findProfile($userId);
    }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้ Namespaces และระบบ Autoloading เพื่อทำให้โครงสร้างไฟล์ ความเป็นเจ้าของโค้ด และ Dependencies ชัดเจน โดยไม่ต้องพึ่งพาการโหลดไฟล์ด้วย `require_once` ต่อเนื่องกัน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Configuration and Secrets (การโหลดความลับผ่าน Environment และ Fail-Fast Architecture)

- **สรุปสาระสำคัญ:** การอ่านค่าคอนฟิกและรหัสผ่านลับ (Secrets) จาก Environment Variables ของระบบ และกำหนดให้แอปพลิเคชันหยุดทำงานทันที (Fail Fast) หากขาด Secret ที่จำเป็นในการทำงาน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การฝัง Hardcode รหัสผ่านฐานข้อมูลไว้ในไฟล์โค้ดโดยตรง หรือการยอมให้อินพุตจากคำขอของผู้ใช้ (`$_GET['timeout']`) เข้าไปเปลี่ยนค่าคอนฟิกของโครงสร้างพื้นฐาน
- **ตัวอย่างโค้ด:**

```php
<?php
// config/database.php
// Credentials in code and request-driven config are both unsafe.
return [
    'url' => 'mysql://root:secret-password@localhost/app',
    'timeout_seconds' => $_GET['timeout'] ?? 30,
];
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** อ่านค่าจากสภาพแวดล้อมผ่าน `getenv()` และโยน `RuntimeException` ทันทีเมื่อไม่พบ Secret ที่จำเป็นในขั้นตอน Startup เพื่อป้องกันไม่ให้แอปพลิเคชันทำงานด้วยการตั้งค่าที่ไม่ปลอดภัย
- **ตัวอย่างโค้ด:**

```php
<?php
// config/database.php
declare(strict_types=1);

$databaseUrl = getenv('DATABASE_URL');

// Required secrets should fail fast when the environment is missing.
if ($databaseUrl === false || $databaseUrl === '') {
    throw new RuntimeException('DATABASE_URL is required.');
}

return [
    'url' => $databaseUrl,
    'timeout_seconds' => 3,
];
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การอ่านค่าคอนฟิกและรหัสผ่านลับ (Secrets) จาก Environment Variables ของระบบ และกำหนดให้แอปพลิเคชันหยุดทำงานทันที (Fail Fast) หากขาด Secret ที่จำเป็นในการทำงาน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Separating Logic from Templates (การแยก Business Logic ออกจาก Presentation Layer)

- **สรุปสาระสำคัญ:** การแยกการจัดการคำขอและการดึงข้อมูลออกจากไฟล์เทมเพลต เพื่อให้ส่วนเทมเพลตทำหน้าที่เพียงการจัดรูปแบบและการแสดงผลข้อมูลเท่านั้น

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การรวมเอาการรับอินพุตคำขอ การต่อคิวรี SQL การดึงข้อมูลจากฐานข้อมูล และการแสดงผล HTML ไว้ในไฟล์เทมเพลตไฟล์เดียว ทำให้โค้ดซับซ้อนและแก้ไขยาก
- **ตัวอย่างโค้ด:**

```php
<?php
// profile.php
// Request input, SQL, and output are mixed in one template file.
$userId = $_GET['id'];
$user = $pdo->query("SELECT * FROM users WHERE id = $userId")->fetch();
?>
<h1><?= $user['name'] ?></h1>
<p><?= $user['bio'] ?></p>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** การใช้ Controller จัดเตรียม View Model หรือ Array ข้อมูลให้เรียบร้อยก่อนส่งต่อให้เทมเพลต นำไปแสดงผลและทำการ Escape เฉพาะจุด
- **ตัวอย่างโค้ด:**

```php
<?php
// src/Controller/ProfileController.php
declare(strict_types=1);

final class ProfileController
{
    public function __construct(private UserRepository $users) {}

    public function show(int $userId): array
    {
        // The controller prepares data before the template renders it.
        $user = $this->users->findProfile($userId);

        return [
            'title' => $user['name'],
            'user' => $user,
        ];
    }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การแยกการจัดการคำขอและการดึงข้อมูลออกจากไฟล์เทมเพลต เพื่อให้ส่วนเทมเพลตทำหน้าที่เพียงการจัดรูปแบบและการแสดงผลข้อมูลเท่านั้น

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด PHP ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Strict Types and Return Types:** นำหลักการ "การบังคับใช้ strict_types และ Type Declarations" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Input Validation and Filtering:** นำหลักการ "การตรวจสอบและกรองข้อมูลอินพุตด้วย filter_input" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Output Escaping for XSS:** นำหลักการ "การทำ Escaping ป้องกัน Cross-Site Scripting ด้วย htmlspecialchars" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **PDO Prepared Statements:** นำหลักการ "การป้องกัน SQL Injection ด้วย Parameter Binding" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Password Hashing and Verification:** นำหลักการ "การจัดการรหัสผ่านด้วย password_hash และ password_verify" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Session Handling and Cookies:** นำหลักการ "การตั้งค่า Session Cookie ปลอดภัยและการหมุนเวียน Session ID" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Error Handling and Exceptions:** นำหลักการ "การจัดการ Exception ที่ขอบเขตหน้าบ้านและระบบ Log ปลอดภัย" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Autoloading and Namespaces:** นำหลักการ "การจัดโครงสร้าง PSR-4 และ Constructor Injection" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Configuration and Secrets:** นำหลักการ "การโหลดความลับผ่าน Environment และ Fail-Fast Architecture" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Separating Logic from Templates:** นำหลักการ "การแยก Business Logic ออกจาก Presentation Layer" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

# Modern JavaScript (ES2024+) Clean Code Guide
### คู่มือแนวทางการเขียน JavaScript สมัยใหม่: Best Practices & Clean Code

> [!NOTE]
> - **หมวดหมู่ (Category):** Core Programming & Web Runtime
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** ECMAScript Modern Standard (ES2024+), Immutability, Defensive Boundaries, Clean Code
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 แนวทางปฏิบัติการเขียน Modern JavaScript เปรียบเทียบ Anti-Pattern และ Best Practice ด้าน Type Coercion, Guard Clauses, Data Pipelines, Async Concurrency, Event Lifecycle และ Time Zones
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Strict Equality and Nullish Checks (การเปรียบเทียบค่าเข้มงวดและการจัดการ Nullish)](#หัวข้อที่-1-strict-equality-and-nullish-checks-การเปรียบเทียบค่าเข้มงวดและการจัดการ-nullish)
2. [หัวข้อที่ 2: Guard Clauses (การลดความลึกของเงื่อนไขด้วย Early Return)](#หัวข้อที่-2-guard-clauses-การลดความลึกของเงื่อนไขด้วย-early-return)
3. [หัวข้อที่ 3: Validating Data Boundaries (การตรวจสอบความถูกต้องของข้อมูลที่ขอบเขตภายนอก)](#หัวข้อที่-3-validating-data-boundaries-การตรวจสอบความถูกต้องของข้อมูลที่ขอบเขตภายนอก)
4. [หัวข้อที่ 4: Naming Side Effects (การสื่อสาร Side Effect และ In-place Mutation ผ่านชื่อฟังก์ชัน)](#หัวข้อที่-4-naming-side-effects-การสื่อสาร-side-effect-และ-in-place-mutation-ผ่านชื่อฟังก์ชัน)
5. [หัวข้อที่ 5: Array Transformations (การแปลงข้อมูลด้วย Pipeline ที่รักษา Immutability)](#หัวข้อที่-5-array-transformations-การแปลงข้อมูลด้วย-pipeline-ที่รักษา-immutability)
6. [หัวข้อที่ 6: Async Error Handling (การจัดการข้อผิดพลาดของ Network Transport และ HTTP Status)](#หัวข้อที่-6-async-error-handling-การจัดการข้อผิดพลาดของ-network-transport-และ-http-status)
7. [หัวข้อที่ 7: Promise Concurrency (การทำงานอะซิงโครนัสพร้อมกันด้วย Promise.all)](#หัวข้อที่-7-promise-concurrency-การทำงานอะซิงโครนัสพร้อมกันด้วย-promiseall)
8. [หัวข้อที่ 8: Event Listener Cleanup (การรักษา Reference และถอดถอน Event Listener ป้องกัน Memory Leak)](#หัวข้อที่-8-event-listener-cleanup-การรักษา-reference-และถอดถอน-event-listener-ป้องกัน-memory-leak)
9. [หัวข้อที่ 9: Module Boundaries and Globals (การซ่อนสถานะภายในและการใช้ Dependency Injection)](#หัวข้อที่-9-module-boundaries-and-globals-การซ่อนสถานะภายในและการใช้-dependency-injection)
10. [หัวข้อที่ 10: Dates and Time Zones (การจัดรูปแบบวันเวลาและ Time Zone ผ่าน Intl.DateTimeFormat)](#หัวข้อที่-10-dates-and-time-zones-การจัดรูปแบบวันเวลาและ-time-zone-ผ่าน-intldatetimeformat)

---

## หัวข้อที่ 1: Strict Equality and Nullish Checks (การเปรียบเทียบค่าเข้มงวดและการจัดการ Nullish)

- **สรุปสาระสำคัญ:** ควรเปรียบเทียบค่าโดยเจตนาที่ชัดเจนโดยใช้ Strict Equality (`===`) เพื่อหลีกเลี่ยง Type Coercion และใช้ Nullish Coalescing Operator (`??`) เมื่อต้องการกำหนดค่าเริ่มต้นเฉพาะกรณีที่ข้อมูลเป็น `null` หรือ `undefined` เท่านั้น

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ Loose Equality (`==`) พึ่งพาการแปลงชนิดข้อมูลอัตโนมัติ (Type Coercion) ซึ่งซ่อนค่าที่ไม่คาดคิด และการใช้ Logical OR (`||`) จะทำให้ค่า Falsy ที่ถูกต้องตามธุรกิจ (เช่น `0` หรือ `""`) ถูกมองว่าเป็นค่าที่สูญหายหรือไม่ได้ตั้งค่า
- **ตัวอย่างโค้ด:**

```javascript
// review-options.js
function formatReviewState(state) {
  // Loose equality and || blur missing data with valid falsy values.
  if (state == "approved") {
    return "Approved";
  }
  if (state == "changes_requested") {
    return "Changes requested";
  }
  return "Pending";
}

function getRetryCount(options) {
  return options.retryCount || 3;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ Strict Equality (`===`) เพื่อเปรียบเทียบค่าที่แน่นอน และใช้ Nullish Coalescing (`??`) ซึ่งจะ Fallback ก็ต่อเมื่อค่าเป็น `null` หรือ `undefined` เท่านั้น ทำให้เลข `0` ถูกรักษาไว้เป็นค่าที่ตั้งใจส่งมา
- **ประโยชน์ทางสถาปัตยกรรม:** ป้องกันการเกิด Bug แอบแฝง แยกแยะความแตกต่างระหว่างข้อมูลที่ขาดหายไป (`null`/`undefined`) กับค่า Falsy ที่ถูกเลือกมาโดยตั้งใจได้อย่างแม่นยำ
- **ตัวอย่างโค้ด:**

```javascript
// review-options.js
function formatReviewState(state) {
  // Strict equality avoids coercion hiding unexpected values.
  if (state === "approved") {
    return "Approved";
  }
  if (state === "changes_requested") {
    return "Changes requested";
  }
  return "Pending";
}

function getRetryCount(options) {
  return options.retryCount ?? 3;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรเปรียบเทียบค่าโดยเจตนาที่ชัดเจนโดยใช้ Strict Equality (`===`) เพื่อหลีกเลี่ยง Type Coercion และใช้ Nullish Coalescing Operator (`??`) เมื่อต้องการกำหนดค่าเริ่มต้นเฉพาะกรณีที่ข้อมูลเป็น `null` หรือ `undefined` เท่านั้น

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Guard Clauses (การลดความลึกของเงื่อนไขด้วย Early Return)

- **สรุปสาระสำคัญ:** ใช้ Guard Clauses เพื่อตรวจสอบและ Return ออกจากฟังก์ชันตั้งแต่เนิ่นๆ (Early Return) เมื่อพบเงื่อนไขที่ไม่ผ่านเกณฑ์ เพื่อแยกเคสที่ไม่ต้องการให้อยู่นอกเส้นทางการทำงานหลัก

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `if` ซ้อนกันหลายชั้น (Nested Branches) ทำให้ผู้อ่านโค้ดต้องแบกรับสภาวะเงื่อนไข (State) ทุกข้อพร้อมกันในหัว อ่านยาก และเพิ่มความซับซ้อนในการเพิ่มเงื่อนไขใหม่ในอนาคต
- **ตัวอย่างโค้ด:**

```javascript
// review-access.js
function canStartReview(user, pullRequest) {
  // Nested branches make reviewers carry every condition at once.
  if (user) {
    if (!pullRequest.isDraft) {
      if (pullRequest.reviewers.includes(user.id)) {
        if (pullRequest.filesChanged.length > 0) {
          return true;
        }
      }
    }
  }
  return false;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบเงื่อนไขที่ไม่ผ่านเกณฑ์ (Disqualifying cases) แล้ว Return ออกทันที ทำให้เส้นทางหลักของฟังก์ชันคงความตื้นและมุ่งเน้นไปที่เงื่อนไขบวกที่แท้จริง
- **ประโยชน์ทางสถาปัตยกรรม:** ลดความลึกของย่อหน้า (Indentation Level) เพิ่มความอ่านง่าย (Readability) และลด Cognitive Load ของผู้พัฒนาในการไล่เช็คเงื่อนไข
- **ตัวอย่างโค้ด:**

```javascript
// review-access.js
function canStartReview(user, pullRequest) {
  // Guard clauses keep rejected cases out of the main path.
  if (!user) {
    return false;
  }
  if (pullRequest.isDraft) {
    return false;
  }
  if (!pullRequest.reviewers.includes(user.id)) {
    return false;
  }
  return pullRequest.filesChanged.length > 0;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Guard Clauses เพื่อตรวจสอบและ Return ออกจากฟังก์ชันตั้งแต่เนิ่นๆ (Early Return) เมื่อพบเงื่อนไขที่ไม่ผ่านเกณฑ์ เพื่อแยกเคสที่ไม่ต้องการให้อยู่นอกเส้นทางการทำงานหลัก

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Validating Data Boundaries (การตรวจสอบความถูกต้องของข้อมูลที่ขอบเขตภายนอก)

- **สรุปสาระสำคัญ:** ทำการตรวจสอบความถูกต้องของข้อมูลจากภายนอก (Data Boundaries) ตั้งแต่จุดแรกที่ข้อมูลเข้าสู่ระบบ ก่อนที่ฟังก์ชันส่วนอื่นจะนำข้อมูลไปประมวลผลต่อ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเชื่อใจว่าโครงสร้างข้อมูลภายนอกจะมีรูปแบบที่ถูกต้องเสมอโดยไม่ตรวจสอบก่อน (Trusting external shape) ส่งผลให้โปรแกรมพังฉับพลัน (Crash) ด้วย Runtime Error เมื่อรูปแบบ Payload เปลี่ยนไปหรือมี Field ขาดหาย
- **ตัวอย่างโค้ด:**

```javascript
// review-payload.js
function normalizeReviewPayload(payload) {
  // This trusts external shape before proving it exists.
  return {
    ok: true,
    value: {
      title: payload.title.trim(),
      reviewers: payload.reviewers.map((id) => id.toLowerCase()),
    },
  };
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ปฏิบัติต่อข้อมูลนำเข้าเป็นข้อมูลที่ไม่น่าเชื่อถือ (Untrusted) โดยตรวจสอบประเภทข้อมูล (`typeof`) และโครงสร้างที่จำเป็น พร้อมส่งคืนผลลัพธ์ข้อผิดพลาดที่ชัดเจนก่อนเข้าถึง nested fields
- **ประโยชน์ทางสถาปัตยกรรม:** การทำ Defensive Boundary ช่วยให้การจัดการความไม่แน่นอนเกิดขึ้นตรงจุดเดียว ป้องกันไม่ให้ข้อผิดพลาดของข้อมูลหลุดไปก่อ Bug ในระบบส่วนลึก
- **ตัวอย่างโค้ด:**

```javascript
// review-payload.js
function normalizeReviewPayload(payload) {
  // Validate the boundary before reading nested fields.
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid payload." };
  }
  const { title, reviewers } = payload;
  if (typeof title !== "string" || title.trim() === "") {
    return { ok: false, error: "Title is required." };
  }
  if (!Array.isArray(reviewers)) {
    return { ok: false, error: "Reviewers must be a list." };
  }
  return {
    ok: true,
    value: {
      title: title.trim(),
      reviewers: reviewers.filter((id) => typeof id === "string"),
    },
  };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ทำการตรวจสอบความถูกต้องของข้อมูลจากภายนอก (Data Boundaries) ตั้งแต่จุดแรกที่ข้อมูลเข้าสู่ระบบ ก่อนที่ฟังก์ชันส่วนอื่นจะนำข้อมูลไปประมวลผลต่อ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Naming Side Effects (การสื่อสาร Side Effect และ In-place Mutation ผ่านชื่อฟังก์ชัน)

- **สรุปสาระสำคัญ:** ตั้งชื่อฟังก์ชันให้สื่อความหมายอย่างชัดเจน เพื่อให้ผู้เรียกใช้ทราบทันทีหากฟังก์ชันนั้นมีการดัดแปลงข้อมูลเดิม (In-place Mutation)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การตั้งชื่อฟังก์ชันที่ฟังดูเหมือนคืนค่าใหม่โดยไม่แตะต้องข้อมูลเดิม (Immutable) เช่น `withReviewer` แต่ภายในกลับแก้ไข Array ต้นทาง ทำให้ผู้เรียกใช้เข้าใจผิดและก่อให้เกิด Side Effects ข้ามส่วนงานอย่างไม่ตั้งใจ
- **ตัวอย่างโค้ด:**

```javascript
// reviewers.js
function withReviewer(reviewers, reviewer) {
  // The name sounds immutable while mutating the input array.
  reviewers.push(reviewer);
  return reviewers;
}
const reviewers = ["Ada"];
const nextReviewers = withReviewer(reviewers, "Lin");
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ระบุพฤติกรรมการแก้ไขข้อมูลลงในชื่อฟังก์ชันอย่างเปิดเผย เช่น `addReviewerInPlace` เพื่อเตือนผู้เรียกใช้ว่าอาร์เรย์เดิมจะเปลี่ยนแปลง หรือเปลี่ยนไปคืนค่าเป็นชุดข้อมูลใหม่แทน
- **ประโยชน์ทางสถาปัตยกรรม:** สื่อสาร Side Effects ผ่านชื่อฟังก์ชันอย่างตรงไปตรงมา ลดความผิดพลาดจากการสับสนเรื่อง Object References
- **ตัวอย่างโค้ด:**

```javascript
// reviewers.js
function addReviewerInPlace(reviewers, reviewer) {
  // The name warns callers that the array will mutate.
  reviewers.push(reviewer);
  return reviewers;
}
const reviewers = ["Ada"];
addReviewerInPlace(reviewers, "Lin");
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ตั้งชื่อฟังก์ชันให้สื่อความหมายอย่างชัดเจน เพื่อให้ผู้เรียกใช้ทราบทันทีหากฟังก์ชันนั้นมีการดัดแปลงข้อมูลเดิม (In-place Mutation)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Array Transformations (การแปลงข้อมูลด้วย Pipeline ที่รักษา Immutability)

- **สรุปสาระสำคัญ:** ใช้ Array Methods เช่น `filter`, `map`, และ `sort` เพื่อแปลงข้อมูลแบบเป็นลำดับขั้น (Pipeline) ที่อ่านง่าย และไม่เปลี่ยนแปลงข้อมูลต้นฉบับ (Immutability)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเรียก `sort()` หรือการเพิ่ม Property ใหม่ลงบน Object ใน Array ต้นทาง เป็นการดัดแปลงข้อมูล (Mutation) ที่ส่งผลกระทบต่อโค้ดส่วนอื่นที่ถือ Reference ของข้อมูลนั้นอยู่
- **ตัวอย่างโค้ด:**

```javascript
// changed-files.js
function summarizeChangedFiles(files) {
  // Sorting and assigning churn mutate data other code may still use.
  files.sort((left, right) => right.additions - left.additions);
  const summary = [];
  files.forEach((file) => {
    if (file.status !== "deleted") {
      file.churn = file.additions + file.deletions;
      summary.push(file);
    }
  });
  return summary;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กรองข้อมูลด้วย `filter()`, แปลงรูปโครงสร้างด้วย `map()`, และจัดเรียงด้วย `sort()` โดยคืนค่าเป็น Object คอลเลกชันใหม่โดยไม่แตะต้องข้อมูลนำเข้า
- **ประโยชน์ทางสถาปัตยกรรม:** รักษาความปลอดภัยของข้อมูลด้วยหลัก Immutability อ่านเข้าใจง่าย ชัดเจนในเจตนาของการแปลงข้อมูล
- **ตัวอย่างโค้ด:**

```javascript
// changed-files.js
function summarizeChangedFiles(files) {
  // The pipeline returns new summary objects instead of changing input.
  return files
    .filter((file) => file.status !== "deleted")
    .map((file) => ({
      path: file.path,
      churn: file.additions + file.deletions,
    }))
    .sort((left, right) => right.churn - left.churn);
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Array Methods เช่น `filter`, `map`, และ `sort` เพื่อแปลงข้อมูลแบบเป็นลำดับขั้น (Pipeline) ที่อ่านง่าย และไม่เปลี่ยนแปลงข้อมูลต้นฉบับ (Immutability)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Async Error Handling (การจัดการข้อผิดพลาดของ Network Transport และ HTTP Status)

- **สรุปสาระสำคัญ:** ตรวจสอบความล้มเหลวของการส่งข้อมูลทางเครือข่าย (Transport Failures) และ HTTP Response Status ก่อนทำการ Parse ข้อมูล JSON

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** สมมติว่าคำขอสำเร็จเสมอในกรณี Happy Path เมื่อเกิด Error เช่น HTTP 404, 500 หรือปัญหาการเชื่อมต่อ การเรียก `response.json()` ทันทีจะทำให้เกิด Unhandled Exceptions หรือพังขณะแปลงข้อมูลที่ไม่ใช่ JSON
- **ตัวอย่างโค้ด:**

```javascript
// load-profile.js
async function loadProfile(userId) {
  // Happy-path parsing turns failures into unhandled exceptions.
  const response = await fetch("/api/users/" + userId);
  const profile = await response.json();
  return { ok: true, profile };
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกการจัดการระหว่าง Transport Failures (ผ่าน `try-catch`) และ Non-2xx HTTP Status (ผ่าน `!response.ok`) ให้ชัดเจน ก่อนทำการเรียก `response.json()`
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่ม Resilience ให้กับระบบ และส่งผลลัพธ์การทำงานที่เป็นรูปแบบมาตรฐาน (`{ ok: boolean }`) ให้ผู้เรียกนำไปจัดการต่อได้ง่าย
- **ตัวอย่างโค้ด:**

```javascript
// load-profile.js
async function loadProfile(userId) {
  // Check HTTP status before parsing and catch transport failures.
  try {
    const response = await fetch("/api/users/" + userId);
    if (!response.ok) {
      return { ok: false, error: "Profile request failed." };
    }
    const profile = await response.json();
    return { ok: true, profile };
  } catch {
    return { ok: false, error: "Network error while loading profile." };
  }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ตรวจสอบความล้มเหลวของการส่งข้อมูลทางเครือข่าย (Transport Failures) และ HTTP Response Status ก่อนทำการ Parse ข้อมูล JSON

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Promise Concurrency (การทำงานอะซิงโครนัสพร้อมกันด้วย Promise.all)

- **สรุปสาระสำคัญ:** ทำงาน Asynchronous ที่เป็นอิสระต่อกันควบคู่กันไป (Concurrency) โดยใช้ `Promise.all()` แทนที่จะใช้ `await` รอทีละคำขอแบบ Sequential

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `await` เรียงต่อกันเป็นลำดับเมื่อเรียก API ที่ไม่ได้มีความเชื่อมโยงข้อมูลกัน ทำให้เกิด Latency สะสมและทำให้หน้ารอประมวลผลนานขึ้นโดยไม่จำเป็น
- **ตัวอย่างโค้ด:**

```javascript
// review-sidebar.js
async function loadReviewSidebar(pullRequestId) {
  // Sequential awaits add latency without a data dependency.
  const checks = await fetchChecks(pullRequestId);
  const comments = await fetchComments(pullRequestId);
  const reviewers = await fetchReviewers(pullRequestId);
  return { checks, comments, reviewers };
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ `Promise.all()` เพื่อส่งคำขอพร้อมกันในรูปแบบ Concurrent Requests และรอรับผลลัพธ์กลับมาพร้อมกันทีเดียว
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่มประสิทธิภาพและลดระยะเวลาตอบสนอง (Response Time) โดยใช้ Sequential `await` เฉพาะงานที่มี Data Dependency จริงๆ เท่านั้น
- **ตัวอย่างโค้ด:**

```javascript
// review-sidebar.js
async function loadReviewSidebar(pullRequestId) {
  // Independent requests start together and fail as one group.
  const [checks, comments, reviewers] = await Promise.all([
    fetchChecks(pullRequestId),
    fetchComments(pullRequestId),
    fetchReviewers(pullRequestId),
  ]);
  return { checks, comments, reviewers };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ทำงาน Asynchronous ที่เป็นอิสระต่อกันควบคู่กันไป (Concurrency) โดยใช้ `Promise.all()` แทนที่จะใช้ `await` รอทีละคำขอแบบ Sequential

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Event Listener Cleanup (การรักษา Reference และถอดถอน Event Listener ป้องกัน Memory Leak)

- **สรุปสาระสำคัญ:** เมื่อทำการผูก Event Listener ต้องเก็บ Reference ของ Event Handler ไว้อย่างมั่นคง และคืนค่าฟังก์ชัน Cleanup เสมอ เพื่อให้สามารถยกเลิกการลงทะเบียนได้

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การผูก Anonymous Arrow Function เข้ากับ Event Listener ทำให้ผู้เรียกใช้ไม่มีทางถอน (Remove) Event นั้นออกได้ ส่งผลให้เกิด Memory Leak และการทำงานซ้ำซ้อนเมื่อมีการ Setup ใหม่
- **ตัวอย่างโค้ด:**

```javascript
// keyboard-shortcut.js
function attachSaveShortcut(target, onSave) {
  // Anonymous listeners cannot be removed by the caller.
  target.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      onSave();
    }
  });
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ประกาศฟังก์ชัน Handler แบบ Named Function เพื่ออ้างอิงตำแหน่งในหน่วยความจำที่แน่นอน และ คืนฟังก์ชันสำหรับยกเลิก (`removeEventListener`) ให้ผู้เรียกนำไปใช้ Cleanup
- **ประโยชน์ทางสถาปัตยกรรม:** จัดการ Lifecycle ของ Event Listener ได้สมบูรณ์ ป้องกันปัญหา Event ทำงานซ้อนทับกัน และป้องกันปัญหา Memory Leak
- **ตัวอย่างโค้ด:**

```javascript
// keyboard-shortcut.js
function attachSaveShortcut(target, onSave) {
  // A stable handler reference lets callers remove the listener later.
  function handleKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      onSave();
    }
  }
  target.addEventListener("keydown", handleKeydown);
  return () => {
    target.removeEventListener("keydown", handleKeydown);
  };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** เมื่อทำการผูก Event Listener ต้องเก็บ Reference ของ Event Handler ไว้อย่างมั่นคง และคืนค่าฟังก์ชัน Cleanup เสมอ เพื่อให้สามารถยกเลิกการลงทะเบียนได้

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Module Boundaries and Globals (การซ่อนสถานะภายในและการใช้ Dependency Injection)

- **สรุปสาระสำคัญ:** ซ่อนการทำงานภายในไว้หลัง Module API และส่งผ่าน Dependencies เข้ามา แทนที่จะกระจาย Mutable Global State หรือเข้าถึง `window`/`localStorage` โดยตรง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การอ่านและเขียนค่าลงใน `window` และ `localStorage` โดยตรงจากโมดูล ทำให้ส่วนอื่นของโค้ดสามารถข้าม Module API เข้ามาแก้ไข State ได้ เกิด Tight Coupling และทดสอบด้วย Automated Test ได้ยาก
- **ตัวอย่างโค้ด:**

```javascript
// review-filters.js
window.reviewFilters = { status: "open" };

function readReviewFilters() {
  // Global reads and writes let callers bypass the module API.
  return JSON.parse(localStorage.reviewFilters || "{}");
}

function saveReviewFilters(filters) {
  localStorage.reviewFilters = JSON.stringify(filters);
  window.reviewFilters = filters;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ซ่อน Storage Key ไว้ภายในโมดูล และรับ `storage` เข้ามาในฐานะ Dependency Parameter เพื่อสร้างขอบเขต Module Boundary ที่ชัดเจน
- **ประโยชน์ทางสถาปัตยกรรม:** สอดคล้องกับหลักการ Dependency Injection ทำให้การทำ Unit Test และ Mocking สะดวกขึ้น โดยไม่ต้องพึ่งพา Global Environment
- **ตัวอย่างโค้ด:**

```javascript
// review-filters.js
const FILTER_STORAGE_KEY = "review-filters";

export function readReviewFilters(storage) {
  // Storage is a dependency, not hidden global state.
  const rawValue = storage.getItem(FILTER_STORAGE_KEY);
  if (!rawValue) {
    return { status: "open" };
  }
  return JSON.parse(rawValue);
}

export function saveReviewFilters(storage, filters) {
  storage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ซ่อนการทำงานภายในไว้หลัง Module API และส่งผ่าน Dependencies เข้ามา แทนที่จะกระจาย Mutable Global State หรือเข้าถึง `window`/`localStorage` โดยตรง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Dates and Time Zones (การจัดรูปแบบวันเวลาและ Time Zone ผ่าน Intl.DateTimeFormat)

- **สรุปสาระสำคัญ:** จัดรูปแบบวันที่โดยระบุ Locale และ Time Zone อย่างชัดเจน ผ่านมาตรฐาน `Intl.DateTimeFormat` แทนที่จะคำนวณและจัด Format ด้วยตนเองผ่านค่า Local Runtime

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การดึงค่าและประกอบวันที่เองด้วย `getMonth()`, `getDate()`, `getFullYear()` พึ่งพา Local Time Zone ของสภาพแวดล้อมที่รันโค้ด ส่งผลให้วัน/เวลาแสดงผลคลาดเคลื่อนเมื่อผู้ใช้อยู่ต่างภูมิภาค
- **ตัวอย่างโค้ด:**

```javascript
// release-date.js
function formatReleaseDate(dateString) {
  // Manual formatting depends on the runtime's local time zone.
  const date = new Date(dateString);
  return (
    date.getMonth() + 1 + "/" +
    date.getDate() + "/" +
    date.getFullYear()
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนด `locale` และ `timeZone` เป็น Input Parameter อย่างตรงไปตรงมา และใช้ `Intl.DateTimeFormat` ในการแปลงรูปแบบวันที่ให้ถูกต้องตามพฤติกรรมที่คาดหวัง
- **ประโยชน์ทางสถาปัตยกรรม:** รองรับการทำงานแบบข้ามภูมิภาค (Internationalization Support) ได้แม่นยำ ป้องกันบั๊กวันที่เหลื่อมล้ำจากเขตเวลาของผู้ใช้
- **ตัวอย่างโค้ด:**

```javascript
// release-date.js
function formatReleaseDate(isoDate, locale, timeZone) {
  // Locale and time zone are explicit formatting inputs.
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone,
  });
  return formatter.format(new Date(isoDate));
}

formatReleaseDate("2026-05-24T00:00:00Z", "en-US", "UTC");
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** จัดรูปแบบวันที่โดยระบุ Locale และ Time Zone อย่างชัดเจน ผ่านมาตรฐาน `Intl.DateTimeFormat` แทนที่จะคำนวณและจัด Format ด้วยตนเองผ่านค่า Local Runtime

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด JavaScript ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Strict Equality and Nullish Checks:** นำหลักการ "การเปรียบเทียบค่าเข้มงวดและการจัดการ Nullish" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Guard Clauses:** นำหลักการ "การลดความลึกของเงื่อนไขด้วย Early Return" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Validating Data Boundaries:** นำหลักการ "การตรวจสอบความถูกต้องของข้อมูลที่ขอบเขตภายนอก" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Naming Side Effects:** นำหลักการ "การสื่อสาร Side Effect และ In-place Mutation ผ่านชื่อฟังก์ชัน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Array Transformations:** นำหลักการ "การแปลงข้อมูลด้วย Pipeline ที่รักษา Immutability" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Async Error Handling:** นำหลักการ "การจัดการข้อผิดพลาดของ Network Transport และ HTTP Status" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Promise Concurrency:** นำหลักการ "การทำงานอะซิงโครนัสพร้อมกันด้วย Promise.all" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Event Listener Cleanup:** นำหลักการ "การรักษา Reference และถอดถอน Event Listener ป้องกัน Memory Leak" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Module Boundaries and Globals:** นำหลักการ "การซ่อนสถานะภายในและการใช้ Dependency Injection" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Dates and Time Zones:** นำหลักการ "การจัดรูปแบบวันเวลาและ Time Zone ผ่าน Intl.DateTimeFormat" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

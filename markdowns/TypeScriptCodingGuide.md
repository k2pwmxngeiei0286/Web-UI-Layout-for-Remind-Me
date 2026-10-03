# TypeScript 5+ Architecture & Type Safety Guide
### คู่มือสถาปัตยกรรมและการเขียน TypeScript ยุคใหม่อย่างปลอดภัย

> [!NOTE]
> - **หมวดหมู่ (Category):** Type System & Clean Architecture
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** TypeScript 5.x+, Strict Type Checking, Parse Don't Validate, Domain Modeling
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรม Type System ของ TypeScript เน้น Type Inference, Unknown Narrowing, Discriminated Unions, Exhaustive Checks, Generic Constraints และ Type-Only Imports
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Type Inference and Explicit Boundaries (การระบุ Type ที่ขอบเขตและให้ระบบอนุมานภายใน)](#หัวข้อที่-1-type-inference-and-explicit-boundaries-การระบุ-type-ที่ขอบเขตและให้ระบบอนุมานภายใน)
2. [หัวข้อที่ 2: Narrowing Unknown (การตรวจสอบข้อมูล Unknown ผ่าน Runtime Validation และ Type Guards)](#หัวข้อที่-2-narrowing-unknown-การตรวจสอบข้อมูล-unknown-ผ่าน-runtime-validation-และ-type-guards)
3. [หัวข้อที่ 3: Avoiding Unsafe Assertions (การหลีกเลี่ยง Type Assertions โดยไม่มีการพิสูจน์ที่ Runtime)](#หัวข้อที่-3-avoiding-unsafe-assertions-การหลีกเลี่ยง-type-assertions-โดยไม่มีการพิสูจน์ที่-runtime)
4. [หัวข้อที่ 4: Discriminated Unions (การใช้ Tagged Unions ป้องกัน Invalid State)](#หัวข้อที่-4-discriminated-unions-การใช้-tagged-unions-ป้องกัน-invalid-state)
5. [หัวข้อที่ 5: Exhaustive Checks with Never (การบังคับตรวจสอบทุกกรณีด้วย Never Type)](#หัวข้อที่-5-exhaustive-checks-with-never-การบังคับตรวจสอบทุกกรณีด้วย-never-type)
6. [หัวข้อที่ 6: Precise Function Types (การระบุ Function Signatures อย่างเฉพาะเจาะจง)](#หัวข้อที่-6-precise-function-types-การระบุ-function-signatures-อย่างเฉพาะเจาะจง)
7. [หัวข้อที่ 7: Optional Properties vs Nullable Values (การแยกแยะความหมายระหว่าง ? และ Null)](#หัวข้อที่-7-optional-properties-vs-nullable-values-การแยกแยะความหมายระหว่าง-และ-null)
8. [หัวข้อที่ 8: Generic Constraints (การจำกัดขอบเขตของ Generics ด้วย extends)](#หัวข้อที่-8-generic-constraints-การจำกัดขอบเขตของ-generics-ด้วย-extends)
9. [หัวข้อที่ 9: Utility Types at API Boundaries (การใช้ Pick, Omit เพื่อปกป้อง Internal Data)](#หัวข้อที่-9-utility-types-at-api-boundaries-การใช้-pick-omit-เพื่อปกป้อง-internal-data)
10. [หัวข้อที่ 10: Type-Only Imports and Module Boundaries (การแยก Type Imports เพื่อประสิทธิภาพ Bundle)](#หัวข้อที่-10-type-only-imports-and-module-boundaries-การแยก-type-imports-เพื่อประสิทธิภาพ-bundle)

---

## หัวข้อที่ 1: Type Inference and Explicit Boundaries (การระบุ Type ที่ขอบเขตและให้ระบบอนุมานภายใน)

- **สรุปสาระสำคัญ:** **ระบุชนิดข้อมูล (Type Annotation) เฉพาะจุดที่เป็นขอบเขต (Boundaries)** ของระบบ เช่น พารามิเตอร์อินพุตของฟังก์ชัน และประเภทข้อมูลที่ส่งออก (Exported API) ส่วนภายในฟังก์ชันให้ TypeScript ช่วยคาดเดาชนิดข้อมูล (Type Inference) โดยอัตโนมัติ.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `any` ที่ขอบเขตของพารามิเตอร์อินพุต แล้วไปเสียเวลาระบุชนิดข้อมูลให้กับตัวแปรภายในฟังก์ชัน. รูปแบบนี้ทำให้ระบบขาดการปกป้องที่ขอบเขตอินพุตอย่างแท้จริง ส่งผลให้เกิดความเสี่ยงต่อ Runtime Error และการตรวจสอบโค้ดทำได้ยากขึ้น.
- **ตัวอย่างโค้ด:**

```typescript
// review-summary.ts
export function createReviewSummary(input: any) {
  // การระบุ Type ตัวแปรภายในไม่สามารถปกป้องขอบเขตที่ใช้ any ได้
  const label: string = input.title + " (" + input.comments.length + ")";
  const isClosed: boolean = input.closed;
  return {
    label,
    isClosed,
  };
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดชนิดข้อมูลที่ขอบเขตพารามิเตอร์อินพุต (`ReviewSummaryInput`) อย่างชัดเจน และปล่อยให้ชนิดข้อมูลของตัวแปรภายในฟังก์ชันรวมถึง Return Value ถูกคาดเดาโดยอัตโนมัติจากค่าจริง.
- **ประโยชน์ทางสถาปัตยกรรม:** ช่วยเสริมสร้าง **Explicit Boundaries** ทำให้ผู้เรียกใช้ฟังก์ชันทราบข้อตกลงข้อมูลที่ถูกต้อง ขณะเดียวกันยังคงความกระชับของโค้ดภายในฟังก์ชัน และได้ **Compile-time Safety** ตั้งแต่จุดเริ่มต้นของการรับข้อมูล.
- **ตัวอย่างโค้ด:**

```typescript
// review-summary.ts
type ReviewSummaryInput = {
  title: string;
  commentCount: number;
  state: "open" | "closed";
};

export function createReviewSummary(input: ReviewSummaryInput) {
  // ชนิดข้อมูลพารามิเตอร์สร้างข้อตกลงชัดเจน ส่วนตัวแปรภายในปล่อยให้ Inference เอง
  const label = input.title + " (" + input.commentCount + ")";
  return {
    label,
    isClosed: input.state === "closed",
  };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ระบุชนิดข้อมูล (Type Annotation) เฉพาะจุดที่เป็นขอบเขต (Boundaries)** ของระบบ เช่น พารามิเตอร์อินพุตของฟังก์ชัน และประเภทข้อมูลที่ส่งออก (Exported API) ส่วนภายในฟังก์ชันให้ TypeScript ช่วยคาดเดาชนิดข้อมูล (Type Inference) โดยอัตโนมัติ.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Narrowing Unknown (การตรวจสอบข้อมูล Unknown ผ่าน Runtime Validation และ Type Guards)

- **สรุปสาระสำคัญ:** **ตรวจสอบข้อมูลชนิด `unknown` ผ่าน Runtime Validation** หรือ Type Guard ก่อนนำไปใช้งานเป็นข้อมูลที่น่าเชื่อถือภายในแอปพลิเคชัน.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ Double Casting (`as any as Settings`) เพื่อข้ามขั้นตอนการพิสูจน์ความถูกต้องของข้อมูลในขณะทำงาน. ทำให้ TypeScript ยินยอมให้ผ่านโดยไม่ได้สร้างหลักประกันใด ๆ และส่งผลให้ข้อมูลที่ไม่ถูกต้องสามารถไหลเข้าสู่ระบบได้.
- **ตัวอย่างโค้ด:**

```typescript
// parse-settings.ts
type Settings = {
  theme: "light" | "dark";
};

function readSettings(value: unknown): Settings {
  // การใช้ Double Casting ข้ามการพิสูจน์ข้อมูลแบบ Runtime
  return value as any as Settings;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สร้าง Type Guard Function (`isSettings`) เพื่อตรวจสอบชนิดข้อมูลและโครงสร้างของวัตถุจริง ณ เวลาทำงาน ก่อนที่จะคืนค่าหรือสกัดข้อมูลได้อย่างปลอดภัย.
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่ม **Runtime Integrity** และสร้างหลักการ **Parse, don't validate** ป้องกันไม่ให้สถานะที่ผิดพลาด (Invalid States) ส่งผ่านไปยังขอบเขตอื่นของระบบ.
- **ตัวอย่างโค้ด:**

```typescript
// parse-settings.ts
type Settings = {
  theme: "light" | "dark";
};

function isSettings(value: unknown): value is Settings {
  return (
    typeof value === "object" &&
    value !== null &&
    "theme" in value &&
    (value.theme === "light" || value.theme === "dark")
  );
}

function readSettings(value: unknown): Settings {
  // ตรวจสอบผ่าน Type Guard เพื่อสร้างความน่าเชื่อถือก่อนคืนค่า
  if (!isSettings(value)) {
    return { theme: "light" };
  }
  return value;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ตรวจสอบข้อมูลชนิด `unknown` ผ่าน Runtime Validation** หรือ Type Guard ก่อนนำไปใช้งานเป็นข้อมูลที่น่าเชื่อถือภายในแอปพลิเคชัน.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Avoiding Unsafe Assertions (การหลีกเลี่ยง Type Assertions โดยไม่มีการพิสูจน์ที่ Runtime)

- **สรุปสาระสำคัญ:** **หลีกเลี่ยงการใช้ Type Assertions (`as`)** กับข้อมูลที่ไม่น่าเชื่อถือ เช่น ข้อมูลจาก JSON, Storage หรือ Network โดยควรใช้การตรวจสอบรูปทรงข้อมูล ณ เวลาทำงานเพื่อพิสูจน์ความถูกต้องแทน.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `as Session` แปลงข้อมูลชนิด `unknown` เป็น `Session` โดยไม่มีหลักฐานพิสูจน์เชิง Runtime. บังคับให้คอมไพเลอร์เงียบลง ทำให้ข้อมูลที่อาจไม่สมบูรณ์หรือผิดพลาดถูกประมวลผลต่อในฐานะข้อมูลที่ปลอดภัย.
- **ตัวอย่างโค้ด:**

```typescript
// session.ts
type Session = {
  userId: string;
  expiresAt: string;
};

export function readSession(value: unknown): Session {
  // แปลงค่า unknown เป็น Session โดยไม่มีการพิสูจน์
  return value as Session;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ Type Guard (`isSession`) เพื่อตรวจสอบคีย์และชนิดข้อมูลย่อยทั้งหมดที่จำเป็น ณ Runtime ก่อนที่จะยอมรับและคืนค่าชนิดข้อมูล `Session` หรือคืนค่า `undefined` หากไม่ตรงตามเงื่อนไข.
- **ประโยชน์ทางสถาปัตยกรรม:** บรรลุ **Fail-Safe Trust Boundary** ทำให้ตัวแปรชนิดแอปพลิเคชันการันตีโครงสร้างจริง ช่วยลดบั๊กจากข้อมูลที่สูญหายหรือไม่ถูกต้อง ณ เวลาทำงาน.
- **ตัวอย่างโค้ด:**

```typescript
// session.ts
type Session = {
  userId: string;
  expiresAt: string;
};

function isSession(value: unknown): value is Session {
  return (
    typeof value === "object" &&
    value !== null &&
    "userId" in value &&
    typeof value.userId === "string" &&
    "expiresAt" in value &&
    typeof value.expiresAt === "string"
  );
}

export function readSession(value: unknown): Session | undefined {
  // ตรวจสอบรูปแบบข้อมูลจริงก่อนเปิดเผย Session
  if (!isSession(value)) {
    return undefined;
  }
  return value;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** หลีกเลี่ยงการใช้ Type Assertions (`as`)** กับข้อมูลที่ไม่น่าเชื่อถือ เช่น ข้อมูลจาก JSON, Storage หรือ Network โดยควรใช้การตรวจสอบรูปทรงข้อมูล ณ เวลาทำงานเพื่อพิสูจน์ความถูกต้องแทน.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Discriminated Unions (การใช้ Tagged Unions ป้องกัน Invalid State)

- **สรุปสาระสำคัญ:** **ใช้ Discriminated Unions โดยระบุฟิลด์จำแนกตัวเอกลักษณ์ (Discriminant Tag)** เช่น `status` เพื่อช่วยให้ TypeScript ทำการจำกัดขอบเขตชนิดข้อมูล (Narrowing) ได้อย่างปลอดภัย และป้องกันการสร้างสถานะที่ไม่สมเหตุสมผล.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การออกแบบ Type รวมฟิลด์แบบ Optional (`saved?: boolean`, `id?: string`, `message?: string`). ส่งผลให้เกิดสถานะที่ไม่สัมพันธ์กันในโลกจริง เช่น `saved: true` แต่ไม่มี `id` หรือบันทึกไม่สำเร็จแต่ไม่มีข้อความแจ้งเตือน.
- **ตัวอย่างโค้ด:**

```typescript
// result.ts
type SaveResult = {
  saved?: boolean;
  id?: string;
  message?: string;
};

function renderSaveResult(result: SaveResult) {
  // ฟิลด์ optional อาจก่อให้เกิดสถานะที่ไม่เป็นจริงและสับสน
  if (result.saved) {
    return "Saved draft " + result.id;
  }
  return "Could not save: " + result.message;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกชนิดข้อมูลออกเป็นเซ็ตย่อยโดยมีฟิลด์จำแนก (`status: "saved"` และ `status: "failed"`) ทำให้แต่ละรูปแบบข้อมูลมีโครงสร้างเฉพาะตัวชัดเจน.
- **ประโยชน์ทางสถาปัตยกรรม:** ปฏิบัติตามหลักการ **Make Invalid States Unrepresentable** ช่วยขจัดความเป็นไปได้ของข้อมูลที่ไม่ถูกต้องตั้งแต่ระดับการนิยาม Type.
- **ตัวอย่างโค้ด:**

```typescript
// result.ts
type SaveResult =
  | { status: "saved"; id: string }
  | { status: "failed"; message: string };

function renderSaveResult(result: SaveResult) {
  // ฟิลด์ status จะช่วยจำกัดโครงสร้างที่ถูกต้องในแต่ละบล็อกเงื่อนไข
  if (result.status === "saved") {
    return "Saved draft " + result.id;
  }
  return "Could not save: " + result.message;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ Discriminated Unions โดยระบุฟิลด์จำแนกตัวเอกลักษณ์ (Discriminant Tag)** เช่น `status` เพื่อช่วยให้ TypeScript ทำการจำกัดขอบเขตชนิดข้อมูล (Narrowing) ได้อย่างปลอดภัย และป้องกันการสร้างสถานะที่ไม่สมเหตุสมผล.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Exhaustive Checks with Never (การบังคับตรวจสอบทุกกรณีด้วย Never Type)

- **สรุปสาระสำคัญ:** **ใช้การตรวจสอบแบบครอบคลุมทุกกรณี (Exhaustive Checks) ร่วมกับชนิดข้อมูล `never`** ในเงื่อนไขสุดท้าย เพื่อให้คอมไพเลอร์แจ้งเตือนทันทีหากมีการเพิ่มสถานะใหม่ใน Union แล้วไม่ได้เขียนโค้ดรองรับ.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `if/else` หรือ Default Fallback ทั่วไป (เช่น คืนค่า `"Unknown state"`). เมื่อมีการเพิ่ม Union แบบใหม่ ระบบจะไม่แจ้งเตือนข้อผิดพลาดในขั้นตอนคอมไพล์ ทำให้เกิดพฤติกรรมแปลกแยกระหว่างการทำงานจริง.
- **ตัวอย่างโค้ด:**

```typescript
// review-state.ts
type ReviewState =
  | { status: "draft" }
  | { status: "open"; reviewerCount: number }
  | { status: "merged"; mergedBy: string };

function renderReviewState(state: ReviewState) {
  // กรณีทั่วไปซ่อนเคสที่ตกสำรวจเมื่อมีการเพิ่มชนิดสถานะใหม่
  if (state.status === "draft") {
    return "Draft";
  }
  if (state.status === "open") {
    return "Open for " + state.reviewerCount + " reviewers";
  }
  return "Unknown state";
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้คำสั่ง `switch` ครอบคลุมทุกเคส และกำหนดกรณี `default` ให้กำหนดค่าลงในตัวแปรชนิด `never` (`const neverState: never = state;`) เพื่อบังคับตรวจเช็กทุกทางเลือก.
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่ม **Maintainability & Compile-time Safety** โดยทำหน้าที่เป็น Tripwire แจ้งเตือนนักพัฒนาล่วงหน้าทันทีเมื่อมีการขยาย Domain Model ในอนาคต.
- **ตัวอย่างโค้ด:**

```typescript
// review-state.ts
type ReviewState =
  | { status: "draft" }
  | { status: "open"; reviewerCount: number }
  | { status: "merged"; mergedBy: string };

function renderReviewState(state: ReviewState) {
  // กำหนดลงตัวแปรชนิด never เพื่อสร้างความผิดพลาดระดับ Compile-time หากหลุดเคส
  switch (state.status) {
    case "draft":
      return "Draft";
    case "open":
      return "Open for " + state.reviewerCount + " reviewers";
    case "merged":
      return "Merged by " + state.mergedBy;
    default: {
      const neverState: never = state;
      return neverState;
    }
  }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้การตรวจสอบแบบครอบคลุมทุกกรณี (Exhaustive Checks) ร่วมกับชนิดข้อมูล `never`** ในเงื่อนไขสุดท้าย เพื่อให้คอมไพเลอร์แจ้งเตือนทันทีหากมีการเพิ่มสถานะใหม่ใน Union แล้วไม่ได้เขียนโค้ดรองรับ.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Precise Function Types (การระบุ Function Signatures อย่างเฉพาะเจาะจง)

- **สรุปสาระสำคัญ:** **กำหนดลายเซ็นของฟังก์ชันและคอลแบ็ก (Callback Signatures) ให้เฉพาะเจาะจง** ทั้งในส่วนของพารามิเตอร์และผลลัพธ์ที่รองรับ หลีกเลี่ยงการใช้ชนิดข้อมูลกว้าง ๆ เช่น `Function`.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การระบุชนิดข้อมูลของคอลแบ็กเป็น `Function`. ส่งผลให้คอมไพเลอร์ไม่สามารถตรวจสอบจำนวน อาร์กิวเมนต์ ชนิดข้อมูล หรือการส่งค่าที่ไม่ตรงกับข้อตกลงได้.
- **ตัวอย่างโค้ด:**

```typescript
// review-actions.ts
function submitReview(handleReview: Function) {
  // ชนิด Function ยอมรับการเรียกทุกรูปแบบ ทำให้เรียกผิดพลาดได้ง่าย
  handleReview("approve");
  handleReview("delete-branch", 42, true);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนด Custom Type หรือ Function Type แบบเฉพาะเจาะจง (`type ReviewHandler = (action: ReviewAction, comment: string) => void;`) เพื่อระบุค่าอินพุตและเอาต์พุตที่อนุญาตอย่างถูกต้อง.
- **ประโยชน์ทางสถาปัตยกรรม:** สร้าง **Strict Contract Behavior** ให้กับฟังก์ชันระดับ Higher-Order Functions และ Callbacks ป้องกันปัญหาส่งอาร์กิวเมนต์ไม่ครบหรือผิดประเภท.
- **ตัวอย่างโค้ด:**

```typescript
// review-actions.ts
type ReviewAction = "approve" | "request-changes";
type ReviewHandler = (action: ReviewAction, comment: string) => void;

function submitReview(handleReview: ReviewHandler) {
  // ลายเซ็นฟังก์ชันแบบเฉพาะเจาะจงจำกัดการเรียกให้ตรงตามข้อตกลง
  handleReview("approve", "Ready to merge.");
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** กำหนดลายเซ็นของฟังก์ชันและคอลแบ็ก (Callback Signatures) ให้เฉพาะเจาะจง** ทั้งในส่วนของพารามิเตอร์และผลลัพธ์ที่รองรับ หลีกเลี่ยงการใช้ชนิดข้อมูลกว้าง ๆ เช่น `Function`.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Optional Properties vs Nullable Values (การแยกแยะความหมายระหว่าง ? และ Null)

- **สรุปสาระสำคัญ:** **ใช้ Optional Properties (`?`) เมื่อฟิลด์นั้นสามารถละเว้นได้ และใช้ Nullable Values (`null`) เมื่อฟิลด์นั้นมีอยู่แต่ยังไม่มีข้อมูลหรือจงใจให้ว่างเปล่า** เพื่อแยกแยะความหมายของการไม่มีข้อมูลให้ชัดเจน.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การผสมผสานทั้ง `?` และ `null` สับสนปะปนกันทุกฟิลด์ (เช่น `displayName?: string | null`). ทำให้ผู้เรียกใช้ไม่สามารถระบุได้ว่าข้อมูลยังไม่ถูกส่งมา ยังไม่โหลด หรือจงใจลบทิ้ง.
- **ตัวอย่างโค้ด:**

```typescript
// profile.ts
type ProfileDraft = {
  displayName?: string | null;
  avatarUrl?: string | null;
};

function renderAvatar(profile: ProfileDraft) {
  // การปะปน undefined และ null บังคับให้ผู้เรียกต้องคาดเดาความหมาย
  return profile.avatarUrl || "Use default avatar";
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดให้ฟิลด์ที่เป็นฉบับร่างหรือข้ามได้เป็น `?` ส่วนฟิลด์ที่มีในสกีมาแต่จงใจให้ว่างเป็น `string | null`.
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่ม **Domain Modeling Precision** ช่วยลดความสับสนและตรรกะซ้ำซ้อนในการตรวจสอบข้อมูล `null` กับ `undefined` ในแอปพลิเคชัน.
- **ตัวอย่างโค้ด:**

```typescript
// profile.ts
type ProfileDraft = {
  displayName?: string;
  avatarUrl: string | null;
};

function renderAvatar(profile: ProfileDraft) {
  // null หมายถึงไม่มีรูปภาพอย่างเจตนา ไม่ใช่แค่ลืมระบุ
  if (profile.avatarUrl === null) {
    return "Use default avatar";
  }
  return profile.avatarUrl;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ Optional Properties (`?`) เมื่อฟิลด์นั้นสามารถละเว้นได้ และใช้ Nullable Values (`null`) เมื่อฟิลด์นั้นมีอยู่แต่ยังไม่มีข้อมูลหรือจงใจให้ว่างเปล่า** เพื่อแยกแยะความหมายของการไม่มีข้อมูลให้ชัดเจน.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Generic Constraints (การจำกัดขอบเขตของ Generics ด้วย extends)

- **สรุปสาระสำคัญ:** **จำกัดขอบเขตของ Generics ด้วยคีย์เวิร์ด `extends`** เพื่อระบุคุณสมบัติขั้นต่ำที่ฟังก์ชันต้องการ โดยไม่ต้องละทิ้งความยืดหยุ่นของ Generic หรือใช้ `any`.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การสร้างฟังก์ชัน Generic `<T>` ที่ไม่จำกัดขอบเขต แต่แอบแปลงเป็น `any` ภายในฟังก์ชัน (`(left as any).updatedAt`). ทำลายความปลอดภัยของ Type และทำให้ผ่านการคอมไพล์แม้ว่าจะส่งวัตถุที่ไม่มีฟิลด์นั้นเข้ามา.
- **ตัวอย่างโค้ด:**

```typescript
// sort-by-updated.ts
function sortByUpdatedAt<T>(items: T[]): T[] {
  // การขาดข้อจำกัดทำให้ต้องใช้ any และเสี่ยงต่อข้อผิดพลาด Runtime
  return [...items].sort((left, right) =>
    (right as any).updatedAt.localeCompare((left as any).updatedAt)
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ข้อจำกัด `<T extends HasUpdatedAt>` เพื่อประกาศอย่างชัดเจนว่าประเภทข้อมูล `T` ใด ๆ ที่ส่งเข้ามา จะต้องมีพรอพเพอร์ตี้ `updatedAt` เสมอ.
- **ประโยชน์ทางสถาปัตยกรรม:** ยึดมั่นใน **Interface Segregation & Generic Flexibility** ทำให้ฟังก์ชันทำงานร่วมกับชนิดข้อมูลที่หลากหลายได้อย่างปลอดภัยโดยไม่สูญเสียการตรวจสอบของคอมไพเลอร์.
- **ตัวอย่างโค้ด:**

```typescript
// sort-by-updated.ts
type HasUpdatedAt = {
  updatedAt: string;
};

function sortByUpdatedAt<T extends HasUpdatedAt>(items: T[]): T[] {
  // ข้อจำกัดช่วยรักษาฟิลด์ที่จำเป็นไว้ในข้อตกลงของฟังก์ชัน
  return [...items].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt)
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** จำกัดขอบเขตของ Generics ด้วยคีย์เวิร์ด `extends`** เพื่อระบุคุณสมบัติขั้นต่ำที่ฟังก์ชันต้องการ โดยไม่ต้องละทิ้งความยืดหยุ่นของ Generic หรือใช้ `any`.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Utility Types at API Boundaries (การใช้ Pick, Omit เพื่อปกป้อง Internal Data)

- **สรุปสาระสำคัญ:** **ใช้ Utility Types เช่น `Pick`, `Omit`, `Partial`, หรือ `Readonly` ในการสร้าง Data Contracts ย่อยเฉพาะสำหรับ API** เพื่อไม่ให้เปิดเผยโครงสร้างข้อมูลภายใน (Domain Models) ออกไปทั้งหมด.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การคืนค่า Entity หรือ Domain Model ทั้งหมดจากฟังก์ชัน API. ซึ่งอาจเปิดเผยข้อมูลภายในที่ไม่เกี่ยวข้องหรือเป็นความลับ (เช่น `internalScore`) ออกไปยังผู้เรียกภายนอก.
- **ตัวอย่างโค้ด:**

```typescript
// review-api.ts
type PullRequest = {
  id: string;
  title: string;
  authorId: string;
  mergedAt: string | null;
  internalScore: number;
};

function serializePullRequest(item: PullRequest): PullRequest {
  // คืนค่าวัตถุโดเมนเต็มรูปแบบ รั่วไหลข้อมูลภายในออกไป
  return item;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ `Pick<PullRequest, "id" | "title" | "authorId">` สร้าง View/Response Type ใหม่ที่เลือกรวมเฉพาะฟิลด์ที่จำเป็นต้องใช้ตามข้อตกลงของ API.
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่ม **Encapsulation & Least Privilege Exposure** ลดความเสี่ยงข้อมูลรั่วไหล และช่วยสร้าง API DTO (Data Transfer Objects) ที่ชัดเจน.
- **ตัวอย่างโค้ด:**

```typescript
// review-api.ts
type PullRequest = {
  id: string;
  title: string;
  authorId: string;
  mergedAt: string | null;
  internalScore: number;
};

type PullRequestListItem = Pick<PullRequest, "id" | "title" | "authorId">;

function serializePullRequest(item: PullRequest): PullRequestListItem {
  // เลือกเปิดเผยเฉพาะฟิลด์ที่ขอบเขต API สัญญาไว้เท่านั้น
  return {
    id: item.id,
    title: item.title,
    authorId: item.authorId,
  };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ Utility Types เช่น `Pick`, `Omit`, `Partial`, หรือ `Readonly` ในการสร้าง Data Contracts ย่อยเฉพาะสำหรับ API** เพื่อไม่ให้เปิดเผยโครงสร้างข้อมูลภายใน (Domain Models) ออกไปทั้งหมด.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Type-Only Imports and Module Boundaries (การแยก Type Imports เพื่อประสิทธิภาพ Bundle)

- **สรุปสาระสำคัญ:** **ใช้ `import type` เมื่อต้องการนำเข้าเฉพาะชนิดข้อมูล (Types)** เพื่อแยก Type Dependencies ออกจาก Runtime Dependencies อย่างชัดเจน และช่วยให้ระบบโมดูลเบาและสะอาดขึ้น.

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การนำเข้า Type รวมกับ Runtime Values ในรูปแบบปกติ. ทำให้เส้นแบ่งขอบเขตโมดูลเลือนราง และอาจก่อให้เกิดการผูกมัดระดับ Runtime (Runtime Coupling) หรือเพิ่มขนาด Bundled Output โดยไม่จำเป็น.
- **ตัวอย่างโค้ด:**

```typescript
// review-card.ts
import { PullRequest } from "./pull-request";
import { formatAuthorName } from "./authors";

export function getReviewCardTitle(pullRequest: PullRequest) {
  // การนำเข้าประเภทข้อมูลแบบ Value Import ทำให้การแยกแยะการพึ่งพาไม่ชัดเจน
  return pullRequest.title + " by " + formatAuthorName(pullRequest.authorId);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกการนำเข้าด้วย `import type { PullRequest }` สำหรับชนิดข้อมูล และใช้ `import { formatAuthorName }` สำหรับฟังก์ชันที่ต้องประมวลผลจริง.
- **ประโยชน์ทางสถาปัตยกรรม:** สร้าง **Clean Module Boundaries & Tree-Shaking Optimization** ป้องกันการดึงรหัสที่ไม่ได้ใช้เข้าสู่ Runtime Environment.
- **ตัวอย่างโค้ด:**

```typescript
// review-card.ts
import type { PullRequest } from "./pull-request";
import { formatAuthorName } from "./authors";

export function getReviewCardTitle(pullRequest: PullRequest) {
  // import type จะช่วยตัด PullRequest ออกจาก Graph การประมวลผลจริง ณ Runtime
  return pullRequest.title + " by " + formatAuthorName(pullRequest.authorId);
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ `import type` เมื่อต้องการนำเข้าเฉพาะชนิดข้อมูล (Types)** เพื่อแยก Type Dependencies ออกจาก Runtime Dependencies อย่างชัดเจน และช่วยให้ระบบโมดูลเบาและสะอาดขึ้น.

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด TypeScript ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Type Inference and Explicit Boundaries:** นำหลักการ "การระบุ Type ที่ขอบเขตและให้ระบบอนุมานภายใน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Narrowing Unknown:** นำหลักการ "การตรวจสอบข้อมูล Unknown ผ่าน Runtime Validation และ Type Guards" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Avoiding Unsafe Assertions:** นำหลักการ "การหลีกเลี่ยง Type Assertions โดยไม่มีการพิสูจน์ที่ Runtime" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Discriminated Unions:** นำหลักการ "การใช้ Tagged Unions ป้องกัน Invalid State" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Exhaustive Checks with Never:** นำหลักการ "การบังคับตรวจสอบทุกกรณีด้วย Never Type" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Precise Function Types:** นำหลักการ "การระบุ Function Signatures อย่างเฉพาะเจาะจง" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Optional Properties vs Nullable Values:** นำหลักการ "การแยกแยะความหมายระหว่าง ? และ Null" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Generic Constraints:** นำหลักการ "การจำกัดขอบเขตของ Generics ด้วย extends" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Utility Types at API Boundaries:** นำหลักการ "การใช้ Pick, Omit เพื่อปกป้อง Internal Data" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Type-Only Imports and Module Boundaries:** นำหลักการ "การแยก Type Imports เพื่อประสิทธิภาพ Bundle" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

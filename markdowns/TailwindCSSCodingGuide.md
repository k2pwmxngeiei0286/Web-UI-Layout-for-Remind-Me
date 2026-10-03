# Tailwind CSS Scalable UI Architecture Guide
### คู่มือสถาปัตยกรรมและการเขียน Tailwind CSS สำหรับระบบขนาดใหญ่

> [!NOTE]
> - **หมวดหมู่ (Category):** Frontend Styling & Component Design
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Tailwind CSS v3/v4 Architecture, Mobile-First Design, Single Responsibility Utility Composition
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรมสำคัญของการเขียน Tailwind CSS เพื่อควบคุมความอ่านง่าย การจัดกลุ่มคลาส Mobile-First Breakpoints การจัดการ Interactive States และการกำหนด Component Boundaries
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Utility Composition Readability (ความอ่านง่ายของการประกอบ Utility Classes)](#หัวข้อที่-1-utility-composition-readability-ความอ่านง่ายของการประกอบ-utility-classes)
2. [หัวข้อที่ 2: Responsive Breakpoints (การจัดการ Responsive Breakpoints แบบ Mobile-First)](#หัวข้อที่-2-responsive-breakpoints-การจัดการ-responsive-breakpoints-แบบ-mobile-first)
3. [หัวข้อที่ 3: State Variants (Hover, Focus, Disabled) (การจัดการสถานะเชิงโต้ตอบครบทุกมิติ)](#หัวข้อที่-3-state-variants-hover-focus-disabled-การจัดการสถานะเชิงโต้ตอบครบทุกมิติ)
4. [หัวข้อที่ 4: Spacing and Layout Consistency (ความสม่ำเสมอของระยะห่างและ Layout Rhythm)](#หัวข้อที่-4-spacing-and-layout-consistency-ความสม่ำเสมอของระยะห่างและ-layout-rhythm)
5. [หัวข้อที่ 5: Theme Tokens and Custom Values (การใช้ Theme Tokens กับ Custom Values)](#หัวข้อที่-5-theme-tokens-and-custom-values-การใช้-theme-tokens-กับ-custom-values)
6. [หัวข้อที่ 6: Dark Mode Variants (การจัดการสไตล์ Dark Mode อย่างเป็นระบบ)](#หัวข้อที่-6-dark-mode-variants-การจัดการสไตล์-dark-mode-อย่างเป็นระบบ)
7. [หัวข้อที่ 7: Class Reuse and Component Boundaries (การใช้ Class ซ้ำและการกำหนดขอบเขต Component)](#หัวข้อที่-7-class-reuse-and-component-boundaries-การใช้-class-ซ้ำและการกำหนดขอบเขต-component)
8. [หัวข้อที่ 8: Arbitrary Values with Restraint (การใช้ Arbitrary Values อย่างระมัดระวัง)](#หัวข้อที่-8-arbitrary-values-with-restraint-การใช้-arbitrary-values-อย่างระมัดระวัง)
9. [หัวข้อที่ 9: Accessibility: Contrast and Focus (การเข้าถึง ความคมชัด และจุดโฟกัส a11y)](#หัวข้อที่-9-accessibility-contrast-and-focus-การเข้าถึง-ความคมชัด-และจุดโฟกัส-a11y)
10. [หัวข้อที่ 10: Conditional Classes and Conflicts (การผสานคลาสตามเงื่อนไขและการป้องกันความขัดแย้ง)](#หัวข้อที่-10-conditional-classes-and-conflicts-การผสานคลาสตามเงื่อนไขและการป้องกันความขัดแย้ง)

---

## หัวข้อที่ 1: Utility Composition Readability (ความอ่านง่ายของการประกอบ Utility Classes)

- **สรุปสาระสำคัญ:** การจัดกลุ่ม Tailwind Utility classes ตามวัตถุประสงค์และหน้าที่ (เช่น Layout, Color, State) เพื่อเพิ่มความอ่านง่ายและช่วยให้ผู้รีวิวโค้ดสามารถทำเข้าใจโครงสร้าง UI และตรวจสอบการขัดแย้งของคลาสได้ทันที

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** เขียน Utility Classes รวมกันเป็น String ยาวเหยียดบรรทัดเดียว โดยผสมผสานคลาสของ Layout, Color, State เข้าด้วยกันโดยไม่มีลำดับ ทำให้สแกนหาเจตนาของโค้ดยาก และอาจเปิดโอกาสให้เกิดการประกาศคลาสขัดแย้งกันโดยไม่ตั้งใจ (เช่น มีทั้ง `rounded-md` และ `rounded-lg` ใน String เดียวกัน)
- **ผลกระทบต่อระบบ:** เกิด **Maintenance Overhead** สูง อ่านโค้ดยาก สุ่มเสี่ยงต่อการเกิด UI Bugs จากคลาสที่ทับซ้อนกัน และทำให้กระบวนการ Code Review ล่าช้า
- **ตัวอย่างโค้ด:**

```tsx
// PrimaryButton.tsx
export function PrimaryButton({ children, disabled }) {
  // Class ยาวเหยียด ผสมเรื่อง layout, color, state และมี rounded ซ้ำซ้อนกัน
  return (
    <button
      disabled={disabled}
      className="px-4 text-white rounded-md h-10 bg-sky-600 text-sm hover:bg-sky-500 inline-flex shadow-sm items-center disabled:opacity-50 justify-center font-medium focus-visible:ring-2 gap-2 rounded-lg disabled:cursor-not-allowed focus-visible:ring-sky-300"
    >
      {children}
    </button>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สกัดการตัดสินใจเรื่อง Styling ออกเป็นตัวแปรกลุ่มความรับผิดชอบเฉพาะ (Single Responsibility Principle) เช่น การแยกโครงสร้างพื้นฐาน (`baseClasses`), โทนสีและเงา (`toneClasses`), และสไตล์สถานะโต้ตอบ (`stateClasses`) แล้วนำมารวมกันด้วย `.join(" ")`
- **ประโยชน์ทางสถาปัตยกรรม:** เพิ่ม **Readability** และ **Maintainability** ช่วยให้แยกแยะการแก้ไขสไตล์เฉพาะส่วนได้ง่าย ตรวจสอบคลาสซ้ำซ้อนได้ทันที
- **ตัวอย่างโค้ด:**

```tsx
// PrimaryButton.tsx
type PrimaryButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
};

// จัดกลุ่ม Layout และขนาด
const baseClasses =
  "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium";

// จัดกลุ่ม โทนสี เงา และ hover
const toneClasses =
  "bg-sky-600 text-white shadow-sm hover:bg-sky-500";

// จัดกลุ่ม Focus และ Disabled states
const stateClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50";

export function PrimaryButton({ children, disabled }: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[baseClasses, toneClasses, stateClasses].join(" ")}
    >
      {children}
    </button>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การจัดกลุ่ม Tailwind Utility classes ตามวัตถุประสงค์และหน้าที่ (เช่น Layout, Color, State) เพื่อเพิ่มความอ่านง่ายและช่วยให้ผู้รีวิวโค้ดสามารถทำเข้าใจโครงสร้าง UI และตรวจสอบการขัดแย้งของคลาสได้ทันที

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Responsive Breakpoints (การจัดการ Responsive Breakpoints แบบ Mobile-First)

- **สรุปสาระสำคัญ:** การออกแบบสถาปัตยกรรม Layout แบบ **Mobile-First** โดยใช้ Base classes สำหรับหน้าจอขนาดเล็กเป็นหลัก แล้วใช้ Breakpoint Overrides (`sm:`, `lg:`) เพิ่มจำนวนคอลัมน์หรือปรับระยะห่างเมื่อหน้าจอขยายขึ้น

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ล็อกขนาดองค์ประกอบไว้ด้วยความกว้างคงที่ (Fixed Desktop Width เช่น `w-[960px]`) และจำนวนคอลัมน์แบบเด็ดขาด ทำให้หน้าจอขนาดเล็กไม่สามารถยืดหยุ่นได้
- **ผลกระทบต่อระบบ:** เกิดปัญหา **Layout Overflow** หรือคอนเทนต์ถูกบีบอัดจนเสียรูปบนสมาร์ทโฟนและแท็บเล็ต ไม่รองรับการแสดงผลแบบยืดหยุ่น (Scalable Responsive UI)
- **ตัวอย่างโค้ด:**

```tsx
// LessonGrid.tsx
export function LessonGrid({ lessons }) {
  // ล็อกขนาด Desktop แบบเด็ดขาด ทำให้เกิดปัญหาในหน้าจอขนาดเล็ก
  return (
    <section className="mx-auto w-[960px] px-[32px] py-[40px]">
      <div className="grid grid-cols-3 gap-[18px]">
        {lessons.map((lesson) => (
          <a key={lesson.slug} href={lesson.href} className="rounded-md border p-4">
            {lesson.title}
          </a>
        ))}
      </div>
    </section>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** เริ่มต้นจาก Layout สำหรับจอมือถือ (1 คอลัมน์) แล้วขยายคอลัมน์ตามขนาดพื้นที่หน้าจอผ่าน Breakpoints (`sm:grid-cols-2`, `lg:grid-cols-3`) พร้อมกำหนดความกว้างสูงสุดยืดหยุ่น (`w-full max-w-6xl`)
- **ประโยชน์ทางสถาปัตยกรรม:** ให้ความยืดหยุ่นสูง (**Fluid Responsiveness**), โค้ดอ่านง่ายจากซ้ายไปขวา (Base Style -> Breakpoint Override) และการแสดงผลสมบูรณ์ทุกอุปกรณ์
- **ตัวอย่างโค้ด:**

```tsx
// LessonGrid.tsx
export function LessonGrid({ lessons }: { lessons: Lesson[] }) {
  // Base class สำหรับมือถือ แล้วขยายคอลัมน์เมื่อพื้นที่เพิ่มขึ้นด้วย sm และ lg
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <a
            key={lesson.slug}
            href={lesson.href}
            className="rounded-md border border-slate-200 p-4 hover:border-sky-400"
          >
            {lesson.title}
          </a>
        ))}
      </div>
    </section>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การออกแบบสถาปัตยกรรม Layout แบบ **Mobile-First** โดยใช้ Base classes สำหรับหน้าจอขนาดเล็กเป็นหลัก แล้วใช้ Breakpoint Overrides (`sm:`, `lg:`) เพิ่มจำนวนคอลัมน์หรือปรับระยะห่างเมื่อหน้าจอขยายขึ้น

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: State Variants (Hover, Focus, Disabled) (การจัดการสถานะเชิงโต้ตอบครบทุกมิติ)

- **สรุปสาระสำคัญ:** การกำหนดสไตล์องค์ประกอบเชิงโต้ตอบ (Interactive Controls) ให้ครอบคลุมทุกสถานะการใช้งานจริง ทั้ง Mouse Hover, Keyboard Focus, และ Disabled State ไม่ใช่สนใจแค่สถานะ Hover เพียงอย่างเดียว

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** สนใจเฉพาะเอฟเฟกต์ Mouse Hover และตัดสไตล์ Focus ทิ้งด้วย `outline-none` โดยไม่มีสไตล์ทดแทน รวมถึงไม่เปลี่ยนรูปลักษณ์หรือ Pointer Behavior เมื่อปุ่มอยู่ในสถานะ Disabled
- **ผลกระทบต่อระบบ:** ทำลาย **Accessibility (a11y)** ผู้ใช้ที่พึ่งพาแป้นพิมพ์มองไม่เห็นตำแหน่งโฟกัส และผู้ใช้สับสนเมื่อกดปุ่มที่อยู่ในสถานะ Disabled แต่ยังมีสีสันเหมือนปุ่มปกติ
- **ตัวอย่างโค้ด:**

```tsx
// SubmitButton.tsx
export function SubmitButton({ isSaving }) {
  // outline-none ตัด focus indicator ของแป้นพิมพ์ และไม่มีสไตล์สำหรับ disabled
  return (
    <button
      disabled={isSaving}
      className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-500 outline-none"
    >
      Save
    </button>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตกแต่งสไตล์ให้ครบทุกสถานะแบบชัดเจน ได้แก่ สภาวะปกติ, Hover (`hover:`), Keyboard Focus (`focus-visible:ring-2`), และ Disabled (`disabled:cursor-not-allowed disabled:bg-slate-300`)
- **ประโยชน์ทางสถาปัตยกรรม:** ได้มาตรฐาน **Accessibility & Usability** ผู้ใช้ทุกกลุ่ม (รวมถึงผู้ใช้ Screen Reader หรือ Keyboard Navigation) ใช้งานได้อย่างถูกต้องแม่นยำ
- **ตัวอย่างโค้ด:**

```tsx
// SubmitButton.tsx
export function SubmitButton({ isSaving }: { isSaving: boolean }) {
  // ครอบคลุมทั้ง hover, keyboard focus และ disabled states
  return (
    <button
      type="submit"
      disabled={isSaving}
      className="inline-flex h-10 items-center rounded-md bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
    >
      {isSaving ? "Saving" : "Save"}
    </button>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การกำหนดสไตล์องค์ประกอบเชิงโต้ตอบ (Interactive Controls) ให้ครอบคลุมทุกสถานะการใช้งานจริง ทั้ง Mouse Hover, Keyboard Focus, และ Disabled State ไม่ใช่สนใจแค่สถานะ Hover เพียงอย่างเดียว

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Spacing and Layout Consistency (ความสม่ำเสมอของระยะห่างและ Layout Rhythm)

- **สรุปสาระสำคัญ:** การใช้ระบบ Spacing Scale และ Layout Rhythm ที่เป็นมาตรฐานร่วมกันของโปรเจกต์ หลีกเลี่ยงการหยอดค่า Pixel แบบเฉพาะกิจ (One-off Pixel Nudges)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใช้ Arbitrary Spacing Values สุ่มปรับตำแหน่งไปมา (เช่น `p-[19px]`, `mb-[14px]`, `ml-[2px]`) เพื่อให้หน้าตาตรงตามภาพ Screenshot เฉพาะหน้า
- **ผลกระทบต่อระบบ:** ทำลายความสม่ำเสมอของ Design System เกิด **Fragile Layout** ที่ปรับแต่งหรือแก้ไขเพิ่มเติมในอนาคตได้ยาก
- **ตัวอย่างโค้ด:**

```tsx
// ReviewPanel.tsx
export function ReviewPanel({ title, items }) {
  // ใช้ค่าพิกเซลแบบสุ่มเพื่อแก้สไตล์เฉพาะหน้า ทำให้จังหวะระยะห่างไม่สม่ำเสมอ
  return (
    <section className="rounded-md border bg-white p-[19px]">
      <div className="mt-[3px]">
        <h2 className="mb-[14px] ml-[2px] text-[17px] font-semibold">{title}</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id} className="mb-[7px] rounded-md bg-slate-50 px-[11px] py-[9px]">
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ประโยชน์จากระบบ Spacing Scale ของ Tailwind (เช่น `p-4`, `p-3`) ร่วมกับโครงสร้าง Vertical Rhythm เช่น `space-y-3` และ `space-y-2` เพื่อกำหนดระยะห่างระหว่างองค์ประกอบย่อย
- **ประโยชน์ทางสถาปัตยกรรม:** เกิด **Layout Predictability & Rhythm** หน้าตา UI เรียบร้อยสม่ำเสมอทั้งระบบ และดูแลรักษาง่าย
- **ตัวอย่างโค้ด:**

```tsx
// ReviewPanel.tsx
export function ReviewPanel({ title, items }: ReviewPanelProps) {
  // ใช้ระยะห่างมาตรฐานและ space-y เพื่อจัดจังหวะแนวตั้งอย่างเป็นระบบ
  return (
    <section className="rounded-md border border-slate-200 bg-white p-4">
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-950">{title}</h2>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้ระบบ Spacing Scale และ Layout Rhythm ที่เป็นมาตรฐานร่วมกันของโปรเจกต์ หลีกเลี่ยงการหยอดค่า Pixel แบบเฉพาะกิจ (One-off Pixel Nudges)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Theme Tokens and Custom Values (การใช้ Theme Tokens กับ Custom Values)

- **สรุปสาระสำคัญ:** การใช้ชื่อ Theme Tokens (เช่น `bg-brand-600`) สำหรับค่าการออกแบบที่ใช้งานร่วมกันในระดับแบรนด์/องค์กร และสงวน Arbitrary Custom Values ไว้เฉพาะข้อยกเว้นพิเศษจริง ๆ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ฝังค่าสี Hex Code (เช่น `#2563eb`), ขนาดพิกเซล และค่า Shadow แบบเฉพาะเจาะจงลงในระดับ Component โดยตรง
- **ผลกระทบต่อระบบ:** ขาด **Single Source of Truth** หากต้องการรีแบรนด์หรือปรับโทนสีระบบ จะต้องตามแก้ไขโค้ดทีละไฟล์ ทำให้เกิดข้อผิดพลาดสูง
- **ตัวอย่างโค้ด:**

```tsx
// PlanBadge.tsx
export function PlanBadge({ plan }) {
  // Hardcode ค่าสี Hex และค่า Pixel ลงในส่วนประกอบโดยตรง
  return (
    <span className="inline-flex items-center rounded-[5px] bg-[#2563eb] px-[13px] py-[5px] text-[12px] font-semibold text-white shadow-[0_1px_2px_rgba(37,99,235,0.24)] ring-1 ring-[#3b82f6]">
      {plan === "team" ? "Team" : "Pro"}
    </span>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดชื่อแบรนด์หรือสไตล์กลางลงในระบบ Theme แล้วเรียกใช้ผ่าน Utility Classes ที่มีชื่อชัดเจน เช่น `bg-brand-600`, `ring-brand-500`
- **ประโยชน์ทางสถาปัตยกรรม:** ได้เรื่อง **Centralized Design System**, เพิ่ม Reusability และสามารถหารือปรับแก้สไตล์ร่วมกับทีมผ่านชื่อ Token ได้โดยตรง
- **ตัวอย่างโค้ด:**

```tsx
// PlanBadge.tsx
export function PlanBadge({ plan }: { plan: "team" | "pro" }) {
  // เรียกใช้ Theme Tokens ที่ตั้งชื่อไว้ ทำให้จุดตัดสินใจดีไซน์ถูกดูแลที่ศูนย์กลาง
  return (
    <span className="inline-flex items-center rounded-md bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm ring-1 ring-brand-500">
      {plan === "team" ? "Team" : "Pro"}
    </span>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้ชื่อ Theme Tokens (เช่น `bg-brand-600`) สำหรับค่าการออกแบบที่ใช้งานร่วมกันในระดับแบรนด์/องค์กร และสงวน Arbitrary Custom Values ไว้เฉพาะข้อยกเว้นพิเศษจริง ๆ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Dark Mode Variants (การจัดการสไตล์ Dark Mode อย่างเป็นระบบ)

- **สรุปสาระสำคัญ:** การจับคู่สไตล์ Light Mode และ Dark Mode ร่วมกันในทุกเลเยอร์ของคอมโพเนนต์ ตั้งแต่พื้นผิว (Surface), เส้นขอบ (Border), ข้อความ (Text Hierarchy) ไปจนถึงสีลิงก์

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** กำหนดคลาส `dark:` เฉพาะส่วนที่เห็นชัดที่สุด เช่น หัวข้อ แต่ละเลยการกำหนดสไตล์ Dark Mode ให้กับพื้นหลังหรือข้อความบรรยาย
- **ผลกระทบต่อระบบ:** เกิด **Visual Contrast Bug** การ์ดยังคงมีพื้นหลังสว่างจ้าโผล่ขึ้นมากลางหน้าจอในโหมดมืด ทำให้ข้อความอ่านไม่ได้และเสียความสมบูรณ์ของธีม
- **ตัวอย่างโค้ด:**

```tsx
// CodeReviewCard.tsx
export function CodeReviewCard({ title, summary }) {
  // เปลี่ยนเฉพาะสีหัวข้อใน dark mode แต่ปล่อยให้พื้นหลังเป็นสีขาวและเนื้อหาเป็นสีสว่าง
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">
      <h2 className="text-base font-semibold dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{summary}</p>
      <a href="#" className="mt-4 inline-flex text-sm font-medium text-sky-700">
        Review lesson
      </a>
    </article>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** จับคู่สไตล์ Light/Dark ในทุกองค์ประกอบที่ส่งผลต่อคอนทราสต์อย่างสอดคล้องกัน (`bg-white dark:bg-slate-950`, `border-slate-200 dark:border-slate-800`, `text-slate-600 dark:text-slate-300`)
- **ประโยชน์ทางสถาปัตยกรรม:** **Theme Completeness & Integrity** สอดคล้องกับมาตรฐานสายตา อ่านง่าย และพร้อมใช้งานทุกสภาวะแสง
- **ตัวอย่างโค้ด:**

```tsx
// CodeReviewCard.tsx
export function CodeReviewCard({ title, summary }: CodeReviewCardProps) {
  // จับคู่สไตล์ Light และ Dark ไว้ด้วยกันทั้งพื้นผิว ขอบ ข้อความ และลิงก์
  return (
    <article className="rounded-md border border-slate-200 bg-white p-4 text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <h2 className="text-base font-semibold text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{summary}</p>
      <a
        href="#"
        className="mt-4 inline-flex text-sm font-medium text-sky-700 hover:text-sky-600 dark:text-sky-300 dark:hover:text-sky-200"
      >
        Review lesson
      </a>
    </article>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การจับคู่สไตล์ Light Mode และ Dark Mode ร่วมกันในทุกเลเยอร์ของคอมโพเนนต์ ตั้งแต่พื้นผิว (Surface), เส้นขอบ (Border), ข้อความ (Text Hierarchy) ไปจนถึงสีลิงก์

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Class Reuse and Component Boundaries (การใช้ Class ซ้ำและการกำหนดขอบเขต Component)

- **สรุปสาระสำคัญ:** การสกัดชุดคลาสที่ใช้ซ้ำ ณ จุดขอบเขตของ Component (Component Boundary) แทนที่จะคัดลอก String คลาสยาวๆ ไปวางซ้ำกันหลายจุดในไฟล์เรียกใช้

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** เขียนซ้ำโครงสร้าง Tailwind เดียวกันในทุก Branch ของการตรวจสอบเงื่อนไข (เช่น แต่ละเงื่อนไขของสถานะ `passed`, `failed`, `pending`)
- **ผลกระทบต่อระบบ:** ละเมิดหลักการ **DRY (Don't Repeat Yourself)** เกิดความเสี่ยงสูงเมื่อมีการแก้ไขดีไซน์ในอนาคต เพราะต้องตามแก้ทุก Branch และอาจตกหล่น
- **ตัวอย่างโค้ด:**

```tsx
// ReviewList.tsx
export function ReviewList({ reviews }) {
  // แต่ละ branch คัดลอกคลาสโครงสร้างซ้ำกัน เสี่ยงต่อการเกิดโค้ดเบี่ยงเบน (drift)
  return (
    <ul>
      {reviews.map((review) => (
        <li key={review.id}>
          {review.status === "passed" && <span className="inline-flex rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">passed</span>}
          {review.status === "failed" && <span className="inline-flex rounded-md bg-rose-50 px-2 py-1 text-xs font-medium text-rose-700 ring-1 ring-rose-200">failed</span>}
          {review.status === "pending" && <span className="inline-flex rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200">pending</span>}
        </li>
      ))}
    </ul>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สร้าง Component เฉพาะ (`ReviewStatusBadge`) และรวบรวมคลาสตัวแปรสีไว้ใน Map Object ที่มีการระบุ Type ปลอดภัย (`statusClasses`)
- **ประโยชน์ทางสถาปัตยกรรม:** **Encapsulation & Modularity** แก้ไขโครงสร้าง UI ได้ ณ จุดเดียว มี Type Safety ชัดเจน
- **ตัวอย่างโค้ด:**

```tsx
// ReviewStatusBadge.tsx
const statusClasses = {
  // Map เดียวทำหน้าที่ดูแลตัวแปรสีสำหรับทุกๆ สถานะ
  passed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-rose-50 text-rose-700 ring-rose-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
} as const;

export function ReviewStatusBadge({ status }: { status: keyof typeof statusClasses }) {
  // โครงสร้างป้าย badge ถูกจำกัดขอบเขตไว้อยู่ในคอมโพเนนต์เดียว
  return (
    <span className={["inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1", statusClasses[status]].join(" ")}>
      {status}
    </span>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การสกัดชุดคลาสที่ใช้ซ้ำ ณ จุดขอบเขตของ Component (Component Boundary) แทนที่จะคัดลอก String คลาสยาวๆ ไปวางซ้ำกันหลายจุดในไฟล์เรียกใช้

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Arbitrary Values with Restraint (การใช้ Arbitrary Values อย่างระมัดระวัง)

- **สรุปสาระสำคัญ:** ใช้ Arbitrary Values (ค่าในวงเล็บ `[...]`) เฉพาะในกรณีที่ต้องการกำหนดข้อจำกัด Layout พิเศษจริง ๆ เท่านั้น ไม่ใช่ใช้ทดแทน Design Scale หลักของระบบ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใส่ Bracket Values ให้กับคุณสมบัติเกือบทุกตัวใน Element เช่น `w-[417px]`, `gap-[11px]`, `rounded-[7px]`, `bg-[#f1f5f9]`
- **ผลกระทบต่อระบบ:** คอมโพเนนต์หลุดออกจากระบบดีไซน์หลัก โค้ดอ่านยาก และทำลายความเป็นเอกภาพของ UI โดยรวม
- **ตัวอย่างโค้ด:**

```tsx
// CommandRow.tsx
export function CommandRow({ label, shortcut }) {
  // การใช้ค่า bracket พิกเซลและสี hex ในทุกจุดทำให้หลุดออกจากดีไซน์สเกลหลัก
  return (
    <div className="grid grid-cols-[417px_68px] items-center gap-[11px] rounded-[7px] px-[13px] py-[9px] text-[13.5px] hover:bg-[#f1f5f9]">
      <span className="max-w-[391px] truncate text-[#1f2937]">{label}</span>
      <kbd className="rounded-[3px] border border-[#e2e8f0] bg-[#ffffff] px-[5px] py-[2px] text-[11px] text-[#64748b]">
        {shortcut}
      </kbd>
    </div>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ Arbitrary Value เฉพาะส่วนที่เป็นข้อจำกัดจริงของ Layout (เช่น `grid-cols-[minmax(0,1fr)_auto]`) ส่วนที่เหลือให้กลับมาใช้สเกลมาตรฐานของโปรเจกต์
- **ประโยชน์ทางสถาปัตยกรรม:** มี **Precision** ในจุดที่จำเป็น และรักษา **Systemic Consistency** ของทั้งโปรเจกต์ไว้ได้
- **ตัวอย่างโค้ด:**

```tsx
// CommandRow.tsx
export function CommandRow({ label, shortcut }: CommandRowProps) {
  // ใช้ arbitrary grid template เดียวเพื่อจับโครงสร้าง layout นอกนั้นใช้สเกลมาตรฐาน
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-slate-100">
      <span className="truncate text-slate-800">{label}</span>
      <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-500">
        {shortcut}
      </kbd>
    </div>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Arbitrary Values (ค่าในวงเล็บ `[...]`) เฉพาะในกรณีที่ต้องการกำหนดข้อจำกัด Layout พิเศษจริง ๆ เท่านั้น ไม่ใช่ใช้ทดแทน Design Scale หลักของระบบ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Accessibility: Contrast and Focus (การเข้าถึง ความคมชัด และจุดโฟกัส a11y)

- **สรุปสาระสำคัญ:** การสร้าง Accessible Icon-only Controls ให้มีข้อความกำกับสำหรับ Screen Reader (`sr-only`), มี Contrast ที่ชัดเจน และแสดง Visible Focus Ring เมื่อใช้งานผ่านแป้นพิมพ์

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** สร้างปุ่มที่มีเฉพาะไอคอนโดยไม่มีข้อความอธิบาย (Accessible Label), ตัด Focus Outline และใช้สีที่มี Contrast ต่ำสุ่มเสี่ยงต่อการมองไม่เห็น
- **ผลกระทบต่อระบบ:** สัมผัสกับ **Accessibility Violation** ผู้ใช้ผู้พิการทางสายตาหรือผู้ใช้ที่ใช้ Keyboard Navigation ไม่สามารถระบุหน้าที่หรือตำแหน่งของปุ่มได้
- **ตัวอย่างโค้ด:**

```tsx
// CopyLinkButton.tsx
export function CopyLinkButton() {
  // ไม่มี label และใช้ outline-none ทำให้ปุ่มไอคอนนี้ใช้งานได้ยากมาก
  return (
    <button className="h-9 w-9 rounded-md bg-slate-200 text-slate-300 outline-none hover:bg-slate-300">
      <LinkIcon className="mx-auto h-4 w-4" />
    </button>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดสเปกความคมชัดอย่างเหมาะสม ซ่อนไอคอนสำหรับ Screen Reader ด้วย `aria-hidden="true"`, เพิ่มซ่อนข้อความกำกับด้วย `sr-only`, และเพิ่ม Visible Focus Ring ชัดเจน
- **ประโยชน์ทางสถาปัตยกรรม:** ได้มาตรฐาน **WCAG / Accessibility Compliance** ช่วยให้ทุกคนเข้าถึงฟังก์ชันของ UI ได้อย่างเท่าเทียม
- **ตัวอย่างโค้ด:**

```tsx
// CopyLinkButton.tsx
export function CopyLinkButton() {
  // มีค่า Contrast, Visible Focus Ring และข้อความ sr-only ช่วยให้ใช้งานได้สมบูรณ์
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
    >
      <LinkIcon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">Copy lesson link</span>
    </button>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การสร้าง Accessible Icon-only Controls ให้มีข้อความกำกับสำหรับ Screen Reader (`sr-only`), มี Contrast ที่ชัดเจน และแสดง Visible Focus Ring เมื่อใช้งานผ่านแป้นพิมพ์

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Conditional Classes and Conflicts (การผสานคลาสตามเงื่อนไขและการป้องกันความขัดแย้ง)

- **สรุปสาระสำคัญ:** การเขียน Conditional Class Lists โดยให้สภาวะที่เป็นขั้วตรงข้ามกัน (Mutually Exclusive States) ไม่ปล่อย Utility Classes ที่ขัดแย้งกันออกมาใน String เดียวกัน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** นำเงื่อนไขหลายตัวมาต่อกันตรงๆ ทำให้ปล่อยคลาสที่ขัดแย้งกันออกมาใน String เดียวกัน เช่น มีทั้ง `bg-white` และ `bg-sky-600` หรือ `opacity-50` และ `opacity-100`
- **ผลกระทบต่อระบบ:** เกิด **Non-deterministic Styling** (ผลลัพธ์ของสไตล์ขึ้นอยู่กับลำดับกฎ CSS ภายใน Tailwind CSS Output ไม่ใช่ลำดับคลาสใน HTML) ทำให้การคาดเดาและตรวจสอบสไตล์ยากลำบาก
- **ตัวอย่างโค้ด:**

```tsx
// SegmentedOption.tsx
export function SegmentedOption({ selected, disabled, children }) {
  // เงื่อนไขหลายตัวส่งผลให้เกิดคลาส bg, text และ opacity ที่ขัดแย้งกันใน string เดียว
  const className = [
    "rounded-md px-3 py-1.5 text-sm font-medium",
    "bg-white text-slate-700 hover:bg-slate-50",
    selected && "bg-sky-600 text-white",
    disabled && "opacity-50 bg-white",
    !disabled && "opacity-100",
  ].filter(Boolean).join(" ");

  return <button disabled={disabled} className={className}>{children}</button>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ Ternary Operators หรือเครื่องมืออย่าง `clsx` แยกสไตล์ระหว่างสถานะ Selected และ Unselected ออกเป็นสองทางเลือกเด็ดขาด แล้วซ้อนทับสไตล์ Disabled อย่างมีลำดับขั้นตอน
- **ประโยชน์ทางสถาปัตยกรรม:** **Clear State Logic & Predictability** สไตล์ทำงานถูกต้องตามเงื่อนไข ปราศจากปัญหา CSS Conflict
- **ตัวอย่างโค้ด:**

```tsx
// SegmentedOption.tsx
import clsx from "clsx";

export function SegmentedOption({ selected, disabled, children }: SegmentedOptionProps) {
  // สไตล์ selected และ unselected แยกกันเด็ดขาด ป้องกันปัญหาการชนกันของสีพื้นหลัง
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "rounded-md px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        selected ? "bg-sky-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50",
        disabled && "cursor-not-allowed opacity-50 hover:bg-white",
      )}
    >
      {children}
    </button>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การเขียน Conditional Class Lists โดยให้สภาวะที่เป็นขั้วตรงข้ามกัน (Mutually Exclusive States) ไม่ปล่อย Utility Classes ที่ขัดแย้งกันออกมาใน String เดียวกัน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด Tailwind CSS ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Utility Composition Readability:** นำหลักการ "ความอ่านง่ายของการประกอบ Utility Classes" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Responsive Breakpoints:** นำหลักการ "การจัดการ Responsive Breakpoints แบบ Mobile-First" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **State Variants (Hover, Focus, Disabled):** นำหลักการ "การจัดการสถานะเชิงโต้ตอบครบทุกมิติ" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Spacing and Layout Consistency:** นำหลักการ "ความสม่ำเสมอของระยะห่างและ Layout Rhythm" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Theme Tokens and Custom Values:** นำหลักการ "การใช้ Theme Tokens กับ Custom Values" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Dark Mode Variants:** นำหลักการ "การจัดการสไตล์ Dark Mode อย่างเป็นระบบ" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Class Reuse and Component Boundaries:** นำหลักการ "การใช้ Class ซ้ำและการกำหนดขอบเขต Component" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Arbitrary Values with Restraint:** นำหลักการ "การใช้ Arbitrary Values อย่างระมัดระวัง" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Accessibility: Contrast and Focus:** นำหลักการ "การเข้าถึง ความคมชัด และจุดโฟกัส a11y" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Conditional Classes and Conflicts:** นำหลักการ "การผสานคลาสตามเงื่อนไขและการป้องกันความขัดแย้ง" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

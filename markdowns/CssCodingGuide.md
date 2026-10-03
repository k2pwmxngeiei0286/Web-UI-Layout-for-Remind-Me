# Modern CSS Architecture & Styling Guide
### คู่มือแนวทางการเขียน CSS สมัยใหม่: Best Practices & Clean Architecture

> [!NOTE]
> - **หมวดหมู่ (Category):** Frontend Styling & Design Systems
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Modern CSS, CSS Logical Properties, Flexbox & Grid, WCAG Color Contrast, Container Queries
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 แนวทางสถาปัตยกรรมการเขียน Modern CSS เปรียบเทียบระหว่าง Anti-Pattern และ Best Practice เพื่อสร้างสไตล์ชีตที่คาดเดาได้ ยืดหยุ่น รองรับการบำรุงรักษา และคำนึงถึง Accessibility
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Box Model Sizing (การกำหนดขนาดมิติของ Box Model)](#หัวข้อที่-1-box-model-sizing-การกำหนดขนาดมิติของ-box-model)
2. [หัวข้อที่ 2: Cascade and Specificity (การจัดการลำดับชั้นและความเจาะจงของ Selector)](#หัวข้อที่-2-cascade-and-specificity-การจัดการลำดับชั้นและความเจาะจงของ-selector)
3. [หัวข้อที่ 3: Color Contrast States (การรักษาระดับความต่างสีในสถานะโต้ตอบ)](#หัวข้อที่-3-color-contrast-states-การรักษาระดับความต่างสีในสถานะโต้ตอบ)
4. [หัวข้อที่ 4: Custom Properties as Design Tokens (การใช้ CSS Variables เป็น Design Tokens)](#หัวข้อที่-4-custom-properties-as-design-tokens-การใช้-css-variables-เป็น-design-tokens)
5. [หัวข้อที่ 5: Flex Layout Boundaries (การกำหนดขอบเขตระยะห่างด้วย Flexbox)](#หัวข้อที่-5-flex-layout-boundaries-การกำหนดขอบเขตระยะห่างด้วย-flexbox)
6. [หัวข้อที่ 6: Grid Layout Tracks (การใช้ CSS Grid Tracks สำหรับ Responsive Layout)](#หัวข้อที่-6-grid-layout-tracks-การใช้-css-grid-tracks-สำหรับ-responsive-layout)
7. [หัวข้อที่ 7: Logical Properties (การใช้ Logical Properties รองรับทิศทางการอ่าน)](#หัวข้อที่-7-logical-properties-การใช้-logical-properties-รองรับทิศทางการอ่าน)
8. [หัวข้อที่ 8: Motion and Reduced Motion (การจัดการ Animation และ Prefers-Reduced-Motion)](#หัวข้อที่-8-motion-and-reduced-motion-การจัดการ-animation-และ-prefers-reduced-motion)
9. [หัวข้อที่ 9: Responsive Units (การใช้หน่วยวัดแบบมีขอบเขต (Clamp & Container Queries))](#หัวข้อที่-9-responsive-units-การใช้หน่วยวัดแบบมีขอบเขต-clamp-container-queries)
10. [หัวข้อที่ 10: State Selectors and Focus-Visible (การแยก State Selectors และการรองรับ Keyboard Focus)](#หัวข้อที่-10-state-selectors-and-focus-visible-การแยก-state-selectors-และการรองรับ-keyboard-focus)

---

## หัวข้อที่ 1: Box Model Sizing (การกำหนดขนาดมิติของ Box Model)

- **สรุปสาระสำคัญ:** การกำหนดสไตล์ให้มิติและขนาดขององค์ประกอบคาดเดาได้ง่าย เมื่อ padding และ border ถูกนับเป็นส่วนหนึ่งของส่วนประกอบ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ไม่ได้กำหนด `box-sizing: border-box` ทำให้ขนาดกว้างจริงที่แสดงผล (rendered width) ขยายใหญ่เกินกว่าขนาด `width` ที่ประกาศไว้เมื่อมีการเพิ่ม padding และ border รวมถึงการระบุขนาดคงที่ให้สื่อมีเดียแทนที่จะให้ปรับขนาดตามส่วนประกอบ
- **ตัวอย่างโค้ด:**

```css
/* pricing-card.css */
.pricing-card {
  /* Width ignores padding and border, so the real footprint is larger. */
  width: 24rem;
  padding: 24px;
  border: 1px solid #d8dee8;
}

.pricing-card__media {
  width: 24rem;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้การกำหนด `box-sizing: border-box` ให้กับทุก element เพื่อให้ความกว้างที่ประกาศครอบคลุมทั้ง padding และ border ช่วยให้ส่วนประกอบย่อขนาดตามคอนเทนเนอร์ที่แคบลงได้โดยไม่เกิดปัญหา overflow
- **ตัวอย่างโค้ด:**

```css
/* pricing-card.css */
*, *::before, *::after {
  /* Border-box keeps declared sizes honest when padding and borders grow. */
  box-sizing: border-box;
}

.pricing-card {
  width: min(100%, 24rem);
  padding: 1.5rem;
  border: 1px solid #d8dee8;
}

.pricing-card__media {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การกำหนดสไตล์ให้มิติและขนาดขององค์ประกอบคาดเดาได้ง่าย เมื่อ padding และ border ถูกนับเป็นส่วนหนึ่งของส่วนประกอบ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Cascade and Specificity (การจัดการลำดับชั้นและความเจาะจงของ Selector)

- **สรุปสาระสำคัญ:** การควบคุม selector ให้กระชับและมีความเจาะจง (specificity) ต่ำ เพื่อให้สามารถ override สไตล์ได้อย่างตั้งใจและเป็นระบบ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** พึ่งพาการระบุ selector ที่ลึกมาก ร่วมกับ ID selector และการใช้ `!important` ซึ่งทำให้โค้ดผูกติดกับโครงสร้าง DOM และยากต่อการปรับเปลี่ยนสไตล์ในอนาคต
- **ตัวอย่างโค้ด:**

```css
/* profile-card.css */
#app main .profile-card.featured div h2 .title {
  /* This selector wins by force instead of describing component intent. */
  color: #0f172a !important;
}

#app main .profile-card div h2 .title {
  color: #475569;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ component class และ modifier class สั้นๆ ช่วยให้มองเห็นความเป็นเจ้าของสไตล์ของแต่ละสถานะได้อย่างชัดเจน และง่ายต่อการตรวจสอบหรือ override สไตล์
- **ตัวอย่างโค้ด:**

```css
/* profile-card.css */
.profile-card {
  /* Low-specificity component classes keep ownership easy to review. */
  color: #172033;
  background: #ffffff;
  border: 1px solid #d8dee8;
}

.profile-card--featured {
  border-color: #2563eb;
}

.profile-card__title {
  color: #0f172a;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การควบคุม selector ให้กระชับและมีความเจาะจง (specificity) ต่ำ เพื่อให้สามารถ override สไตล์ได้อย่างตั้งใจและเป็นระบบ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Color Contrast States (การรักษาระดับความต่างสีในสถานะโต้ตอบ)

- **สรุปสาระสำคัญ:** การกำหนดสถานะการโต้ตอบ (interactive states) ของอินเทอร์เฟซให้รักษาระดับความต่างสี (contrast) ที่มองเห็นและอ่านได้ง่าย

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเปลี่ยนสีในสถานะ hover หรือ focus มีค่า contrast ต่ำเกินไป และพึ่งพาการเปลี่ยนสีเพียงอย่างเดียว ทำให้ผู้ใช้สังเกตการเปลี่ยนแปลงหรืออ่านข้อความได้ยาก
- **ตัวอย่างโค้ด:**

```css
/* primary-action.css */
.primary-action {
  /* Low-contrast state changes are hard to perceive or read. */
  color: #7b8794;
  background: #eef2f7;
  border: 1px solid #d8dee8;
}

.primary-action:hover,
.primary-action:focus {
  color: #9aa4b2;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดสีพื้นหลังและข้อความให้คงระดับ contrast ที่ดีในทุกสถานะ พร้อมทั้งใส่เส้นขอบโฟกัส (`:focus-visible`) ที่มีออฟเซ็ตชัดเจนสำหรับการใช้งานด้วยแป้นพิมพ์
- **ตัวอย่างโค้ด:**

```css
/* primary-action.css */
.primary-action {
  /* Base and state colors keep readable contrast. */
  color: #ffffff;
  background: #174ea6;
  border: 2px solid #174ea6;
}

.primary-action:hover {
  background: #0b3478;
}

.primary-action:focus-visible {
  outline: 3px solid #f9ab00;
  outline-offset: 2px;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การกำหนดสถานะการโต้ตอบ (interactive states) ของอินเทอร์เฟซให้รักษาระดับความต่างสี (contrast) ที่มองเห็นและอ่านได้ง่าย

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Custom Properties as Design Tokens (การใช้ CSS Variables เป็น Design Tokens)

- **สรุปสาระสำคัญ:** การนำ CSS Custom Properties มาใช้ตั้งชื่อแทนค่าการดีไซน์ที่ใช้ร่วมกัน (design tokens) เพื่อหลีกเลี่ยงการใส่ค่าดิบซ้ำๆ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใส่ค่าดิบ (raw values/magic numbers) เช่น พิกเซลหรือรหัสสีซ้ำๆ ซึ่งซ่อนเจตนาของตัวแปรระบบ ทำให้การปรับเปลี่ยนดีไซน์ภายหลังต้องทำค้นหาและแทนที่หลายจุด
- **ตัวอย่างโค้ด:**

```css
/* notice.css */
.notice {
  /* Repeated raw values hide which decisions are shared tokens. */
  padding: 16px;
  border: 1px solid #d8dee8;
  border-left: 4px solid #2563eb;
  border-radius: 6px;
  background: #ffffff;
}

.notice--warning {
  border-left-color: #b45309;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดชื่อตัวแปร CSS Custom Properties สำหรับค่าสี ระยะห่าง และความโค้ง ทำให้โค้ดอ่านง่าย ตรวจสอบได้ และ variant สามารถปรับเปลี่ยนเฉพาะตัวแปรที่ตนเองเป็นเจ้าของได้
- **ตัวอย่างโค้ด:**

```css
/* notice.css */
:root {
  /* Named tokens make shared design decisions reviewable. */
  --color-surface: #ffffff;
  --color-border: #d8dee8;
  --space-4: 1rem;
  --radius-sm: 0.375rem;
}

.notice {
  --notice-accent: #2563eb;
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--notice-accent);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.notice--warning {
  --notice-accent: #b45309;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การนำ CSS Custom Properties มาใช้ตั้งชื่อแทนค่าการดีไซน์ที่ใช้ร่วมกัน (design tokens) เพื่อหลีกเลี่ยงการใส่ค่าดิบซ้ำๆ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Flex Layout Boundaries (การกำหนดขอบเขตระยะห่างด้วย Flexbox)

- **สรุปสาระสำคัญ:** การจัดการระยะห่างและการจัดวางใน Flexbox ให้อยู่ในขอบเขตของ container ที่ดูแล layout โดยตรง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใช้ child selector (`> *`) เพื่อดัน margin ใส่ลูกทุกตัว ซึ่งส่งผลให้สไตล์เปราะบางและส่งกระทบโดยไม่ตั้งใจเมื่อมีการซ้อน component หรือสลับลำดับลูก
- **ตัวอย่างโค้ด:**

```css
/* review-toolbar.css */
.review-toolbar {
  /* Child selectors make every toolbar item inherit layout rules implicitly. */
  display: flex;
}

.review-toolbar > * {
  margin-left: 12px;
}

.review-toolbar > :first-child {
  margin-left: 0;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้คุณสมบัติ `gap` บน flex container ในการกำหนดระยะห่างระหว่างองค์ประกอบลูก และใช้ `margin-right: auto` เฉพาะกับชิ้นส่วนที่ต้องการข้อยกเว้นการจัดตำแหน่ง
- **ตัวอย่างโค้ด:**

```css
/* review-toolbar.css */
.review-toolbar {
  /* The container owns spacing; the status item owns its alignment exception. */
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
}

.review-toolbar__status {
  margin-right: auto;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การจัดการระยะห่างและการจัดวางใน Flexbox ให้อยู่ในขอบเขตของ container ที่ดูแล layout โดยตรง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Grid Layout Tracks (การใช้ CSS Grid Tracks สำหรับ Responsive Layout)

- **สรุปสาระสำคัญ:** การใช้แทร็กของ CSS Grid เพื่อประกาศกฎของคอลัมน์แบบ responsive ในจุดเดียว แทนการคำนวณความกว้างและระยะห่างด้วยตนเอง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** พยายามสร้างคอลัมน์ด้วย `float`, เปอร์เซ็นต์ความกว้าง และ `nth-child` margin ซึ่งเป็นการเขียนสูตรคำนวณแถวแบบเปราะบางและยากต่อการแก้ไข
- **ตัวอย่างโค้ด:**

```css
/* dashboard-grid.css */
.dashboard-card {
  /* Floats and nth-child margins encode fragile row math manually. */
  float: left;
  width: 33.333%;
  margin-right: 24px;
}

.dashboard-card:nth-child(3n) {
  margin-right: 0;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ประกาศกฎคอลัมน์ด้วย `grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr))` ร่วมกับ `gap` ช่วยให้สร้างคอลัมน์ตามขนาดพื้นที่ที่มีให้อัตโนมัติ
- **ตัวอย่างโค้ด:**

```css
/* dashboard-grid.css */
.dashboard-grid {
  /* Grid describes the responsive column rule in one place. */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.dashboard-card {
  min-width: 0;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้แทร็กของ CSS Grid เพื่อประกาศกฎของคอลัมน์แบบ responsive ในจุดเดียว แทนการคำนวณความกว้างและระยะห่างด้วยตนเอง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Logical Properties (การใช้ Logical Properties รองรับทิศทางการอ่าน)

- **สรุปสาระสำคัญ:** การใช้ระยะห่างและเส้นขอบแบบอ้างอิงทิศทางการเขียน (Logical Properties) เพื่อให้สไตล์ปรับเปลี่ยนตามทิศทางของภาษาโดยอัตโนมัติ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** กำหนดทิศทางแบบกายภาพคงที่ เช่น `margin-top`, `padding-left`, หรือ `border-left` ทำให้ไม่รองรับภาษาที่อ่านจากขวาไปซ้าย (RTL) หรือการเปลี่ยนแนวการเขียน
- **ตัวอย่างโค้ด:**

```css
/* article-callout.css */
.article-callout {
  /* Physical left/right values make writing direction harder to support. */
  margin-top: 24px;
  margin-bottom: 24px;
  padding: 16px 20px 16px 20px;
  border-left: 4px solid #2563eb;
}

.article-callout__meta {
  text-align: left;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ logical properties เช่น `margin-block`, `padding-inline`, `border-inline-start` และ `text-align: start` เพื่อให้สไตล์ปรับเปลี่ยนตามแกน inline และ block
- **ตัวอย่างโค้ด:**

```css
/* article-callout.css */
.article-callout {
  /* Logical properties express flow-relative spacing and edges. */
  margin-block: 1.5rem;
  padding-block: 1rem;
  padding-inline: 1.25rem;
  border-inline-start: 4px solid #2563eb;
}

.article-callout__meta {
  text-align: start;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้ระยะห่างและเส้นขอบแบบอ้างอิงทิศทางการเขียน (Logical Properties) เพื่อให้สไตล์ปรับเปลี่ยนตามทิศทางของภาษาโดยอัตโนมัติ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Motion and Reduced Motion (การจัดการ Animation และ Prefers-Reduced-Motion)

- **สรุปสาระสำคัญ:** การออกแบบแอนิเมชันให้มีวัตถุประสงค์ชัดเจน และมีทางเลือกในการลดการเคลื่อนไหวสำหรับผู้ใช้ที่ตั้งค่าแอปพลิเคชันไว้

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** บังคับเล่นแอนิเมชันยาวนานแก่ผู้ใช้ทุกคนโดยไม่มีทางเลือกสำหรับผู้ที่แพ้การเคลื่อนไหว (reduced motion) และซ่อนสถานะไว้ใน `@keyframes`
- **ตัวอย่างโค้ด:**

```css
/* drawer.css */
.drawer {
  /* The animation runs for everyone and does not expose a reduced path. */
  animation: slide-in 600ms cubic-bezier(.2, .8, .2, 1) both;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้การเปลี่ยนผ่านตามสถานะ (`transition`) ร่วมกับ `@media (prefers-reduced-motion: reduce)` เพื่อลดระยะเวลาการเปลี่ยนผ่านให้สั้นลงอย่างมากสำหรับผู้ใช้ที่ต้องการลดการเคลื่อนไหว
- **ตัวอย่างโค้ด:**

```css
/* drawer.css */
.drawer {
  /* State-driven motion can be shortened for reduced-motion users. */
  transform: translateX(100%);
  transition: transform 180ms ease;
}

.drawer[data-open="true"] {
  transform: translateX(0);
}

@media (prefers-reduced-motion: reduce) {
  .drawer {
    transition-duration: 1ms;
  }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การออกแบบแอนิเมชันให้มีวัตถุประสงค์ชัดเจน และมีทางเลือกในการลดการเคลื่อนไหวสำหรับผู้ใช้ที่ตั้งค่าแอปพลิเคชันไว้

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Responsive Units (การใช้หน่วยวัดแบบมีขอบเขต (Clamp & Container Queries))

- **สรุปสาระสำคัญ:** การใช้หน่วยตอบสนองแบบมีขอบเขต (bounded responsive values) เพื่อรักษาความอ่านง่ายของข้อความและระยะห่างของส่วนประกอบ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** กำหนดขนาดตัวอักษรหรือ padding ด้วยหน่วย viewport (`vw`) โดยตรง ทำให้ข้อความเล็กเกินไปบนหน้าจอแคบ หรือใหญ่เกินไปบนหน้าจอกว้าง
- **ตัวอย่างโค้ด:**

```css
/* lesson-card.css */
body {
  /* Viewport text size can become unreadable outside this exact screen width. */
  font-size: 1.2vw;
}

.lesson-card {
  padding: 4vw;
}

.lesson-card__title {
  font-size: 4vw;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ฟังก์ชัน `clamp()` เพื่อกำหนดขอบเขตขั้นต่ำ ค่านิยม และขั้นสูง พร้อมกำหนด `container-type: inline-size` เพื่อปรับขนาดตามขนาดของส่วนประกอบ
- **ตัวอย่างโค้ด:**

```css
/* lesson-card.css */
.lesson-card {
  /* Bounded values scale with the component without losing readability. */
  container-type: inline-size;
  padding: clamp(1rem, 2cqi, 1.5rem);
  max-width: 42rem;
}

.lesson-card__title {
  font-size: clamp(1.25rem, 1rem + 1vw, 2rem);
  line-height: 1.2;
}

.lesson-card__body {
  font-size: 1rem;
  line-height: 1.6;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้หน่วยตอบสนองแบบมีขอบเขต (bounded responsive values) เพื่อรักษาความอ่านง่ายของข้อความและระยะห่างของส่วนประกอบ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: State Selectors and Focus-Visible (การแยก State Selectors และการรองรับ Keyboard Focus)

- **สรุปสาระสำคัญ:** การแยกสไตล์ของสถานะ hover, focus, และ selected ออกจากกัน เพื่อให้พฤติกรรมการโต้ตอบแต่ละแบบมีความชัดเจน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ลบเส้นขอบโฟกัส (`outline: none`) โดยไม่มีสไตล์ทดแทน และรวมสไตล์โฟกัสเข้ากับ hover ทำให้ผู้ใช้แป้นพิมพ์สับสนและมองไม่เห็นตำแหน่งโฟกัส
- **ตัวอย่างโค้ด:**

```css
/* tabs.css */
.tab-button {
  /* Removing outline without a replacement hides keyboard position. */
  outline: none;
}

.tab-button:hover,
.tab-button:focus {
  color: #1d4ed8;
}

.tab-button.active {
  border-bottom: 2px solid #1d4ed8;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดสไตล์แยกอย่างชัดเจนระหว่าง hover, `:focus-visible` (สำหรับการท่องด้วยแป้นพิมพ์) และ `[aria-selected="true"]` สำหรับสถานะถูกเลือก
- **ตัวอย่างโค้ด:**

```css
/* tabs.css */
.tab-button {
  /* Hover, focus, and selected state each get a distinct visual signal. */
  color: #334155;
  border-bottom: 2px solid transparent;
}

.tab-button:hover {
  color: #0f172a;
}

.tab-button:focus-visible {
  outline: 3px solid #f59e0b;
  outline-offset: 3px;
}

.tab-button[aria-selected="true"] {
  color: #1d4ed8;
  border-bottom-color: currentColor;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การแยกสไตล์ของสถานะ hover, focus, และ selected ออกจากกัน เพื่อให้พฤติกรรมการโต้ตอบแต่ละแบบมีความชัดเจน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด CSS ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Box Model Sizing:** นำหลักการ "การกำหนดขนาดมิติของ Box Model" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Cascade and Specificity:** นำหลักการ "การจัดการลำดับชั้นและความเจาะจงของ Selector" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Color Contrast States:** นำหลักการ "การรักษาระดับความต่างสีในสถานะโต้ตอบ" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Custom Properties as Design Tokens:** นำหลักการ "การใช้ CSS Variables เป็น Design Tokens" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Flex Layout Boundaries:** นำหลักการ "การกำหนดขอบเขตระยะห่างด้วย Flexbox" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Grid Layout Tracks:** นำหลักการ "การใช้ CSS Grid Tracks สำหรับ Responsive Layout" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Logical Properties:** นำหลักการ "การใช้ Logical Properties รองรับทิศทางการอ่าน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Motion and Reduced Motion:** นำหลักการ "การจัดการ Animation และ Prefers-Reduced-Motion" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Responsive Units:** นำหลักการ "การใช้หน่วยวัดแบบมีขอบเขต (Clamp & Container Queries)" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **State Selectors and Focus-Visible:** นำหลักการ "การแยก State Selectors และการรองรับ Keyboard Focus" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

# HTML5 Semantic & Accessibility Coding Guide
### คู่มือแนวทางการเขียน HTML5 และ Semantic Web อย่างถูกต้องตามมาตรฐาน

> [!NOTE]
> - **หมวดหมู่ (Category):** Frontend Core & Accessibility (a11y)
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** W3C HTML5 Standard, WCAG 2.2 AA, Accessible Rich Internet Applications (WAI-ARIA)
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรมและแนวทางปฏิบัติสำคัญในการเขียน HTML5 เพื่อความหมายเชิงโครงสร้าง (Semantic HTML), การเข้าถึงของผู้ใช้ทุกกลุ่ม (Accessibility), การจัดการฟอร์ม และการใช้ ARIA อย่างถูกวิธี
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Document Language and Metadata (การกำหนดภาษา ข้อมูลส่วนหัว และ Viewport)](#หัวข้อที่-1-document-language-and-metadata-การกำหนดภาษา-ข้อมูลส่วนหัว-และ-viewport)
2. [หัวข้อที่ 2: Semantic Document Structure (การใช้ Semantic Elements และ Landmarks)](#หัวข้อที่-2-semantic-document-structure-การใช้-semantic-elements-และ-landmarks)
3. [หัวข้อที่ 3: Heading Hierarchy (การจัดลำดับหัวข้อ h1-h6 ตามโครงสร้างข้อมูล)](#หัวข้อที่-3-heading-hierarchy-การจัดลำดับหัวข้อ-h1-h6-ตามโครงสร้างข้อมูล)
4. [หัวข้อที่ 4: Links and Navigation (การใช้งานลิงก์และการนำทางที่ถูกต้อง)](#หัวข้อที่-4-links-and-navigation-การใช้งานลิงก์และการนำทางที่ถูกต้อง)
5. [หัวข้อที่ 5: Images and Alternative Text (การระบุข้อความอธิบายภาพ alt text อย่างเหมาะสม)](#หัวข้อที่-5-images-and-alternative-text-การระบุข้อความอธิบายภาพ-alt-text-อย่างเหมาะสม)
6. [หัวข้อที่ 6: Accessible Form Labels (การผูก Label เข้ากับฟอร์มเพื่อการเข้าถึง)](#หัวข้อที่-6-accessible-form-labels-การผูก-label-เข้ากับฟอร์มเพื่อการเข้าถึง)
7. [หัวข้อที่ 7: Form Help Text and Errors (การเชื่อมโยงข้อความช่วยเหลือและ Error ด้วย aria-describedby)](#หัวข้อที่-7-form-help-text-and-errors-การเชื่อมโยงข้อความช่วยเหลือและ-error-ด้วย-aria-describedby)
8. [หัวข้อที่ 8: Interactive Elements (การใช้แท็ก button และลิงก์ตามบทบาทที่แท้จริง)](#หัวข้อที่-8-interactive-elements-การใช้แท็ก-button-และลิงก์ตามบทบาทที่แท้จริง)
9. [หัวข้อที่ 9: Tables for Tabular Data (การใช้ตารางข้อมูลเชิงความหมาย th, scope, caption)](#หัวข้อที่-9-tables-for-tabular-data-การใช้ตารางข้อมูลเชิงความหมาย-th-scope-caption)
10. [หัวข้อที่ 10: ARIA Restraint (การใช้ ARIA เท่าที่จำเป็นตามหลัก No ARIA is better than Bad ARIA)](#หัวข้อที่-10-aria-restraint-การใช้-aria-เท่าที่จำเป็นตามหลัก-no-aria-is-better-than-bad-aria)

---

## หัวข้อที่ 1: Document Language and Metadata (การกำหนดภาษา ข้อมูลส่วนหัว และ Viewport)

- **สรุปสาระสำคัญ:** การกำหนดข้อมูลพื้นฐานและ Metadata ของเอกสารในส่วนหัวเพื่อให้เบราว์เซอร์ เครื่องมือค้นหา และเทคโนโลยีสิ่งอำนวยความสะดวกเริ่มต้นด้วยบริบทและค่าเริ่มต้นที่ถูกต้อง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ละเลยการระบุภาษา (`lang`) และพฤติกรรม `viewport` ทำให้ค่าเริ่มต้นที่สำคัญถูกละไว้โดยปริยาย ส่งผลให้อ่านออกเสียงภาษาผิดพลาด พฤติกรรมเบราว์เซอร์ด้อยลง และระบุตัวตนของหน้าเว็บไม่ชัดเจน
- **ตัวอย่างโค้ด:**

```html
<html>
  <!-- Missing language and viewport leave important defaults implicit. -->
  <head>
    <title>Untitled</title>
  </head>
  <body>
    <div>Code review checklist</div>
  </body>
</html>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดภาษาของเอกสาร (`lang="en"`), การเข้ารหัสอักขระ (`charset="utf-8"`), พฤติกรรม `viewport` และชื่อเรื่อง (`<title>`) ที่สื่อความหมายในโครงสร้างหลักของเอกสารก่อนการแสดงผลเนื้อหา
- **ตัวอย่างโค้ด:**

```html
<!doctype html>
<!-- Document metadata gives browsers and assistive tech the right defaults. -->
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Code review checklist</title>
  </head>
  <body>
    <main>...</main>
  </body>
</html>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การกำหนดข้อมูลพื้นฐานและ Metadata ของเอกสารในส่วนหัวเพื่อให้เบราว์เซอร์ เครื่องมือค้นหา และเทคโนโลยีสิ่งอำนวยความสะดวกเริ่มต้นด้วยบริบทและค่าเริ่มต้นที่ถูกต้อง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Semantic Document Structure (การใช้ Semantic Elements และ Landmarks)

- **สรุปสาระสำคัญ:** การใช้แลนด์มาร์ก (Landmarks) และหัวข้อที่มีความหมายทางโครงสร้าง (Semantic HTML) เพื่อทำให้เค้าร่างเอกสารชัดเจนโดยไม่ต้องพึ่งพา CSS

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `<div>` ทั่วไปครอบเนื้อหาและสไตล์ ทำให้ซ่อนโครงสร้างการนำทางและส่วนเนื้อหาจากเค้าร่างเอกสาร รวมถึงเทคโนโลยีสิ่งอำนวยความสะดวก
- **ตัวอย่างโค้ด:**

```html
<div>
  <!-- Generic divs hide navigation and content structure from the document outline. -->
  <div class="nav">
    <span>Review guide</span>
  </div>
  <div>
    <b>Reviewing pull requests</b>
    <div>Small reviews are easier to reason about.</div>
  </div>
</div>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้แท็กแลนด์มาร์กตรงตามความหมาย เช่น `<nav>`, `<main>`, และ `<article>` เพื่อระบุขอบเขตพื้นที่ของหน้าเว็บและบทความให้ระบบรับรู้ได้โดยตรง
- **ตัวอย่างโค้ด:**

```html
<!-- nav, main, and article expose page regions before CSS runs. -->
<nav aria-label="Primary">
  <a href="/reviews">Review guide</a>
</nav>
<main>
  <article aria-labelledby="article-title">
    <h1 id="article-title">Reviewing pull requests</h1>
    <p>Small reviews are easier to reason about.</p>
  </article>
</main>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้แลนด์มาร์ก (Landmarks) และหัวข้อที่มีความหมายทางโครงสร้าง (Semantic HTML) เพื่อทำให้เค้าร่างเอกสารชัดเจนโดยไม่ต้องพึ่งพา CSS

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Heading Hierarchy (การจัดลำดับหัวข้อ h1-h6 ตามโครงสร้างข้อมูล)

- **สรุปสาระสำคัญ:** การจัดลำดับหัวข้อ (`<h1>` ถึง `<h6>`) เพื่ออธิบายโครงสร้างลำดับชั้นของเนื้อหาอย่างเป็นระบบ แทนการเลือกระดับหัวข้อตามขนาดตัวอักษร

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ข้ามระดับหัวข้อไปมาเนื่องจากการใช้มาร์กอัปเพื่อแต่งรูปลักษณ์ภายนอก ทำให้เค้าร่างข้อมูลสับสนเมื่อกวาดสายตาอ่านเฉพาะหัวข้อ
- **ตัวอย่างโค้ด:**

```html
<main>
  <!-- Heading levels are being used for appearance instead of structure. -->
  <h3>Account settings</h3>
  <section>
    <h1>Profile</h1>
    <h4>Public name</h4>
  </section>
</main>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** เรียงลำดับระดับหัวข้อตามลำดับเค้าร่างของเนื้อหาอย่างถูกต้อง (ชื่อหน้า -> หัวข้อส่วน -> หัวข้อย่อย) ช่วยให้ผู้อ่านและระบบเข้าใจสถาปัตยกรรมสารสนเทศได้ดีขึ้น
- **ตัวอย่างโค้ด:**

```html
<main>
  <!-- Heading levels follow the page outline in order. -->
  <h1>Account settings</h1>
  <section>
    <h2>Profile</h2>
    <h3>Public name</h3>
  </section>
</main>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การจัดลำดับหัวข้อ (`<h1>` ถึง `<h6>`) เพื่ออธิบายโครงสร้างลำดับชั้นของเนื้อหาอย่างเป็นระบบ แทนการเลือกระดับหัวข้อตามขนาดตัวอักษร

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Links and Navigation (การใช้งานลิงก์และการนำทางที่ถูกต้อง)

- **สรุปสาระสำคัญ:** การใช้แท็กแองเคอร์แท้ (`<a>`) พร้อมระบุปลายทางและชื่อลิงก์ที่ชัดเจนสำหรับการนำทาง แทนการใช้ตัวจัดการเหตุการณ์บนแท็กทั่วไป

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ซ่อนพฤติกรรมการนำทางไว้หลัง `onclick` บนแท็กทั่วไป หรือใช้ข้อความที่ไม่ชัดเจน เช่น "Click here" ซึ่งทำลายความสามารถพื้นฐานของเบราว์เซอร์ เช่น การเปิดในแท็บใหม่ การคัดลอกลิงก์ และการโฟกัสด้วยคีย์บอร์ด
- **ตัวอย่างโค้ด:**

```html
<div class="nav">
  <!-- Click handlers and vague labels break basic link expectations. -->
  <span onclick="go('/roadmaps/html')">Click here</span>
  <a href="#">More</a>
</div>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้แท็ก `<a>` สำหรับการเปลี่ยนหน้า ระบุชื่อเป้าหมายอย่างตรงไปตรงมา และจัดกลุ่มกลุ่มลิงก์ด้วยแท็ก `<nav>`
- **ตัวอย่างโค้ด:**

```html
<nav aria-label="Primary">
  <!-- Real anchors preserve browser navigation behavior. -->
  <ul>
    <li><a href="/roadmaps/html">HTML roadmap</a></li>
    <li><a href="/review-examples">Review examples</a></li>
  </ul>
</nav>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้แท็กแองเคอร์แท้ (`<a>`) พร้อมระบุปลายทางและชื่อลิงก์ที่ชัดเจนสำหรับการนำทาง แทนการใช้ตัวจัดการเหตุการณ์บนแท็กทั่วไป

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Images and Alternative Text (การระบุข้อความอธิบายภาพ alt text อย่างเหมาะสม)

- **สรุปสาระสำคัญ:** การระบุข้อความอธิบายภาพ (`alt`) ที่สื่อความหมายสำหรับภาพที่มีสาระสำคัญ และข้ามภาพตกแต่งเพื่อไม่ให้รบกวนการอ่าน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใส่ชื่อไฟล์รูปภาพใน attribute `alt` หรืออธิบายรูปภาพที่เป็นเพียงองค์ประกอบตกแต่ง ซึ่งเพิ่มเสียงรบกวนให้กับผู้ใช้โปรแกรมอ่านหน้าจอ
- **ตัวอย่างโค้ด:**

```html
<article>
  <!-- File names and decorative descriptions add noise for screen readers. -->
  <img src="/charts/review-time.png" alt="review-time.png" />
  <img src="/decorations/divider.svg" alt="blue squiggle divider" />
  <h2>Faster pull request reviews</h2>
</article>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** เขียน `alt` อธิบายข้อความหรือจุดประสงค์ของรูปภาพตามบริบท (เช่น สรุปผลจากกราฟ) และใส่ `alt=""` เป็นค่าว่างสำหรับภาพตกแต่ง
- **ตัวอย่างโค้ด:**

```html
<article>
  <!-- Alt text describes meaning, while decorative images stay silent. -->
  <img
    src="/charts/review-time.png"
    alt="Review time dropped from 3 days to 1 day"
  />
  <img src="/decorations/divider.svg" alt="" />
  <h2>Faster pull request reviews</h2>
</article>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การระบุข้อความอธิบายภาพ (`alt`) ที่สื่อความหมายสำหรับภาพที่มีสาระสำคัญ และข้ามภาพตกแต่งเพื่อไม่ให้รบกวนการอ่าน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Accessible Form Labels (การผูก Label เข้ากับฟอร์มเพื่อการเข้าถึง)

- **สรุปสาระสำคัญ:** การเชื่อมโยงอินพุตของฟอร์มเข้ากับแท็ก `<label>` ที่คงทน แทนการพึ่งพาข้อความชั่วคราวอย่าง `placeholder`

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใช้ข้อความ `placeholder` แทนการสร้างเลเบลจริง ซึ่งข้อความนี้จะหายไปเมื่อเริ่มพิมพ์ และไม่มีความสัมพันธ์ทางโครงสร้างกับอินพุต ทำให้ยากต่อการแปลภาษา Autofill และการใช้งานผ่านเทคโนโลยีสิ่งอำนวยความสะดวก
- **ตัวอย่างโค้ด:**

```html
<form>
  <!-- Placeholder text is not a durable label for the field. -->
  <input name="email" type="email" placeholder="Email address" />
</form>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ผูกแท็ก `<label>` เข้ากับ `<input>` ด้วย attribute `for` และ `id` ที่ตรงกัน เพื่อรักษาชื่อกำกับอินพุตไว้อย่างถาวรทั้งก่อน ระหว่าง และหลังการแก้ไข
- **ตัวอย่างโค้ด:**

```html
<form>
  <!-- The visible label stays connected to the input by for and id. -->
  <label for="email">Email address</label>
  <input id="email" name="email" type="email" autocomplete="email" />
</form>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การเชื่อมโยงอินพุตของฟอร์มเข้ากับแท็ก `<label>` ที่คงทน แทนการพึ่งพาข้อความชั่วคราวอย่าง `placeholder`

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Form Help Text and Errors (การเชื่อมโยงข้อความช่วยเหลือและ Error ด้วย aria-describedby)

- **สรุปสาระสำคัญ:** การเชื่อมโยงข้อความช่วยเหลือและคำแจ้งเตือนข้อผิดพลาดเข้ากับฟิลด์อินพุตในระดับโปรแกรม เพื่อให้คำแนะนำถูกประกาศพร้อมกับคอนโทรล

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** วางข้อความช่วยเหลือหรือคำแจ้งเตือนไว้ใกล้กับอินพุตเฉพาะทางสายตาเท่านั้น โดยไม่ได้เชื่อมโยงทางโครงสร้าง ทำให้อินพุตไม่มีความสัมพันธ์กับข้อความเตือนใน Accessibility Tree
- **ตัวอย่างโค้ด:**

```html
<label>Password</label>
<!-- Nearby text is visual only unless it is programmatically connected. -->
<input name="password" type="password" />
<p class="help">Use at least 12 characters.</p>
<p class="error">Too short.</p>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ `aria-describedby` เพื่อผูกทั้งคำแนะนำและคำผิดพลาดเข้ากับอินพุต และใช้ `aria-invalid="true"` เพื่อระบุสถานะเมื่อการตรวจสอบข้อมูลไม่ผ่าน
- **ตัวอย่างโค้ด:**

```html
<label for="password">Password</label>
<!-- aria-describedby connects both guidance and error text to the field. -->
<input
  id="password"
  name="password"
  type="password"
  aria-describedby="password-help password-error"
  aria-invalid="true"
/>
<p id="password-help">Use at least 12 characters.</p>
<p id="password-error">Password is too short.</p>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การเชื่อมโยงข้อความช่วยเหลือและคำแจ้งเตือนข้อผิดพลาดเข้ากับฟิลด์อินพุตในระดับโปรแกรม เพื่อให้คำแนะนำถูกประกาศพร้อมกับคอนโทรล

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Interactive Elements (การใช้แท็ก button และลิงก์ตามบทบาทที่แท้จริง)

- **สรุปสาระสำคัญ:** การใช้องค์ประกอบดั้งเดิม (Native Controls) สำหรับการกระทำโต้ตอบ เพื่อให้ได้พฤติกรรมการกด คีย์บอร์ด และโฟกัสตามมาตรฐานระบบโดยตรง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ใช้ `<div>` แล้วใส่เหตุการณ์ `onclick` ซึ่งบังคับให้ต้องเขียนโค้ดคัสตอมขึ้นมาใหม่เพื่อจัดการพฤติกรรมปุ่ม การรับโฟกัส คีย์บอร์ด และสถานะต่างๆ
- **ตัวอย่างโค้ด:**

```html
<div class="button" onclick="saveDraft()">
  <!-- A clickable div must recreate button behavior by hand. -->
  Save draft
</div>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้แท็ก `<button>` แท้ ซึ่งมีระบบจัดการการโต้ตอบผ่านคีย์บอร์ด ลำดับโฟกัส และ Accessibility API ในตัวพร้อมใช้งาน
- **ตัวอย่างโค้ด:**

```html
<button type="button" aria-pressed="false">
  <!-- Native buttons bring keyboard and focus behavior with them. -->
  Save draft
</button>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้องค์ประกอบดั้งเดิม (Native Controls) สำหรับการกระทำโต้ตอบ เพื่อให้ได้พฤติกรรมการกด คีย์บอร์ด และโฟกัสตามมาตรฐานระบบโดยตรง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Tables for Tabular Data (การใช้ตารางข้อมูลเชิงความหมาย th, scope, caption)

- **สรุปสาระสำคัญ:** การใช้มาร์กอัปตาราง (`<table>`) สำหรับข้อมูลเชิงตาราง เพื่อรักษาความสัมพันธ์ระหว่างหัวตารางและเซลล์ข้อมูลไว้

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** จัดวาง `<div>` ร่วมกับ CSS ให้ดูเหมือนตาราง ซึ่งทำให้ความสัมพันธ์เชิงตารางคงอยู่แค่ทางสายตาเท่านั้น แต่ไม่มีความหมายในระดับโครงสร้างข้อมูล
- **ตัวอย่างโค้ด:**

```html
<div class="table">
  <!-- CSS can make divs look tabular but cannot create table semantics. -->
  <div class="row header">
    <div>Team</div>
    <div>Median time</div>
  </div>
  <div class="row">
    <div>Frontend</div>
    <div>1.2 days</div>
  </div>
</div>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้โครงสร้างตารางจริง (`<table>`, `<caption>`, `<thead>`, `<tbody>`, `<th>`, `<td>`) และระบุ `scope` เพื่ออธิบายความสัมพันธ์ของข้อมูลอย่างชัดเจน
- **ตัวอย่างโค้ด:**

```html
<table>
  <!-- Caption and scopes preserve header-cell relationships. -->
  <caption>
    Pull request review times
  </caption>
  <thead>
    <tr>
      <th scope="col">Team</th>
      <th scope="col">Median time</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Frontend</th>
      <td>1.2 days</td>
    </tr>
  </tbody>
</table>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การใช้มาร์กอัปตาราง (`<table>`) สำหรับข้อมูลเชิงตาราง เพื่อรักษาความสัมพันธ์ระหว่างหัวตารางและเซลล์ข้อมูลไว้

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: ARIA Restraint (การใช้ ARIA เท่าที่จำเป็นตามหลัก No ARIA is better than Bad ARIA)

- **สรุปสาระสำคัญ:** การยึดหลักการใช้ HTML ดั้งเดิมเป็นอันดับแรก และเพิ่ม ARIA เฉพาะเมื่อต้องการอธิบายพฤติกรรมหรือสถานะที่ HTML เปล่าไม่สามารถแสดงออกได้เท่านั้น

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ยัดเยียด `role` และสถานะ ARIA บนองค์ประกอบที่ไม่ตรงกับพฤติกรรมจริง ซึ่งขัดแย้งกับคุณลักษณะเดิมของแท็ก และสร้างความสับสนแก่ผู้ใช้งาน
- **ตัวอย่างโค้ด:**

```html
<div role="button" aria-checked="true" aria-label="Submit">
  <!-- ARIA roles and states conflict with the element behavior here. -->
  Save changes
</div>
<span role="img" aria-label="Close dialog">x</span>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** เริ่มต้นด้วยคอนโทรลพื้นฐานแท้จริง (Native Buttons) แล้วใช้ ARIA เติมเต็มเฉพาะจุดที่ต้องการชื่อกำกับสำหรับการเข้าถึง เช่น ไอคอนปิดไดอะล็อก
- **ตัวอย่างโค้ด:**

```html
<button type="button">
  <!-- Native buttons provide the role before ARIA adds only the missing label. -->
  Save changes
</button>
<button type="button" aria-label="Close dialog">x</button>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การยึดหลักการใช้ HTML ดั้งเดิมเป็นอันดับแรก และเพิ่ม ARIA เฉพาะเมื่อต้องการอธิบายพฤติกรรมหรือสถานะที่ HTML เปล่าไม่สามารถแสดงออกได้เท่านั้น

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด HTML5 ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Document Language and Metadata:** นำหลักการ "การกำหนดภาษา ข้อมูลส่วนหัว และ Viewport" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Semantic Document Structure:** นำหลักการ "การใช้ Semantic Elements และ Landmarks" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Heading Hierarchy:** นำหลักการ "การจัดลำดับหัวข้อ h1-h6 ตามโครงสร้างข้อมูล" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Links and Navigation:** นำหลักการ "การใช้งานลิงก์และการนำทางที่ถูกต้อง" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Images and Alternative Text:** นำหลักการ "การระบุข้อความอธิบายภาพ alt text อย่างเหมาะสม" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Accessible Form Labels:** นำหลักการ "การผูก Label เข้ากับฟอร์มเพื่อการเข้าถึง" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Form Help Text and Errors:** นำหลักการ "การเชื่อมโยงข้อความช่วยเหลือและ Error ด้วย aria-describedby" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Interactive Elements:** นำหลักการ "การใช้แท็ก button และลิงก์ตามบทบาทที่แท้จริง" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Tables for Tabular Data:** นำหลักการ "การใช้ตารางข้อมูลเชิงความหมาย th, scope, caption" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **ARIA Restraint:** นำหลักการ "การใช้ ARIA เท่าที่จำเป็นตามหลัก No ARIA is better than Bad ARIA" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

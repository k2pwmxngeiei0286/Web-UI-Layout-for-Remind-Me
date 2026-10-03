# 📚 Software Engineering Coding Guides & Best Practices
### คลังคู่มือสถาปัตยกรรมและการเขียนโค้ดระดับ Senior Software Engineer

ยินดีต้อนรับสู่ศูนย์รวมคู่มือแนวทางการเขียนโค้ด (Coding Guides) และสถาปัตยกรรมซอฟต์แวร์ที่ดี โดยรวบรวมกรณีศึกษาเปรียบเทียบระหว่าง **Anti-Pattern (โค้ดที่ไม่ดี)** และ **Best Practice (สถาปัตยกรรมที่ดี)** รวม **13 หมวดหมู่ 130 หัวข้อเชิงลึก** พร้อมตัวอย่างโค้ดประกอบและการวิเคราะห์ผลกระทบระดับระบบ

> [!TIP]
> **ปรัชญาการออกแบบโค้ด (Core Engineering Philosophy):**
> 1. **Write for Humans First:** โค้ดถูกอ่านมากกว่าถูกเขียน ให้ความสำคัญกับความชัดเจน เจตนาทางธุรกิจ และการลด Cognitive Load
> 2. **Explicit over Implicit:** กำหนดขอบเขตข้อมูล อินพุต เอาต์พุต และความสัมพันธ์อย่างเปิดเผย ไม่พึ่งพา Side Effects หรือเวทมนตร์แอบแฝง
> 3. **Defensive Boundaries & Fail Fast:** ตรวจสอบความถูกต้องของข้อมูลทันทีที่ขอบเขตภายนอก (Data Boundaries) ก่อนส่งเข้าสู่ระบบภายใน
> 4. **Immutability & Pure Flows:** หลีกเลี่ยง In-place Mutation เพื่อป้องกัน Race Conditions และบั๊กแอบแฝง
> 5. **Accessibility & Resilience:** สร้างระบบที่ทนทานต่อข้อผิดพลาด (Fault Tolerant) และเข้าถึงได้สำหรับผู้ใช้ทุกคน (Inclusive UX / a11y)

---

## 🧭 แผนผังคู่มือตามสายงาน (Categorized Index)

### 🌐 Frontend Core & Styling
*โครงสร้างพื้นฐานเว็บ การจัดสไตล์ ระบบ Responsive และ Accessibility*

| คู่มือ (Guide) | เทคโนโลยี | จำนวนหัวข้อ | จุดเน้นสำคัญ (Focus Areas) |
| :--- | :---: | :---: | :--- |
| [**HTML5 Semantic & Accessibility Coding Guide**](./HtmlCodingGuide.md)<br><sub>คู่มือแนวทางการเขียน HTML5 และ Semantic Web อย่างถูกต้องตามมาตรฐาน</sub> | `HTML5` | 10 หัวข้อ | Document Language and Metadata, Semantic Document Structure, Heading Hierarchy... |
| [**Modern CSS Architecture & Styling Guide**](./CssCodingGuide.md)<br><sub>คู่มือแนวทางการเขียน CSS สมัยใหม่: Best Practices & Clean Architecture</sub> | `CSS` | 10 หัวข้อ | Box Model Sizing, Cascade and Specificity, Color Contrast States... |
| [**Tailwind CSS Scalable UI Architecture Guide**](./TailwindCSSCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน Tailwind CSS สำหรับระบบขนาดใหญ่</sub> | `Tailwind CSS` | 10 หัวข้อ | Utility Composition Readability, Responsive Breakpoints, State Variants (Hover, Focus, Disabled)... |

### ⚡ Core Languages & Type Safety
*ภาษาโปรแกรมหลัก การจัดการ Type System และ Clean Architecture*

| คู่มือ (Guide) | เทคโนโลยี | จำนวนหัวข้อ | จุดเน้นสำคัญ (Focus Areas) |
| :--- | :---: | :---: | :--- |
| [**Modern JavaScript (ES2024+) Clean Code Guide**](./JavaScriptCodingGuide.md)<br><sub>คู่มือแนวทางการเขียน JavaScript สมัยใหม่: Best Practices & Clean Code</sub> | `JavaScript` | 10 หัวข้อ | Strict Equality and Nullish Checks, Guard Clauses, Validating Data Boundaries... |
| [**TypeScript 5+ Architecture & Type Safety Guide**](./TypeScriptCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน TypeScript ยุคใหม่อย่างปลอดภัย</sub> | `TypeScript` | 10 หัวข้อ | Type Inference and Explicit Boundaries, Narrowing Unknown, Avoiding Unsafe Assertions... |
| [**Python 3 Clean Architecture & Engineering Guide**](./PythonCodingGuide.md)<br><sub>คู่มือแนวทางการเขียน Python ยุคใหม่เพื่อความสะอาดและเสถียรภาพ</sub> | `Python` | 10 หัวข้อ | Naming and Readability, Truthy, Falsy, and None Checks, Mutable Default Arguments... |
| [**Modern PHP 8+ Architecture & Security Guide**](./PHPCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน PHP ยุคใหม่ (PHP 8.x+)</sub> | `PHP` | 10 หัวข้อ | Strict Types and Return Types, Input Validation and Filtering, Output Escaping for XSS... |

### ⚛️ Modern UI Frameworks
*สถาปัตยกรรมคอมโพเนนต์ การจัดการ State และวงจรการเรนเดอร์*

| คู่มือ (Guide) | เทคโนโลยี | จำนวนหัวข้อ | จุดเน้นสำคัญ (Focus Areas) |
| :--- | :---: | :---: | :--- |
| [**Modern React Architecture & Component Design Guide**](./ReactCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน React (Modern React & Hooks)</sub> | `React` | 10 หัวข้อ | Props Component Boundaries, Stable Keys in Lists, Derived State... |
| [**Next.js App Router Architecture & Best Practices Guide**](./Next.jsCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน Next.js (App Router)</sub> | `Next.js` | 10 หัวข้อ | App Router File Conventions, Layout and Page Boundaries, Server vs Client Components... |
| [**Vue 3 Composition API & Architecture Guide**](./VueCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน Vue 3 (Composition API & Pinia)</sub> | `Vue` | 10 หัวข้อ | Single-File Component Boundaries, Props and Emits Contracts, Computed Values Versus Watchers... |

### ⚙️ Backend Systems & Runtimes
*การจัดการ Server Process, Non-blocking I/O, Logging และ Streams*

| คู่มือ (Guide) | เทคโนโลยี | จำนวนหัวข้อ | จุดเน้นสำคัญ (Focus Areas) |
| :--- | :---: | :---: | :--- |
| [**Node.js Backend Architecture & Systems Guide**](./Node.jsCodingGuide.md)<br><sub>คู่มือสถาปัตยกรรมและการเขียน Node.js สำหรับระบบหลังบ้าน</sub> | `Node.js` | 10 หัวข้อ | Runtime Boundaries and Entry Points, Async Filesystem Without Blocking, Async Failure Boundaries... |

### 🗄️ Database & Relational Architecture
*สถาปัตยกรรม SQL, Constraints, Indexing, Transactions และ Pagination*

| คู่มือ (Guide) | เทคโนโลยี | จำนวนหัวข้อ | จุดเน้นสำคัญ (Focus Areas) |
| :--- | :---: | :---: | :--- |
| [**SQL & Relational Database Architecture Guide**](./SQLCodingGuide.md)<br><sub>คู่มือการเขียน SQL และการออกแบบสถาปัตยกรรมฐานข้อมูลเชิงสัมพันธ์</sub> | `SQL` | 10 หัวข้อ | Schema Keys and Constraints, Explicit SELECT Columns, Filtering and NULL Handling... |

### 🛠️ DevOps & Version Control
*กระบวนการ Git Workflow, Atomic Commits, Branching และ Release Tags*

| คู่มือ (Guide) | เทคโนโลยี | จำนวนหัวข้อ | จุดเน้นสำคัญ (Focus Areas) |
| :--- | :---: | :---: | :--- |
| [**Git Workflow & Version Control Best Practices Guide**](./GitCodingGuide.md)<br><sub>คู่มือแนวทางการใช้งาน Git และการจัดการ Version Control อย่างมืออาชีพ</sub> | `Git` | 10 หัวข้อ | Status Before Work, Interactive Staging Hunks, Atomic Commits and Messages... |

---

## 📋 รายการคู่มือทั้งหมด (Master Table of 13 Guides)

| ลำดับ | เทคโนโลยี | ชื่อคู่มือภาษาอังกฤษ | เอกสาร | หมวดหมู่ |
| :---: | :---: | :--- | :---: | :--- |
| 01 | **HTML5** | HTML5 Semantic & Accessibility Coding Guide | [เปิดอ่าน](./HtmlCodingGuide.md) | Frontend Core & Accessibility (a11y) |
| 02 | **CSS** | Modern CSS Architecture & Styling Guide | [เปิดอ่าน](./CssCodingGuide.md) | Frontend Styling & Design Systems |
| 03 | **Tailwind CSS** | Tailwind CSS Scalable UI Architecture Guide | [เปิดอ่าน](./TailwindCSSCodingGuide.md) | Frontend Styling & Component Design |
| 04 | **JavaScript** | Modern JavaScript (ES2024+) Clean Code Guide | [เปิดอ่าน](./JavaScriptCodingGuide.md) | Core Programming & Web Runtime |
| 05 | **TypeScript** | TypeScript 5+ Architecture & Type Safety Guide | [เปิดอ่าน](./TypeScriptCodingGuide.md) | Type System & Clean Architecture |
| 06 | **React** | Modern React Architecture & Component Design Guide | [เปิดอ่าน](./ReactCodingGuide.md) | Frontend UI Framework |
| 07 | **Next.js** | Next.js App Router Architecture & Best Practices Guide | [เปิดอ่าน](./Next.jsCodingGuide.md) | Full-Stack React Framework |
| 08 | **Vue** | Vue 3 Composition API & Architecture Guide | [เปิดอ่าน](./VueCodingGuide.md) | Frontend UI Framework |
| 09 | **Node.js** | Node.js Backend Architecture & Systems Guide | [เปิดอ่าน](./Node.jsCodingGuide.md) | Backend & Server Runtime |
| 10 | **PHP** | Modern PHP 8+ Architecture & Security Guide | [เปิดอ่าน](./PHPCodingGuide.md) | Backend & Web Development |
| 11 | **Python** | Python 3 Clean Architecture & Engineering Guide | [เปิดอ่าน](./PythonCodingGuide.md) | Core Programming & Backend |
| 12 | **SQL** | SQL & Relational Database Architecture Guide | [เปิดอ่าน](./SQLCodingGuide.md) | Database & Data Architecture |
| 13 | **Git** | Git Workflow & Version Control Best Practices Guide | [เปิดอ่าน](./GitCodingGuide.md) | DevOps & Version Control |

---

## 🤝 วิธีนำคู่มือไปใช้ในทีม (Team Adoption Guide)

1. **Code Review Checklist:** ใช้คู่มือเป็นมาตรฐานอ้างอิงกลางในการทำ Pull Request Review
2. **Onboarding Engineers:** ให้นักพัฒนาใหม่ศึกษา Anti-Patterns และ Best Practices ก่อนเริ่มเขียนโค้ดในโปรเจกต์
3. **Architecture Decision Records (ADR):** อ้างอิงแนวทางในคู่มือเพื่อสนับสนุนการตัดสินใจเชิงสถาปัตยกรรม

*จัดระเบียบและตรวจสอบความถูกต้องโดย Senior Software Engineer — พร้อมใช้งานในระดับ Production*

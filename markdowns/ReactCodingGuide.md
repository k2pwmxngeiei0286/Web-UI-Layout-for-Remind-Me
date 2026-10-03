# Modern React Architecture & Component Design Guide
### คู่มือสถาปัตยกรรมและการเขียน React (Modern React & Hooks)

> [!NOTE]
> - **หมวดหมู่ (Category):** Frontend UI Framework
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** React 18 / 19 Architecture, Pure Components, Unidirectional Data Flow, Custom Hooks
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรมสำคัญของ React: Explicit Props Boundaries, Stable Keys, Derived State, Functional State Updates, Form Inputs, Effect Dependencies, Race Condition Cleanup, Context Boundaries และ Composition
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Props Component Boundaries (การกำหนดขอบเขตคอมโพเนนต์ด้วย Explicit Props)](#หัวข้อที่-1-props-component-boundaries-การกำหนดขอบเขตคอมโพเนนต์ด้วย-explicit-props)
2. [หัวข้อที่ 2: Stable Keys in Lists (การใช้ ID ที่คงที่เป็น key ในการเรนเดอร์ List)](#หัวข้อที่-2-stable-keys-in-lists-การใช้-id-ที่คงที่เป็น-key-ในการเรนเดอร์-list)
3. [หัวข้อที่ 3: Derived State (การคำนวณ State จาก Props แทนการสร้าง State ซ้ำซ้อน)](#หัวข้อที่-3-derived-state-การคำนวณ-state-จาก-props-แทนการสร้าง-state-ซ้ำซ้อน)
4. [หัวข้อที่ 4: Updating State from Previous State (การอัปเดต State ผ่าน Functional Updater)](#หัวข้อที่-4-updating-state-from-previous-state-การอัปเดต-state-ผ่าน-functional-updater)
5. [หัวข้อที่ 5: Controlled Form Inputs (การควบคุมข้อมูลฟอร์มด้วย React State)](#หัวข้อที่-5-controlled-form-inputs-การควบคุมข้อมูลฟอร์มด้วย-react-state)
6. [หัวข้อที่ 6: Effect Dependencies (การระบุ Dependencies ให้ครบถ้วนและยกเลิก Stale Network Work)](#หัวข้อที่-6-effect-dependencies-การระบุ-dependencies-ให้ครบถ้วนและยกเลิก-stale-network-work)
7. [หัวข้อที่ 7: Async Effect Cleanup (การใช้ Flag ควบคุม Cleanup ป้องกัน Race Condition)](#หัวข้อที่-7-async-effect-cleanup-การใช้-flag-ควบคุม-cleanup-ป้องกัน-race-condition)
8. [หัวข้อที่ 8: Context Boundaries (การจำกัดขอบเขต Context เพื่อลด Re-render ที่ไม่จำเป็น)](#หัวข้อที่-8-context-boundaries-การจำกัดขอบเขต-context-เพื่อลด-re-render-ที่ไม่จำเป็น)
9. [หัวข้อที่ 9: Memoization When It Helps (การใช้ useMemo เฉพาะงานที่คำนวณหนัก)](#หัวข้อที่-9-memoization-when-it-helps-การใช้-usememo-เฉพาะงานที่คำนวณหนัก)
10. [หัวข้อที่ 10: Composition Over Prop Flags (การใช้ Slots และ Children แทน Boolean Flags)](#หัวข้อที่-10-composition-over-prop-flags-การใช้-slots-และ-children-แทน-boolean-flags)

---

## หัวข้อที่ 1: Props Component Boundaries (การกำหนดขอบเขตคอมโพเนนต์ด้วย Explicit Props)

- **สรุปสาระสำคัญ:** ควรกำหนดขอบเขตของคอมโพเนนต์แสดงผล (Presentational Component) ให้มีความชัดเจน โดยรับข้อมูลที่ต้องใช้แสดงผลผ่าน Explicit Props โดยตรง แทนที่จะแอบดึงข้อมูลจาก App State ระดับสูงเข้ามาภายในคอมโพเนนต์

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การดึงข้อมูลจาก Global/App State ผ่าน Custom Hook เช่น `useAppState()` ภายในคอมโพเนนต์สรุปผล ทำให้เกิด Tight Coupling กับสถาปัตยกรรมระดับแอปพลิเคชัน ส่งผลให้คอมโพเนนต์ซับซ้อนขึ้น ทดสอบได้ยาก นำกลับมาใช้ซ้ำ (Reuse) ได้ยาก และซ่อนการพึ่งพาข้อมูลไว้ภายในโดยไม่ชัดเจนที่ Props Interface
- **ตัวอย่างโค้ด:**

```tsx
import { useAppState } from "./app-state";

export function ReviewSummary() {
  // Hidden app-state reads make the component depend on too much.
  const { currentProject, activeReview, viewer } = useAppState();
  return (
    <section>
      <h2>{currentProject.name}: {activeReview.title}</h2>
      <p>{viewer.name} marked this review as {activeReview.status}.</p>
    </section>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ส่งเฉพาะค่าข้อมูลที่จำเป็น (`title`, `reviewerName`, `status`) ผ่าน Explicit Props เพื่อให้ขอบเขตของคอมโพเนนต์ชัดเจน ทำความเข้าใจได้ง่ายจาก Interface และย้ายไปใช้งานในบริบทอื่นได้อย่างอิสระ
- **ตัวอย่างโค้ด:**

```tsx
type ReviewSummaryProps = {
  title: string;
  reviewerName: string;
  status: "approved" | "changes-requested";
};

export function ReviewSummary({
  title,
  reviewerName,
  status,
}: ReviewSummaryProps) {
  // Explicit props make this component easy to move and test.
  return (
    <section>
      <h2>{title}</h2>
      <p>{reviewerName} marked this review as {status}.</p>
    </section>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรกำหนดขอบเขตของคอมโพเนนต์แสดงผล (Presentational Component) ให้มีความชัดเจน โดยรับข้อมูลที่ต้องใช้แสดงผลผ่าน Explicit Props โดยตรง แทนที่จะแอบดึงข้อมูลจาก App State ระดับสูงเข้ามาภายในคอมโพเนนต์

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Stable Keys in Lists (การใช้ ID ที่คงที่เป็น key ในการเรนเดอร์ List)

- **สรุปสาระสำคัญ:** ควรใช้ค่า ID ที่เสถียรและระบุตัวตนที่แท้จริงของข้อมูล (Item Identity) เป็น `key` ในรายการวนลูป เพื่อให้ React สามารถรักษาสถานะและโครงสร้าง DOM ได้ถูกต้อง เมื่อมีการเปลี่ยนแปลงข้อมูลในอาร์เรย์

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ Array Index เป็น `key` เป็นเพียงการระบุลำดับตำแหน่ง ไม่ใช่ Identity ของไอเทม หากมีการเพิ่ม (Insert) ลบ (Remove) หรือเรียงลำดับใหม่ (Sort) React จะจับคู่ DOM และ State ผิดคอมโพเนนต์ นำไปสู่การแสดงผลผิดพลาดหรือเกิดบั๊กในคอมโพเนนต์ที่มี State ภายใน
- **ตัวอย่างโค้ด:**

```tsx
type Comment = {
  id: string;
  authorName: string;
  body: string;
};

export function CommentList({ comments }: { comments: Comment[] }) {
  // Index keys describe position, not the comment's identity.
  return comments.map((comment, index) => (
    <article key={index}>
      <h3>{comment.authorName}</h3>
      <p>{comment.body}</p>
    </article>
  ));
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดให้ใช้ ID ของข้อมูล (`comment.id`) ซึ่งเป็นค่าประจำตัวที่คงที่ ทำให้ React ผูกสถานะและการแสดงผลของแต่ละไอเทมได้อย่างถูกต้องตลอดการเปลี่ยนแปลงของรายการ
- **ตัวอย่างโค้ด:**

```tsx
type Comment = {
  id: string;
  authorName: string;
  body: string;
};

export function CommentList({ comments }: { comments: Comment[] }) {
  // Stable IDs preserve the right item identity across list changes.
  return comments.map((comment) => (
    <article key={comment.id}>
      <h3>{comment.authorName}</h3>
      <p>{comment.body}</p>
    </article>
  ));
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้ค่า ID ที่เสถียรและระบุตัวตนที่แท้จริงของข้อมูล (Item Identity) เป็น `key` ในรายการวนลูป เพื่อให้ React สามารถรักษาสถานะและโครงสร้าง DOM ได้ถูกต้อง เมื่อมีการเปลี่ยนแปลงข้อมูลในอาร์เรย์

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Derived State (การคำนวณ State จาก Props แทนการสร้าง State ซ้ำซ้อน)

- **สรุปสาระสำคัญ:** ควรคำนวณค่าต่างๆ จาก Props หรือ State ที่มีอยู่แล้วระหว่างช่วงการ Render โดยตรง แทนที่จะสร้าง State ซ้ำซ้อนและใช้ `useEffect` เพื่อคอยซิงก์ข้อมูล

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การสร้าง State ใหม่ (`approvedCount`) ซ้ำซ้อนกับข้อมูลใน Props และต้องพึ่งพา `useEffect` เพื่อคอยคำนวณและอัปเดต State ทุกครั้งที่ Props เปลี่ยน ก่อให้เกิดการ Render ซ้ำเกินจำเป็น มีความเสี่ยงเรื่อง Timing และปัญหาข้อมูลไม่ซิงก์กัน
- **ตัวอย่างโค้ด:**

```tsx
import { useEffect, useState } from "react";

type Reviewer = {
  id: string;
  name: string;
  approved: boolean;
};

export function ReviewerList({ reviewers }: { reviewers: Reviewer[] }) {
  const [approvedCount, setApprovedCount] = useState(0);

  // Duplicated state needs an effect just to stay synchronized.
  useEffect(() => {
    setApprovedCount(reviewers.filter((reviewer) => reviewer.approved).length);
  }, [reviewers]);

  return <p>{approvedCount} of {reviewers.length} reviewers approved.</p>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** คำนวณค่า `approvedCount` โดยตรงใน Render Phase จาก `reviewers` prop ทำให้มี Single Source of Truth เพียงจุดเดียว ไม่ต้องคอยจัดการ State ซ้ำซ้อน และไม่ต้องใช้ `useEffect` ซิงก์ข้อมูล
- **ตัวอย่างโค้ด:**

```tsx
type Reviewer = {
  id: string;
  name: string;
  approved: boolean;
};

export function ReviewerList({ reviewers }: { reviewers: Reviewer[] }) {
  // Derived values can be computed from current props during render.
  const approvedCount = reviewers.filter((reviewer) => reviewer.approved).length;
  return <p>{approvedCount} of {reviewers.length} reviewers approved.</p>;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรคำนวณค่าต่างๆ จาก Props หรือ State ที่มีอยู่แล้วระหว่างช่วงการ Render โดยตรง แทนที่จะสร้าง State ซ้ำซ้อนและใช้ `useEffect` เพื่อคอยซิงก์ข้อมูล

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Updating State from Previous State (การอัปเดต State ผ่าน Functional Updater)

- **สรุปสาระสำคัญ:** ควรใช้ Functional State Updates (`setState(prevState => ...)` ) เมื่อค่า State ใหม่ต้องคำนวณอ้างอิงจาก State ค่าก่อนหน้า เพื่อให้อ่านค่าที่ React จัดคิวล่าสุดเสมอ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การคำนวณ State ใหม่โดยใช้วาริเอเบิล State ที่ถูกอ้างอิง (Captured) ไว้รอบ Render ปัจจุบันตรงๆ อาจทำให้เกิดปัญหาสูญเสียการอัปเดต (Lost Updates) หาก Event เกิดขึ้นถี่ๆ ติดกัน มีการทำ Batching หรือรันใน Async Callback
- **ตัวอย่างโค้ด:**

```tsx
import { useState } from "react";

type Reviewer = {
  id: string;
  name: string;
};

export function ReviewerPicker({ reviewers }: { reviewers: Reviewer[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleReviewer(id: string) {
    // This uses the selectedIds captured by the current render.
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((currentId) => currentId !== id));
      return;
    }
    setSelectedIds([...selectedIds, id]);
  }

  return reviewers.map((reviewer) => (
    <button
      key={reviewer.id}
      type="button"
      aria-pressed={selectedIds.includes(reviewer.id)}
      onClick={() => toggleReviewer(reviewer.id)}
    >
      {reviewer.name}
    </button>
  ));
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ส่ง ฟังก์ชัน Updater เข้าไปใน Setter (`setSelectedIds((currentIds) => ...)` ) เพื่อดึงค่า State ล่าสุดที่อยู่ในคิวของ React มาคำนวณอย่างถูกต้องและปลอดภัยต่อการประมวลผลแบบอะซิงโครนัส
- **ตัวอย่างโค้ด:**

```tsx
import { useState } from "react";

type Reviewer = {
  id: string;
  name: string;
};

export function ReviewerPicker({ reviewers }: { reviewers: Reviewer[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  function toggleReviewer(id: string) {
    // Functional updates read the latest state React has queued.
    setSelectedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((currentId) => currentId !== id)
        : [...currentIds, id],
    );
  }

  return reviewers.map((reviewer) => (
    <button
      key={reviewer.id}
      type="button"
      aria-pressed={selectedIds.includes(reviewer.id)}
      onClick={() => toggleReviewer(reviewer.id)}
    >
      {reviewer.name}
    </button>
  ));
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้ Functional State Updates (`setState(prevState => ...)` ) เมื่อค่า State ใหม่ต้องคำนวณอ้างอิงจาก State ค่าก่อนหน้า เพื่อให้อ่านค่าที่ React จัดคิวล่าสุดเสมอ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Controlled Form Inputs (การควบคุมข้อมูลฟอร์มด้วย React State)

- **สรุปสาระสำคัญ:** ควรเก็บค่าฟอร์มไว้ใน React State เมื่อ UI ต้องการความสามารถในการตรวจสอบความถูกต้อง (Validation) การเคลียร์ฟอร์ม (Reset) หรือตรรกะการส่งข้อมูล (Submit)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ DOM Query เช่น `document.querySelector("#review-title")` เพื่อไปเข้าถึงและแก้ไขค่าใน DOM Node โดยตรง ทำให้ข้อมูลหลุดออกจากวงจร Data Flow ของ React ส่งผลให้ฟอร์มเขียนหน่วยทดสอบ (Automated Test) ได้ยาก และขยายฟีเจอร์เพิ่มได้ลำบาก
- **ตัวอย่างโค้ด:**

```tsx
import type { FormEvent } from "react";

type ReviewTitleFormProps = {
  onCreate: (title: string) => void;
};

export function ReviewTitleForm({ onCreate }: ReviewTitleFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // DOM queries bypass React's form state and testing surface.
    event.preventDefault();
    const input = document.querySelector<HTMLInputElement>("#review-title");
    const title = input?.value.trim();
    if (title) {
      onCreate(title);
      input.value = "";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="review-title">Review title</label>
      <input id="review-title" defaultValue="" />
      <button type="submit">Create review</button>
    </form>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ผูกค่าใน Input (`value={title}`) และการเปลี่ยนแปลง (`onChange`) ไว้กับ React State เพื่อใช้ State เป็นแหล่งข้อมูลเดี่ยว (Single Source of Truth) ในการตรวจเงื่อนไข ยืนยันข้อมูล และเคลียร์ฟอร์มได้อย่างปลอดภัย
- **ตัวอย่างโค้ด:**

```tsx
import { type FormEvent, useState } from "react";

type ReviewTitleFormProps = {
  onCreate: (title: string) => void;
};

export function ReviewTitleForm({ onCreate }: ReviewTitleFormProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // React state is the single source for validation and reset.
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }
    onCreate(trimmedTitle);
    setTitle("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="review-title">Review title</label>
      <input
        id="review-title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <button type="submit">Create review</button>
    </form>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรเก็บค่าฟอร์มไว้ใน React State เมื่อ UI ต้องการความสามารถในการตรวจสอบความถูกต้อง (Validation) การเคลียร์ฟอร์ม (Reset) หรือตรรกะการส่งข้อมูล (Submit)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Effect Dependencies (การระบุ Dependencies ให้ครบถ้วนและยกเลิก Stale Network Work)

- **สรุปสาระสำคัญ:** ควรระบุ Dependencies ที่นำมาใช้งานภายใน Effect ให้ครบถ้วน และคืนค่าฟังก์ชันสั่งยกเลิก (Abort/Cleanup) งานแบบ Async เมื่อค่า Props หรือ State เปลี่ยนแปลง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การละเลยตัวแปรภายนอก (`reviewId`) โดยใส่ Dependency Array เป็นอาร์เรย์ว่าง `[]` ทำให้ Effect จำเฉพาะค่าแรกที่ดึงมาในการ Render ครั้งแรกเท่านั้น ส่งผลให้เกิดปัญหานำข้อมูลค้างเก่า (Stale Data) มาแสดงเมื่อ Props มีการเปลี่ยนค่า
- **ตัวอย่างโค้ด:**

```tsx
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  body: string;
};

export function ReviewComments({ reviewId }: { reviewId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Empty dependencies freeze the first reviewId this render saw.
    fetch("/api/reviews/" + reviewId + "/comments")
      .then((response) => response.json())
      .then(setComments);
  }, []);

  return comments.map((comment) => <p key={comment.id}>{comment.body}</p>);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใส่ `[reviewId]` ใน Dependency Array เพื่อให้ Effect ทำงานซ้ำเมื่อเปลี่ยนไอดี และใช้ `AbortController` คืนค่า Cleanup เพื่อยกเลิก Network Request ที่ค้างอยู่ป้องกันปัญหาแสดงข้อมูลผิดพลาด
- **ตัวอย่างโค้ด:**

```tsx
import { useEffect, useState } from "react";

type Comment = {
  id: string;
  body: string;
};

export function ReviewComments({ reviewId }: { reviewId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // The effect follows reviewId and cancels stale network work.
    const controller = new AbortController();
    async function loadComments() {
      setError(null);
      const response = await fetch("/api/reviews/" + reviewId + "/comments", {
        signal: controller.signal,
      });
      if (!response.ok) {
        setError("Could not load comments.");
        return;
      }
      setComments(await response.json());
    }

    loadComments().catch((error) => {
      if (error.name !== "AbortError") {
        setError("Could not load comments.");
      }
    });

    return () => controller.abort();
  }, [reviewId]);

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return comments.map((comment) => <p key={comment.id}>{comment.body}</p>);
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรระบุ Dependencies ที่นำมาใช้งานภายใน Effect ให้ครบถ้วน และคืนค่าฟังก์ชันสั่งยกเลิก (Abort/Cleanup) งานแบบ Async เมื่อค่า Props หรือ State เปลี่ยนแปลง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Async Effect Cleanup (การใช้ Flag ควบคุม Cleanup ป้องกัน Race Condition)

- **สรุปสาระสำคัญ:** ควรใช้ Cleanup Mechanism ใน `useEffect` เพื่อป้องกันไม่ให้คำตอบจาก Async Request ค้างเก่า (Stale Response) เข้ามาเขียนทับหรืออัปเดตสเตตบนหน้าจอปัจจุบัน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ถึงแม้ว่าจะระบุ Dependency Array ครบถ้วน แต่หากไม่มี Cleanup Function สำหรับควบคุมสภาวะการทำงานแบบอะซิงโครนัส เมื่อมีการเปลี่ยน Prop ถี่ๆ Request เก่าที่ตอบกลับมาทีหลังอาจจะเข้าทับ State ของ Request ล่าสุด (Race Condition)
- **ตัวอย่างโค้ด:**

```tsx
import { useEffect, useState } from "react";

type Review = {
  id: string;
  title: string;
  status: string;
};

async function fetchReview(reviewId: string): Promise<Review> {
  const response = await fetch("/api/reviews/" + reviewId);
  return response.json();
}

export function ReviewDetails({ reviewId }: { reviewId: string }) {
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    // Older requests can still win the race and overwrite state.
    fetchReview(reviewId).then(setReview);
  }, [reviewId]);

  return review ? <h2>{review.title}</h2> : <p>Loading review...</p>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สร้างตัวแปรแฟล็ก `cancelled = true` ในฟังก์ชัน Cleanup เพื่อตรวจสอบสภาวะก่อนสั่งอัปเดต State ช่วยป้องกันไม่ให้ผลลัพธ์ของ Request ค้างเก่าเข้ามาเปลี่ยนหน้าจอปัจจุบัน
- **ตัวอย่างโค้ด:**

```tsx
import { useEffect, useState } from "react";

type Review = {
  id: string;
  title: string;
  status: string;
};

async function fetchReview(reviewId: string): Promise<Review> {
  const response = await fetch("/api/reviews/" + reviewId);
  if (!response.ok) {
    throw new Error("Could not load review.");
  }
  return response.json();
}

export function ReviewDetails({ reviewId }: { reviewId: string }) {
  const [review, setReview] = useState<Review | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );

  useEffect(() => {
    // Cleanup prevents stale responses from updating the current screen.
    let cancelled = false;
    setStatus("loading");

    fetchReview(reviewId)
      .then((nextReview) => {
        if (!cancelled) {
          setReview(nextReview);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reviewId]);

  if (status === "loading") {
    return <p>Loading review...</p>;
  }
  if (status === "error") {
    return <p role="alert">Could not load review.</p>;
  }

  return review ? <h2>{review.title}</h2> : null;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้ Cleanup Mechanism ใน `useEffect` เพื่อป้องกันไม่ให้คำตอบจาก Async Request ค้างเก่า (Stale Response) เข้ามาเขียนทับหรืออัปเดตสเตตบนหน้าจอปัจจุบัน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Context Boundaries (การจำกัดขอบเขต Context เพื่อลด Re-render ที่ไม่จำเป็น)

- **สรุปสาระสำคัญ:** ควรใช้ Context สำหรับข้อมูลสภาวะแวดล้อมส่วนกลาง (Ambient Data) เท่าที่จำเป็น และหลีกเลี่ยงการใช้ Context เป็นถุงรวมข้อมูลขนาดใหญ่ระดับ Global โดยควรส่งข้อมูลหลักผ่าน Explicit Props

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ Context ครอบจักรวาล (`AppContext`) ที่เก็บข้อมูลผสมกันทั้ง Project, Review, Search และ Sidebar ทำให้คอมโพเนนต์ต้องติดตาม (Subscribe) ข้อมูลที่ไม่ได้ใช้ ส่งผลให้เกิดการ Re-render พร่ำเพรื่อเมื่อข้อมูลส่วนอื่นที่ไม่เกี่ยวข้องเปลี่ยน และทำให้คอมโพเนนต์นำไปใช้ซ้ำได้ยาก
- **ตัวอย่างโค้ด:**

```tsx
import { createContext, useContext } from "react";

type AppState = {
  viewer: { id: string; name: string; role: string };
  currentProject: { id: string; name: string };
  activeReview: { title: string; reviewerName: string; status: string };
  searchQuery: string;
  sidebarOpen: boolean;
};

const AppContext = createContext<AppState | null>(null);

export function ReviewCard() {
  // A broad app context subscribes this card to unrelated state.
  const appState = useContext(AppContext);
  if (!appState) {
    return null;
  }
  return (
    <article>
      <h2>{appState.currentProject.name}: {appState.activeReview.title}</h2>
      <p>
        {appState.activeReview.reviewerName} marked this review as{" "}
        {appState.activeReview.status}.
      </p>
      {appState.viewer.role === "maintainer" ? (
        <button type="button">Approve</button>
      ) : null}
    </article>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** จำกัดขอบเขตของ Context ให้แคบลงเฉพาะข้อมูลผู้ใช้งาน (`ViewerContext`) ส่วนข้อมูล Review ก็ส่งผ่าน Explicit Props ตามปกติ ช่วยลดการ Re-render โดยไม่จำเป็นและแยกขอบเขตของคอมโพเนนต์ชัดเจน
- **ตัวอย่างโค้ด:**

```tsx
import { createContext, useContext } from "react";

type Viewer = {
  id: string;
  name: string;
  role: "viewer" | "maintainer";
};

const ViewerContext = createContext<Viewer | null>(null);

function useViewer() {
  const viewer = useContext(ViewerContext);
  if (!viewer) {
    throw new Error("ReviewCard must be rendered inside ViewerContext.");
  }
  return viewer;
}

type ReviewCardProps = {
  title: string;
  reviewerName: string;
  status: "approved" | "changes-requested" | "pending";
};

export function ReviewCard({
  title,
  reviewerName,
  status,
}: ReviewCardProps) {
  const viewer = useViewer();
  // Context stays narrow while review data remains explicit props.
  const canApprove = viewer.role === "maintainer";
  return (
    <article>
      <h2>{title}</h2>
      <p>{reviewerName} marked this review as {status}.</p>
      {canApprove ? <button type="button">Approve</button> : null}
    </article>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้ Context สำหรับข้อมูลสภาวะแวดล้อมส่วนกลาง (Ambient Data) เท่าที่จำเป็น และหลีกเลี่ยงการใช้ Context เป็นถุงรวมข้อมูลขนาดใหญ่ระดับ Global โดยควรส่งข้อมูลหลักผ่าน Explicit Props

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Memoization When It Helps (การใช้ useMemo เฉพาะงานที่คำนวณหนัก)

- **สรุปสาระสำคัญ:** ควรใช้ Memoization (`useMemo`) เฉพาะกับกระบวนการที่มีต้นทุนการคำนวณสูง (Expensive Computation) และต้องระบุ Dependency Array ให้สมบูรณ์ครบถ้วน ไม่ควรใช้พร่ำเพรื่อกับงานประมวลผลทั่วไป

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใส่ Dependency Array เป็นอาร์เรย์ว่าง `[]` สำหรับฟังก์ชันค้นหา ทำให้ผลลัพธ์ค้างไม่ยอมอัปเดตตามคำค้นหาใหม่ และการใช้ `useMemo` ครอบการต่อสตริงธรรมดา (`resultLabel`) ซึ่งเป็นการคำนวณราคาถูก นอกจากจะไม่ช่วยเรื่องประสิทธิภาพแล้วยังเพิ่ม Overhead
- **ตัวอย่างโค้ด:**

```tsx
import { useMemo } from "react";

type Review = {
  id: string;
  title: string;
  authorName: string;
};

function matchesSearch(review: Review, search: string) {
  return review.title.toLowerCase().includes(search.toLowerCase());
}

export function ReviewSearch({
  reviews,
  search,
}: {
  reviews: Review[];
  search: string;
}) {
  // Empty dependencies freeze the list after the first render.
  const visibleReviews = useMemo(
    () => reviews.filter((review) => matchesSearch(review, search)),
    [],
  );

  const resultLabel = useMemo(
    () => "Showing " + visibleReviews.length + " reviews",
    [visibleReviews.length],
  );

  return (
    <>
      <p>{resultLabel}</p>
      <ul>
        {visibleReviews.map((review) => (
          <li key={review.id}>{review.title}</li>
        ))}
      </ul>
    </>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ `useMemo` กับงานกรองข้อมูลอาร์เรย์พร้อมใส่ Dependencies `[reviews, search]` อย่างครบถ้วน ส่วนข้อความสรุปผลทั่วไปคำนวณโดยตรงใน Render Phase โดยไม่ต้องครอบ `useMemo`
- **ตัวอย่างโค้ด:**

```tsx
import { useMemo } from "react";

type Review = {
  id: string;
  title: string;
  authorName: string;
};

function matchesSearch(review: Review, search: string) {
  const query = search.toLowerCase();
  return (
    review.title.toLowerCase().includes(query) ||
    review.authorName.toLowerCase().includes(query)
  );
}

export function ReviewSearch({
  reviews,
  search,
}: {
  reviews: Review[];
  search: string;
}) {
  // Memoization is tied to the expensive list calculation inputs.
  const visibleReviews = useMemo(
    () => reviews.filter((review) => matchesSearch(review, search)),
    [reviews, search],
  );

  return (
    <ul>
      {visibleReviews.map((review) => (
        <li key={review.id}>{review.title}</li>
      ))}
    </ul>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้ Memoization (`useMemo`) เฉพาะกับกระบวนการที่มีต้นทุนการคำนวณสูง (Expensive Computation) และต้องระบุ Dependency Array ให้สมบูรณ์ครบถ้วน ไม่ควรใช้พร่ำเพรื่อกับงานประมวลผลทั่วไป

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Composition Over Prop Flags (การใช้ Slots และ Children แทน Boolean Flags)

- **สรุปสาระสำคัญ:** ควรใช้การประกอบโครงสร้างด้วย Named Slots หรือ `children` เมื่อคอมโพเนนต์มีความหลากหลายของเนื้อหา แทนที่จะเพิ่ม Prop ประเภท Boolean หรือ Mode Flag สะสมไปเรื่อยๆ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเพิ่ม Boolean Flags (`showFooter`, `showDeleteButton`) หรือ Mode String สำหรับทุกๆ รูปแบบการใช้งานใหม่ ทำให้เกิดเงื่อนไขในคอมโพเนนต์ที่ซับซ้อน เสี่ยงต่อการกำหนดรูปแบบที่ขัดแย้งกัน (Invalid Combinations) และแก้ไขได้ยาก
- **ตัวอย่างโค้ด:**

```tsx
import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  mode: "details" | "delete" | "approval";
  showFooter: boolean;
  showDeleteButton: boolean;
  onDelete?: () => void;
  children: ReactNode;
};

export function Panel({
  title,
  mode,
  showFooter,
  showDeleteButton,
  onDelete,
  children,
}: PanelProps) {
  // Boolean flags create combinations the component must police.
  return (
    <section data-mode={mode}>
      <h2>{title}</h2>
      <div>{children}</div>
      {showFooter ? <footer>Review actions</footer> : null}
      {showDeleteButton ? (
        <button type="button" onClick={onDelete}>Delete</button>
      ) : null}
    </section>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ออกแบบคอมโพเนนต์ให้มี Slot สำหรับวางปุ่มหรือเนื้อหา (`actions` และ `children`) เปิดโอกาสให้ผู้เรียกใช้งาน (Caller) สามารถส่ง UI เข้ามาประกอบได้ตามวัตถุประสงค์โดยตรงโดยไม่ต้องใช้ Prop Flag ควบคุม
- **ตัวอย่างโค้ด:**

```tsx
import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  tone?: "neutral" | "danger";
  actions?: ReactNode;
  children: ReactNode;
};

export function Panel({
  title,
  tone = "neutral",
  actions,
  children,
}: PanelProps) {
  // Slots let callers compose the variant-specific UI.
  return (
    <section data-tone={tone}>
      <header>
        <h2>{title}</h2>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}

export function DeleteReviewPanel({ onDelete }: { onDelete: () => void }) {
  return (
    <Panel
      title="Delete review"
      tone="danger"
      actions={<button type="button" onClick={onDelete}>Delete</button>}
    >
      <p>This review and its comments will be removed.</p>
    </Panel>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้การประกอบโครงสร้างด้วย Named Slots หรือ `children` เมื่อคอมโพเนนต์มีความหลากหลายของเนื้อหา แทนที่จะเพิ่ม Prop ประเภท Boolean หรือ Mode Flag สะสมไปเรื่อยๆ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด React ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Props Component Boundaries:** นำหลักการ "การกำหนดขอบเขตคอมโพเนนต์ด้วย Explicit Props" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Stable Keys in Lists:** นำหลักการ "การใช้ ID ที่คงที่เป็น key ในการเรนเดอร์ List" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Derived State:** นำหลักการ "การคำนวณ State จาก Props แทนการสร้าง State ซ้ำซ้อน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Updating State from Previous State:** นำหลักการ "การอัปเดต State ผ่าน Functional Updater" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Controlled Form Inputs:** นำหลักการ "การควบคุมข้อมูลฟอร์มด้วย React State" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Effect Dependencies:** นำหลักการ "การระบุ Dependencies ให้ครบถ้วนและยกเลิก Stale Network Work" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Async Effect Cleanup:** นำหลักการ "การใช้ Flag ควบคุม Cleanup ป้องกัน Race Condition" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Context Boundaries:** นำหลักการ "การจำกัดขอบเขต Context เพื่อลด Re-render ที่ไม่จำเป็น" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Memoization When It Helps:** นำหลักการ "การใช้ useMemo เฉพาะงานที่คำนวณหนัก" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Composition Over Prop Flags:** นำหลักการ "การใช้ Slots และ Children แทน Boolean Flags" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

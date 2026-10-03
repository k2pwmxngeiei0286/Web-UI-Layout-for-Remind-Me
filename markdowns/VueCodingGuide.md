# Vue 3 Composition API & Architecture Guide
### คู่มือสถาปัตยกรรมและการเขียน Vue 3 (Composition API & Pinia)

> [!NOTE]
> - **หมวดหมู่ (Category):** Frontend UI Framework
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Vue 3 Composition API, <script setup lang="ts">, Pinia Store, Unidirectional Data Flow
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรมสำคัญของ Vue 3: SFC Boundaries, Props/Emits Contracts, Computed vs Watchers, Stable v-for Keys, Form v-model Draft State, Composables Isolation, Pinia Actions, Provide/Inject และ Slots
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Single-File Component Boundaries (การจำกัดหน้าที่ SFC ให้เน้นเฉพาะการแสดงผล)](#หัวข้อที่-1-single-file-component-boundaries-การจำกัดหน้าที่-sfc-ให้เน้นเฉพาะการแสดงผล)
2. [หัวข้อที่ 2: Props and Emits Contracts (การรักษากฎ Unidirectional Data Flow)](#หัวข้อที่-2-props-and-emits-contracts-การรักษากฎ-unidirectional-data-flow)
3. [หัวข้อที่ 3: Computed Values Versus Watchers (การใช้ Computed สำหรับค่าคำนวณ และ Watch สำหรับ Side Effect)](#หัวข้อที่-3-computed-values-versus-watchers-การใช้-computed-สำหรับค่าคำนวณ-และ-watch-สำหรับ-side-effect)
4. [หัวข้อที่ 4: List Rendering Keys (การใช้ Stable ID เป็น Key ใน v-for)](#หัวข้อที่-4-list-rendering-keys-การใช้-stable-id-เป็น-key-ใน-v-for)
5. [หัวข้อที่ 5: Form v-model Boundaries (การเก็บ Draft State ภายในฟอร์มและส่งค่าผ่าน Emit)](#หัวข้อที่-5-form-v-model-boundaries-การเก็บ-draft-state-ภายในฟอร์มและส่งค่าผ่าน-emit)
6. [หัวข้อที่ 6: Composables and State Ownership (การแยก State ใน Composable สำหรับผู้เรียกแต่ละราย)](#หัวข้อที่-6-composables-and-state-ownership-การแยก-state-ใน-composable-สำหรับผู้เรียกแต่ละราย)
7. [หัวข้อที่ 7: Async State, Loading, and Errors (การจัดการสถานะ Loading, Data และ Error ครบวงจร)](#หัวข้อที่-7-async-state-loading-and-errors-การจัดการสถานะ-loading-data-และ-error-ครบวงจร)
8. [หัวข้อที่ 8: Pinia Store Actions (การรวมศูนย์ State และควบคุมการเปลี่ยนแปลงผ่าน Actions)](#หัวข้อที่-8-pinia-store-actions-การรวมศูนย์-state-และควบคุมการเปลี่ยนแปลงผ่าน-actions)
9. [หัวข้อที่ 9: Provide and Inject Boundaries (การใช้ Typed Injection Keys และ Readonly Context)](#หัวข้อที่-9-provide-and-inject-boundaries-การใช้-typed-injection-keys-และ-readonly-context)
10. [หัวข้อที่ 10: Slots for Component Composition (การใช้ Named Slots เพื่อความยืดหยุ่นในการประกอบ UI)](#หัวข้อที่-10-slots-for-component-composition-การใช้-named-slots-เพื่อความยืดหยุ่นในการประกอบ-ui)

---

## หัวข้อที่ 1: Single-File Component Boundaries (การจำกัดหน้าที่ SFC ให้เน้นเฉพาะการแสดงผล)

- **สรุปสาระสำคัญ:** **การกำหนดขอบเขตหน้าที่ของ Single-File Component (SFC) ควรเน้นความรับผิดชอบ UI เพียงอย่างเดียว** โดยแสดงสิ่งที่รับเข้ามา (Inputs) สิ่งที่แสดงผล (Renders) และการส่ง Events ออกไปอย่างชัดเจนที่ขอบเขตคอมโพเนนต์

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การผูกรวม Routing, Session State, Data Fetching และ UI Display ไว้ใน SFC เดียวกัน** ละเมิดหลักการ Single Responsibility Principle (SRP) ทำให้เกิด Tight Coupling โค้ดอ่านและทำความเข้าใจยาก ซับซ้อนสูง และไม่สามารถนำไปทดสอบแยกส่วนหรือใช้งานซ้ำได้
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewDashboard.vue -->
<script setup>
import { useRoute } from "vue-router";
import { useSession } from "@/stores/session";

// SFC นี้รับผิดชอบทั้ง routing, session state, fetching และ display พร้อมกัน
const route = useRoute();
const session = useSession();
const response = await fetch("/api/reviews/" + route.params.id);
const review = await response.json();
</script>

<template>
  <section>
    <h2>{{ session.project.name }}: {{ review.title }}</h2>
    <p>{{ review.reviewer.name }} marked this review as {{ review.status }}.</p>
  </section>
</template>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **แยกขอบเขตการดึงข้อมูลออกจากส่วนแสดงผล (Presentational Component)** โดยกำหนดประเภท Props ที่ต้องใช้ให้ชัดเจนที่ขอบเขตคอมโพเนนต์ ช่วยสร้าง Loose Coupling สามารถนำคอมโพเนนต์ไปใช้ซ้ำ (Reusability) และทำ Unit Test ได้ง่าย
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewCard.vue -->
<script setup lang="ts">
type ReviewCardProps = {
  title: string;
  reviewerName: string;
  status: "approved" | "changes-requested";
};

// รับเฉพาะข้อมูลแสดงผลที่ขอบเขตของคอมโพเนนต์
defineProps<ReviewCardProps>();
</script>

<template>
  <article class="review-card">
    <h2>{{ title }}</h2>
    <p>{{ reviewerName }} marked this review as {{ status }}.</p>
  </article>
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** การกำหนดขอบเขตหน้าที่ของ Single-File Component (SFC) ควรเน้นความรับผิดชอบ UI เพียงอย่างเดียว** โดยแสดงสิ่งที่รับเข้ามา (Inputs) สิ่งที่แสดงผล (Renders) และการส่ง Events ออกไปอย่างชัดเจนที่ขอบเขตคอมโพเนนต์

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Props and Emits Contracts (การรักษากฎ Unidirectional Data Flow)

- **สรุปสาระสำคัญ:** **การสร้างสัญญาการรับส่งข้อมูล (Data Contract) ระหว่าง Parent และ Child Component** ต้องประกาศ Props และ Emitted Events อย่างชัดเจนเพื่อรักษารูปแบบ Unidirectional Data Flow

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การแก้ไขหรือ Mutate ค่าใน Prop Object โดยตรงจาก Child Component** ทำให้ทิศทางการไหลของข้อมูลซ่อนเร้น ไม่ชัดเจนว่าใครเป็นเจ้าของ State (Unclear Ownership) และอาจทำให้ข้อมูลใน Parent, Store หรือ Cache หลุดออกจากความสอดคล้องกัน (Out of sync)
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewActions.vue -->
<script setup>
const props = defineProps(["review"]);

// การ Mutate prop โดยตรงซ่อนทิศทางการไหลของข้อมูลระหว่าง Parent และ Child
function approveReview() {
  props.review.status = "approved";
}
</script>

<template>
  <button @click="approveReview">Approve</button>
</template>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **กำหนด Props สำหรับรับข้อมูลขาเข้าอย่างชัดเจน และใช้ `emit` ส่ง Named Event พร้อม Payload เพื่อร้องขอการอัปเดตไปยัง Parent** ทำให้ Data Contract โปร่งใส ติดตามการเปลี่ยนแปลงได้ง่าย และรักษาความถูกต้องของข้อมูล (Data Integrity)
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewActions.vue -->
<script setup lang="ts">
const props = defineProps<{
  reviewId: string;
  canApprove: boolean;
}>();

const emit = defineEmits<{
  approve: [reviewId: string];
}>();

// ขอให้ Parent เปลี่ยนแปลง state ผ่านทาง named event
function approveReview() {
  emit("approve", props.reviewId);
}
</script>

<template>
  <button :disabled="!canApprove" @click="approveReview">
    Approve
  </button>
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** การสร้างสัญญาการรับส่งข้อมูล (Data Contract) ระหว่าง Parent และ Child Component** ต้องประกาศ Props และ Emitted Events อย่างชัดเจนเพื่อรักษารูปแบบ Unidirectional Data Flow

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Computed Values Versus Watchers (การใช้ Computed สำหรับค่าคำนวณ และ Watch สำหรับ Side Effect)

- **สรุปสาระสำคัญ:** **ใช้ Computed Values สำหรับคำนวณข้อมูลแสดงผลที่แปลงมาจาก Reactive Inputs** และสำรอง Watchers ไว้เฉพาะการจัดการ Side Effects (เช่น การเรียก API หรือการบันทึกข้อมูล)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การใช้ Watcher คัดลอกข้อมูลคำนวณลงใน Ref ตัวใหม่** ทำให้เกิด State ซ้ำซ้อน เสี่ยงต่อการหลุด Synchronization และทำให้โค้ดอ่านยากเนื่องจากต้องคอยตรวจสอบ Input Path ทุกจุดเพื่อยืนยันว่าค่าที่คัดลอกได้รับการอัปเดตแล้ว
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewList.vue -->
<script setup>
import { ref, watch } from "vue";

const query = ref("");
const reviews = ref([{ id: "r1", title: "Auth review" }]);
const visibleReviews = ref(reviews.value);

// การใช้ Watcher คัดลอก state คำนวณ ทำให้เสี่ยงต่อการหลุด synchronization
watch(query, () => {
  visibleReviews.value = reviews.value.filter((review) =>
    review.title.toLowerCase().includes(query.value.toLowerCase())
  );
});
</script>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **ใช้ `computed` คำนวณผลลัพธ์โดยตรงจาก Reactive Inputs** เพื่อให้ข้อมูลอัปเดตตามแบบอัตโนมัติเสมอเมื่อมีข้อมูลเปลี่ยนแปลง ช่วยลดความซับซ้อนและรับประกันความถูกต้องของข้อมูลในหน้าจอแสดงผล
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewList.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";

const query = ref("");
const reviews = ref([{ id: "r1", title: "Auth review" }]);

// ผลลัพธ์จาก computed จะอัปเดตตาม reactive inputs เสมอ
const visibleReviews = computed(() =>
  reviews.value.filter((review) =>
    review.title.toLowerCase().includes(query.value.toLowerCase())
  )
);
</script>

<template>
  <input v-model="query" aria-label="Filter reviews">
  <article v-for="review in visibleReviews" :key="review.id">
    {{ review.title }}
  </article>
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ Computed Values สำหรับคำนวณข้อมูลแสดงผลที่แปลงมาจาก Reactive Inputs** และสำรอง Watchers ไว้เฉพาะการจัดการ Side Effects (เช่น การเรียก API หรือการบันทึกข้อมูล)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: List Rendering Keys (การใช้ Stable ID เป็น Key ใน v-for)

- **สรุปสาระสำคัญ:** **ใช้ค่า ID ที่คงที่ของตัวข้อมูล (Stable Item Identifier) เป็น `:key` ใน `v-for`** เพื่อให้ Vue สามารถอ้างอิงและรักษา Component/Form State ให้ติดอยู่กับรายการข้อมูลนั้นๆ ได้อย่างถูกต้อง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การใช้ Array Index เป็น `:key` ใน `v-for`** ทำให้ตำแหน่งของ Key เปลี่ยนแปลงเมื่อมีการจัดเรียง แทรก หรือลบรายการ ส่งผลให้ Vue ผูก Input State หรือ Child Component State เข้ากับข้อมูลผิดรายการ
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewQueue.vue -->
<script setup>
defineProps(["reviews"]);
// Index keys จะเปลี่ยนความหมายและตำแหน่งเมื่อแถวข้อมูลเคลื่อนย้าย
</script>

<template>
  <article v-for="(review, index) in reviews" :key="index">
    <h2>{{ review.title }}</h2>
    <input v-model="review.note">
  </article>
</template>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **กำหนด `:key` โดยอ้างอิงจาก ID ประจำตัวของข้อมูลแต่ละชิ้น** ช่วยให้ Vue สามารถสืบทอดและควบคุม State ของแถวข้อมูลนั้นๆ ได้อย่างถูกต้อง แม้รายการจะถูกจัดเรียงใหม่หรือลบออกก็ตาม
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewQueue.vue -->
<script setup lang="ts">
defineProps<{
  reviews: Array<{ id: string; title: string; reviewer: string }>;
}>();
// แต่ละ key จะติดตามตัวข้อมูลไปเมื่อมีการสลับลำดับในรายการ
</script>

<template>
  <article v-for="review in reviews" :key="review.id">
    <h2>{{ review.title }}</h2>
    <p>{{ review.reviewer }}</p>
  </article>
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ค่า ID ที่คงที่ของตัวข้อมูล (Stable Item Identifier) เป็น `:key` ใน `v-for`** เพื่อให้ Vue สามารถอ้างอิงและรักษา Component/Form State ให้ติดอยู่กับรายการข้อมูลนั้นๆ ได้อย่างถูกต้อง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Form v-model Boundaries (การเก็บ Draft State ภายในฟอร์มและส่งค่าผ่าน Emit)

- **สรุปสาระสำคัญ:** **การจัดการขอบเขตฟอร์มควรเก็บข้อมูลร่าง (Draft State) ไว้ภายในฟอร์มท้องถิ่น** และส่งเฉพาะค่าที่ได้รับการกดยืนยัน (Committed Value) ออกไปหาคอมโพเนนต์แม่ผ่าน Event

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การผูก `v-model` เข้ากับ Prop Object โดยตรงขณะผู้ใช้กำลังพิมพ์** ทำให้เกิดการเขียนทับข้อมูลหลักทันที ส่งผลให้จัดการการยกเลิก (Cancel) การตรวจสอบความถูกต้อง (Validation Errors) หรือการย้อนคืนค่าทำได้ยากมาก
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewTitleForm.vue -->
<script setup>
const props = defineProps(["review"]);
// การพิมพ์ข้อความจะเขียนทับ prop โดยตรงก่อนผู้ใช้จะกดบันทึก
</script>

<template>
  <form>
    <input v-model="props.review.title">
    <button>Save</button>
  </form>
</template>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **สร้าง Local Ref เพื่อเก็บ Draft Input แยกเป็นอิสระภายในฟอร์ม** แล้วใช้ `emit` ส่งเฉพาะค่าที่ผ่านการตรวจสอบหรือตัดช่องว่างแล้วเมื่อผู้ใช้ Submit ฟอร์ม ช่วยให้แยกแยะระหว่าง Draft State และ Saved State ได้อย่างชัดเจน
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewTitleForm.vue -->
<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{ initialTitle: string }>();
const emit = defineEmits<{ save: [title: string] }>();

// ข้อมูลร่างเป็นเรื่องท้องถิ่นภายในฟอร์มจนกว่าผู้ใช้จะส่งฟอร์ม
const draftTitle = ref(props.initialTitle);
</script>

<template>
  <form @submit.prevent="emit('save', draftTitle.trim())">
    <label>
      Review title
      <input v-model="draftTitle">
    </label>
    <button type="submit">Save</button>
  </form>
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** การจัดการขอบเขตฟอร์มควรเก็บข้อมูลร่าง (Draft State) ไว้ภายในฟอร์มท้องถิ่น** และส่งเฉพาะค่าที่ได้รับการกดยืนยัน (Committed Value) ออกไปหาคอมโพเนนต์แม่ผ่าน Event

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Composables and State Ownership (การแยก State ใน Composable สำหรับผู้เรียกแต่ละราย)

- **สรุปสาระสำคัญ:** **การออกแบบ Composable เพื่อนำพฤติกรรม Reactive กลับมาใช้ใหม่** ต้องรักษาสถานะ (State) ของผู้เรียกแต่ละรายให้แยกออกจากกันอย่างสมบูรณ์ (State Isolation)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การประกาศและ Export Mutable Ref ในระดับ Module Scope** ทำให้คอมโพเนนต์ทั้งหมดที่ Import ไฟล์นี้แชร์ State ชุดเดียวกันโดยไม่ได้ตั้งใจ ส่งผลให้คอมโพเนนต์จากคนละหน้าเขียนทับข้อมูลของกันและกัน
- **ตัวอย่างโค้ด:**

```typescript
// reviewFilters.ts
import { computed, ref } from "vue";

// Module state ถูกแชร์ร่วมกันโดยทุกคอมโพเนนต์ที่ import ไฟล์นี้
export const query = ref("");
export const activeOnly = ref(true);

export function visibleReviews(reviews: Ref<Review[]>) {
  return computed(() =>
    reviews.value.filter((review) => review.title.includes(query.value))
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **สร้าง Reactive State (Refs) ไว้ภายในฟังก์ชัน Composable** เพื่อให้ผู้เรียกใช้แต่ละรายได้รับ State ชุดใหม่เป็นของตัวเอง ป้องกันปัญหากรณี Global Shared State ที่ไม่ตั้งใจ
- **ตัวอย่างโค้ด:**

```typescript
// useReviewFilters.ts
import { computed, ref } from "vue";

export function useReviewFilters(reviews: Ref<Review[]>) {
  // ผู้เรียกแต่ละรายจะได้รับตัวแปร filter refs แยกกันเป็นของตัวเอง
  const query = ref("");
  const activeOnly = ref(true);

  const visibleReviews = computed(() =>
    reviews.value.filter((review) => {
      return (!activeOnly.value || review.active) &&
        review.title.includes(query.value);
    })
  );

  return { query, activeOnly, visibleReviews };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** การออกแบบ Composable เพื่อนำพฤติกรรม Reactive กลับมาใช้ใหม่** ต้องรักษาสถานะ (State) ของผู้เรียกแต่ละรายให้แยกออกจากกันอย่างสมบูรณ์ (State Isolation)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Async State, Loading, and Errors (การจัดการสถานะ Loading, Data และ Error ครบวงจร)

- **สรุปสาระสำคัญ:** **การจัดการ Async State ต้องจำลองสถานะ Loading, Success Data และ Error ร่วมกันใน State เดียวกัน** เพื่อป้องกันไม่ให้คอมโพเนนต์แสดงผลข้อมูลเก่าหรือเกิดความล้มเหลวเงียบๆ (Silent Failures)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การกำหนดค่าเฉพาะกรณีที่ Request ประสบความสำเร็จเท่านั้น (Happy Path)** ทำให้เมื่อเกิดข้อผิดพลาดในการเรียก API ข้อผิดพลาดจะหายไปใน Console โดยไม่มีหน้าจอแจ้งเตือนผู้ใช้หรือทางเลือกให้ลองใหม่
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewFeed.vue -->
<script setup>
import { onMounted, ref } from "vue";

const reviews = ref([]);

// Request ที่ล้มเหลวจะหายไปใน console โดยไม่มี UI บอกผู้ใช้
onMounted(async () => {
  reviews.value = await fetch("/api/reviews").then((response) => response.json());
});
</script>

<template>
  <ReviewList :reviews="reviews" />
</template>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **โมเดลสถานะ `isLoading` และ `errorMessage` ครอบคลุมทุกลำดับขั้นตอนของการร้องขอข้อมูล** พร้อมทั้งออกแบบ Template ให้แสดงผลตามสถานะเหล่านั้นอย่างเหมาะสม ป้องกันการเกิด Bug ใน Production
- **ตัวอย่างโค้ด:**

```vue
<!-- ReviewFeed.vue -->
<script setup lang="ts">
import { onMounted, ref } from "vue";

const reviews = ref<Review[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");

// Refs อธิบายสถานะของการร้องขอข้อมูลในทุกรูปแบบ
async function loadReviews() {
  isLoading.value = true;
  errorMessage.value = "";
  try {
    const response = await fetch("/api/reviews");
    if (!response.ok) throw new Error("Reviews failed to load");
    reviews.value = await response.json();
  } catch (error) {
    errorMessage.value = "Reviews are unavailable right now.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(loadReviews);
</script>

<template>
  <p v-if="isLoading">Loading reviews...</p>
  <p v-else-if="errorMessage">{{ errorMessage }}</p>
  <ReviewList v-else :reviews="reviews" />
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** การจัดการ Async State ต้องจำลองสถานะ Loading, Success Data และ Error ร่วมกันใน State เดียวกัน** เพื่อป้องกันไม่ให้คอมโพเนนต์แสดงผลข้อมูลเก่าหรือเกิดความล้มเหลวเงียบๆ (Silent Failures)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Pinia Store Actions (การรวมศูนย์ State และควบคุมการเปลี่ยนแปลงผ่าน Actions)

- **สรุปสาระสำคัญ:** **การจัดการ Shared State ในระดับแอปพลิเคชันควรเก็บไว้ใน Pinia Store** และอัปเดตข้อมูลผ่าน Named Actions ที่ครอบคลุมวงจรการทำงานแบบ Async

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การ Export Mutable Reactive Object และ Free Function นอก Store** เปิดโอกาสให้ไฟล์หรือคอมโพเนนต์ใดๆ สามารถแก้ไข Shared State ได้โดยตรงอย่างกระจัดกระจาย ทำให้ยากต่อการติดตามและตรวจสอบทิศทางการอัปเดตข้อมูล
- **ตัวอย่างโค้ด:**

```typescript
// reviewState.ts
import { reactive } from "vue";

// ทุกไฟล์ที่ import สามารถแก้ไข shared state ได้โดยตรงโดยไม่มี action ระบุชื่อ
export const reviewState = reactive({
  reviews: [] as Review[],
  isLoading: false,
});

export async function loadReviews() {
  reviewState.reviews = await fetch("/api/reviews").then((response) =>
    response.json()
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **รวมศูนย์ State, Getters และ Actions ไว้ใน Pinia Store** เพื่อให้การเปลี่ยนสถานะเกิดขึ้นผ่านช่องทางที่มีชื่อชัดเจน ช่วยให้สืบค้น ติดตามการทำงาน (Auditability) และลดโค้ดซ้ำซ้อน
- **ตัวอย่างโค้ด:**

```typescript
// stores/reviews.ts
import { defineStore } from "pinia";

export const useReviewsStore = defineStore("reviews", {
  state: () => ({
    reviews: [] as Review[],
    isLoading: false,
  }),
  getters: {
    pendingReviews: (state) =>
      state.reviews.filter((review) => review.status === "pending"),
  },
  actions: {
    // Actions เป็นตัวระบุเส้นทางการเขียนข้อมูลและควบคุม async transition
    async loadReviews() {
      this.isLoading = true;
      try {
        this.reviews = await fetch("/api/reviews").then((response) =>
          response.json()
        );
      } finally {
        this.isLoading = false;
      }
    },
  },
});
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** การจัดการ Shared State ในระดับแอปพลิเคชันควรเก็บไว้ใน Pinia Store** และอัปเดตข้อมูลผ่าน Named Actions ที่ครอบคลุมวงจรการทำงานแบบ Async

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Provide and Inject Boundaries (การใช้ Typed Injection Keys และ Readonly Context)

- **สรุปสาระสำคัญ:** **ใช้ Provide และ Inject เฉพาะสำหรับ Context Values ที่เจาะจงพร้อม Typed Keys** โดยไม่ใช้เป็นช่องทางแอบส่งต่อข้อมูลทั้งแอปพลิเคชัน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การ Provide Mutable Object ขนาดใหญ่ที่รวมข้อมูลหลายประเภทเข้าด้วยกัน (`appContext`)** ทำให้คอมโพเนนต์เกิด Tight Coupling กับข้อมูลที่ไม่เกี่ยวข้อง ส่งผลให้การทดสอบ (Testing) และการบำรุงรักษาทำได้ยากมาก
- **ตัวอย่างโค้ด:**

```typescript
// appContext.ts
import { inject, provide, reactive } from "vue";

const appContextKey = Symbol("app");

// Mutable object ขนาดใหญ่กลายเป็น hidden dependency ของหลายๆ คอมโพเนนต์
export function provideAppContext() {
  const app = reactive({ user: null, reviews: [], settings: {}, theme: "light" });
  provide(appContextKey, app);
}

export function useAppContext() {
  return inject(appContextKey) as any;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **สร้าง InjectionKey ที่มี Type ชัดเจน พร้อมทั้งใช้ `readonly`** เพื่อให้คอมโพเนนต์ผู้ใช้สามารถอ่านค่าได้อย่างเดียว ไม่สามารถเขียนทับข้อมูลโดยตรงได้ ช่วยให้ขอบเขตข้อตกลงเล็ก ปลอดภัย และทดสอบแยกส่วนได้ง่าย
- **ตัวอย่างโค้ด:**

```typescript
// reviewThemeContext.ts
import type { InjectionKey, Ref } from "vue";
import { inject, provide, readonly, ref } from "vue";

type ReviewTheme = "light" | "dark";

const reviewThemeKey: InjectionKey<Readonly<Ref<ReviewTheme>>> =
  Symbol("review-theme");

export function provideReviewTheme() {
  // ผู้บริโภคสามารถอ่านค่า theme ได้ แต่ไม่สามารถเขียนทับได้โดยตรง
  const theme = ref<ReviewTheme>("light");
  provide(reviewThemeKey, readonly(theme));
  return { theme };
}

export function useReviewTheme() {
  const theme = inject(reviewThemeKey);
  if (!theme) throw new Error("Review theme provider is missing");
  return theme;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

>** **แก่นสำคัญ:** ใช้ Provide และ Inject เฉพาะสำหรับ Context Values ที่เจาะจงพร้อม Typed Keys** โดยไม่ใช้เป็นช่องทางแอบส่งต่อข้อมูลทั้งแอปพลิเคชัน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Slots for Component Composition (การใช้ Named Slots เพื่อความยืดหยุ่นในการประกอบ UI)

- **สรุปสาระสำคัญ:** ใช้ Slots เมื่อ Reusable Component Shell ต้องการเปิดให้คอมโพเนนต์ผู้เรียกเป็นเจ้าของเนื้อหา Actions หรือ Layout

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** **การเพิ่ม Boolean Props จำนวนมากเพื่อเปิดปิดปุ่มหรือแสดงผลเฉพาะกรณี** บังคับให้คอมโพเนนต์ Shell ต้องรับรู้เงื่อนไขของผู้เรียกทุกคน ทำให้โค้ดซับซ้อนและเกิด Tight Coupling ทุกครั้งที่มีฟีเจอร์ใหม่
- **ตัวอย่างโค้ด:**

```vue
<!-- PanelShell.vue -->
<script setup>
defineProps(["title", "body", "showApprove", "showArchive", "showCancel"]);
// Boolean flags บังคับให้ shell ต้องรับรู้ action ของผู้เรียกทุกราย
</script>

<template>
  <section class="panel">
    <h2>{{ title }}</h2>
    <p>{{ body }}</p>
    <button v-if="showApprove">Approve</button>
    <button v-if="showArchive">Archive</button>
    <button v-if="showCancel">Cancel</button>
  </section>
</template>
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** **ใช้ Named Slots เพื่อเปิดโอกาสให้คอมโพเนนต์ผู้เรียกส่งเนื้อหาหรือปุ่มกดเข้ามาเอง** โดย Shell ยังคงทำหน้าที่ดูแลโครงสร้างหลักและ Accessibility ช่วยลดขนาดคอมโพเนนต์และเพิ่มความยืดหยุ่นสูง
- **ตัวอย่างโค้ด:**

```vue
<!-- PanelShell.vue -->
<script setup lang="ts">
defineProps<{ labelledBy: string }>();
// Slots เปิดให้ผู้เรียกส่งเนื้อหาเข้ามาได้เองโดยไม่ต้องเพิ่ม mode flags
</script>

<template>
  <section class="panel" :aria-labelledby="labelledBy">
    <header>
      <slot name="title" />
    </header>
    <div class="panel__body">
      <slot />
    </div>
    <footer>
      <slot name="actions" />
    </footer>
  </section>
</template>
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Slots เมื่อ Reusable Component Shell ต้องการเปิดให้คอมโพเนนต์ผู้เรียกเป็นเจ้าของเนื้อหา Actions หรือ Layout

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด Vue ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Single-File Component Boundaries:** นำหลักการ "การจำกัดหน้าที่ SFC ให้เน้นเฉพาะการแสดงผล" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Props and Emits Contracts:** นำหลักการ "การรักษากฎ Unidirectional Data Flow" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Computed Values Versus Watchers:** นำหลักการ "การใช้ Computed สำหรับค่าคำนวณ และ Watch สำหรับ Side Effect" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **List Rendering Keys:** นำหลักการ "การใช้ Stable ID เป็น Key ใน v-for" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Form v-model Boundaries:** นำหลักการ "การเก็บ Draft State ภายในฟอร์มและส่งค่าผ่าน Emit" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Composables and State Ownership:** นำหลักการ "การแยก State ใน Composable สำหรับผู้เรียกแต่ละราย" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Async State, Loading, and Errors:** นำหลักการ "การจัดการสถานะ Loading, Data และ Error ครบวงจร" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Pinia Store Actions:** นำหลักการ "การรวมศูนย์ State และควบคุมการเปลี่ยนแปลงผ่าน Actions" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Provide and Inject Boundaries:** นำหลักการ "การใช้ Typed Injection Keys และ Readonly Context" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Slots for Component Composition:** นำหลักการ "การใช้ Named Slots เพื่อความยืดหยุ่นในการประกอบ UI" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

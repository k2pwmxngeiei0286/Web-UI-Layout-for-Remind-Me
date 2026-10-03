# SQL & Relational Database Architecture Guide
### คู่มือการเขียน SQL และการออกแบบสถาปัตยกรรมฐานข้อมูลเชิงสัมพันธ์

> [!NOTE]
> - **หมวดหมู่ (Category):** Database & Data Architecture
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** ANSI SQL, PostgreSQL Standards, Relational Integrity, ACID Transactions, SARGable Queries
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 แนวทางสถาปัตยกรรม SQL ระดับโปรดักชัน: Schema Keys & Constraints, Explicit Columns, Nullable Filters, Join Cardinality, Pre-aggregations, Index-Friendly Predicates, Transactions, Migrations, Parameterized Queries และ Keyset Pagination
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Schema Keys and Constraints (การกำหนดคีย์และข้อกำหนดบน Schema เพื่อความถูกต้องของข้อมูล)](#หัวข้อที่-1-schema-keys-and-constraints-การกำหนดคีย์และข้อกำหนดบน-schema-เพื่อความถูกต้องของข้อมูล)
2. [หัวข้อที่ 2: Explicit SELECT Columns (การระบุคอลัมน์ใน SELECT อย่างชัดเจนเป็น API Contract)](#หัวข้อที่-2-explicit-select-columns-การระบุคอลัมน์ใน-select-อย่างชัดเจนเป็น-api-contract)
3. [หัวข้อที่ 3: Filtering and NULL Handling (การกรองข้อมูลและการจัดการค่า NULL ด้วย IS NULL)](#หัวข้อที่-3-filtering-and-null-handling-การกรองข้อมูลและการจัดการค่า-null-ด้วย-is-null)
4. [หัวข้อที่ 4: Join Cardinality (การตรวจสอบ Cardinality และการ Pre-aggregate ข้อมูลก่อน JOIN)](#หัวข้อที่-4-join-cardinality-การตรวจสอบ-cardinality-และการ-pre-aggregate-ข้อมูลก่อน-join)
5. [หัวข้อที่ 5: Aggregation and Grouping (การจัดกลุ่มข้อมูลใน GROUP BY ให้สอดคล้องกับมิติรายงาน)](#หัวข้อที่-5-aggregation-and-grouping-การจัดกลุ่มข้อมูลใน-group-by-ให้สอดคล้องกับมิติรายงาน)
6. [หัวข้อที่ 6: Index-Friendly Predicates (การเขียนเงื่อนไขแบบ SARGable เพื่อรองรับการทำงานของ Index)](#หัวข้อที่-6-index-friendly-predicates-การเขียนเงื่อนไขแบบ-sargable-เพื่อรองรับการทำงานของ-index)
7. [หัวข้อที่ 7: Transactions for Atomic Workflows (การใช้ Transaction สำหรับกระบวนการทำงานที่เป็น Atomic)](#หัวข้อที่-7-transactions-for-atomic-workflows-การใช้-transaction-สำหรับกระบวนการทำงานที่เป็น-atomic)
8. [หัวข้อที่ 8: Migration Backfills (การแบ่งชุดข้อมูลทำ Backfill ระหว่าง Database Migration)](#หัวข้อที่-8-migration-backfills-การแบ่งชุดข้อมูลทำ-backfill-ระหว่าง-database-migration)
9. [หัวข้อที่ 9: Parameterized Queries (การใช้ Parameterized Query เพื่อความปลอดภัยและ Query Plan Cache)](#หัวข้อที่-9-parameterized-queries-การใช้-parameterized-query-เพื่อความปลอดภัยและ-query-plan-cache)
10. [หัวข้อที่ 10: Stable Pagination (การแบ่งหน้าข้อมูลแบบเสถียรด้วย Keyset Pagination)](#หัวข้อที่-10-stable-pagination-การแบ่งหน้าข้อมูลแบบเสถียรด้วย-keyset-pagination)

---

## หัวข้อที่ 1: Schema Keys and Constraints (การกำหนดคีย์และข้อกำหนดบน Schema เพื่อความถูกต้องของข้อมูล)

- **สรุปสาระสำคัญ:** ออกแบบโครงสร้างตารางและบังคับใช้กฎความเป็นเจ้าของข้อมูลด้วย Primary Keys, Foreign Keys, Uniqueness และ Check Constraints เพื่อให้ฐานข้อมูลเป็นผู้ดูแลความถูกต้องของข้อมูลโดยตรง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การละเว้นการตั้ง Constraints บังคับในระดับ Schema จะทำให้กฎสำคัญพึ่งพาเพียงความหวังจากฝั่งแอปพลิเคชัน ส่งผลให้เกิดข้อมูลผู้ใช้ซ้ำซ้อน, ข้อมูลการรีวิวที่ไร้เจ้าของ (Orphaned reviews), ค่าสถานะที่ไม่ถูกต้อง และรูปแบบวันที่ไม่แน่นอน
- **ตัวอย่างโค้ด:**

```sql
/* Missing constraints lets invalid rows into the database. */
CREATE TABLE users (
    id BIGINT,
    email TEXT,
    name TEXT,
    created_at TEXT
);

CREATE TABLE code_reviews (
    id BIGINT,
    author_id BIGINT,
    title TEXT,
    status TEXT,
    submitted_at TEXT
);
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดสิทธิ์ระบุตัวตน (Identity), ความเป็นเอกลักษณ์ (UNIQUE), ความสัมพันธ์ระหว่างตาราง (FOREIGN KEY / REFERENCES), คอลัมน์ที่จำเป็น (NOT NULL) และจำกัดสถานะรีวิวที่ยอมรับได้ด้วย CHECK constraint ให้ชัดเจนในฐานข้อมูล
- **ตัวอย่างโค้ด:**

```sql
/* Keys and constraints let the database enforce core data rules. */
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE code_reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    author_id BIGINT NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    status TEXT NOT NULL CHECK (
        status IN ('draft', 'submitted', 'approved', 'rejected')
    ),
    submitted_at TIMESTAMPTZ
);
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ออกแบบโครงสร้างตารางและบังคับใช้กฎความเป็นเจ้าของข้อมูลด้วย Primary Keys, Foreign Keys, Uniqueness และ Check Constraints เพื่อให้ฐานข้อมูลเป็นผู้ดูแลความถูกต้องของข้อมูลโดยตรง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Explicit SELECT Columns (การระบุคอลัมน์ใน SELECT อย่างชัดเจนเป็น API Contract)

- **สรุปสาระสำคัญ:** กำหนดคอลัมน์ที่ต้องการเรียกใช้อย่างเฉพาะเจาะจงแทนการพึ่งพาโครงสร้างตารางด้วย `SELECT *` เพื่อให้โครงสร้างข้อมูลตอบกลับคงที่และทำหน้าที่เป็น API Contract ที่แน่นอน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `SELECT *` ส่งผลให้โครงสร้างตารางรั่วไหลไปยังฝั่งผู้เรียกใช้ มีความเสี่ยงที่จะเกิดชื่อคอลัมน์ซ้ำกันเมื่อทำ JOIN และอาจทำให้โค้ดฝั่งผู้ใช้พังเมื่อมีการเปลี่ยนแปลง Schema ในอนาคต
- **ตัวอย่างโค้ด:**

```sql
/* SELECT * leaks table shape and duplicate column names. */
SELECT *
FROM code_reviews
JOIN users ON users.id = code_reviews.author_id
WHERE status = 'submitted'
ORDER BY submitted_at DESC
LIMIT 20;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ระบุชื่อคอลัมน์ผลลัพธ์พร้อมกำหนดนามแฝง (Alias) ให้กับคอลัมน์ เพื่อส่งมอบโครงสร้างผลลัพธ์ที่เสถียร ปลอดภัย และตรงตามความต้องการของหน้าจอหรือ API
- **ตัวอย่างโค้ด:**

```sql
/* Return only the fields this screen or API needs. */
SELECT
    reviews.id,
    reviews.title,
    reviews.status,
    users.name AS author_name,
    reviews.submitted_at
FROM code_reviews AS reviews
JOIN users ON users.id = reviews.author_id
WHERE reviews.status = 'submitted'
ORDER BY reviews.submitted_at DESC
LIMIT 20;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** กำหนดคอลัมน์ที่ต้องการเรียกใช้อย่างเฉพาะเจาะจงแทนการพึ่งพาโครงสร้างตารางด้วย `SELECT *` เพื่อให้โครงสร้างข้อมูลตอบกลับคงที่และทำหน้าที่เป็น API Contract ที่แน่นอน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Filtering and NULL Handling (การกรองข้อมูลและการจัดการค่า NULL ด้วย IS NULL)

- **สรุปสาระสำคัญ:** ใช้ตัวดำเนินการ SQL NULL โดยเฉพาะ และจัดกลุ่มตรรกะ Boolean ด้วยวงเล็บอย่างชัดเจน เพื่อให้เงื่อนไขการกรองตรงกับพฤติกรรมจริงของข้อมูลที่เป็น Nullable

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเปรียบเทียบค่า `NULL` ด้วยตัวดำเนินการเปรียบเทียบทั่วไป เช่น `= NULL` หรือ `!= NULL` ร่วมกับการใช้ `OR` โดยไม่มีวงเล็บจัดกลุ่ม ลำดับความสำคัญของตัวดำเนินการจะคลุมเครือ และส่งผลให้คืนค่าผิดพลาดหรือไม่มีข้อมูลคืนกลับมาเลย
- **ตัวอย่างโค้ด:**

```sql
/* = NULL and loose OR logic do not match nullable data. */
SELECT id, title, approved_at
FROM code_reviews
WHERE deleted_at = NULL
  AND approved_at != NULL
  OR approved_at >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY submitted_at DESC;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ตัวดำเนินการ `IS NULL` ในการตรวจสอบค่าว่าง และใช้วงเล็บครอบกลุ่มเงื่อนไข `OR` เพื่อป้องกันไม่ให้ข้อมูลที่ถูกลบ (Rows ที่ถูก Deleted) รั่วไหลเข้ามาในผลลัพธ์
- **ตัวอย่างโค้ด:**

```sql
/* IS NULL and parentheses make nullable filters explicit. */
SELECT id, title, approved_at
FROM code_reviews
WHERE deleted_at IS NULL
  AND (
    approved_at IS NULL
    OR approved_at >= CURRENT_DATE - INTERVAL '30 days'
  )
ORDER BY submitted_at DESC;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ตัวดำเนินการ SQL NULL โดยเฉพาะ และจัดกลุ่มตรรกะ Boolean ด้วยวงเล็บอย่างชัดเจน เพื่อให้เงื่อนไขการกรองตรงกับพฤติกรรมจริงของข้อมูลที่เป็น Nullable

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Join Cardinality (การตรวจสอบ Cardinality และการ Pre-aggregate ข้อมูลก่อน JOIN)

- **สรุปสาระสำคัญ:** ตรวจสอบความสัมพันธ์ของจำนวนแถวจากการ JOIN (1-to-1, 1-to-Many หรือกรณีไม่มีข้อมูล) ก่อนนำผลลัพธ์ไปใช้งาน เพื่อป้องกันไม่ให้จำนวนแถวเปลี่ยนแปลงไปจากความตั้งใจ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การ JOIN ตรงไปยังตารางฝั่ง Many (เช่น `review_comments`) ทำให้ข้อมูลเพิ่มขึ้นเป็น 1 แถวต่อ comment และตัดแถวการรีวิวที่ไม่มี comment ทิ้งไป ซึ่งเป็นการสร้างความเสียหายเงียบๆ ต่อระบบ Pagination, การนับจำนวน และการสรุปผลบน UI
- **ตัวอย่างโค้ด:**

```sql
/* Joining comments directly creates one row per comment. */
SELECT
    reviews.id,
    reviews.title,
    review_comments.id AS comment_id
FROM code_reviews AS reviews
JOIN review_comments
    ON review_comments.review_id = reviews.id
WHERE reviews.author_id = $1;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ทำการคำนวณสรุปจำนวนล่วงหน้า (Pre-aggregate) ใน CTE ก่อน จากนั้นจึงเชื่อมโยงด้วย `LEFT JOIN` ร่วมกับ `COALESCE` เพื่อให้รายการรีวิวที่ไม่มีความคิดเห็นยังคงแสดงผลออกมาอย่างถูกต้องเพียง 1 แถว
- **ตัวอย่างโค้ด:**

```sql
/* Count comments first so each review stays one row. */
WITH comment_counts AS (
    SELECT
        review_id,
        COUNT(*) AS comment_count
    FROM review_comments
    GROUP BY review_id
)
SELECT
    reviews.id,
    reviews.title,
    COALESCE(comment_counts.comment_count, 0) AS comment_count
FROM code_reviews AS reviews
LEFT JOIN comment_counts
    ON comment_counts.review_id = reviews.id
WHERE reviews.author_id = $1;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ตรวจสอบความสัมพันธ์ของจำนวนแถวจากการ JOIN (1-to-1, 1-to-Many หรือกรณีไม่มีข้อมูล) ก่อนนำผลลัพธ์ไปใช้งาน เพื่อป้องกันไม่ให้จำนวนแถวเปลี่ยนแปลงไปจากความตั้งใจ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Aggregation and Grouping (การจัดกลุ่มข้อมูลใน GROUP BY ให้สอดคล้องกับมิติรายงาน)

- **สรุปสาระสำคัญ:** จัดกลุ่มข้อมูล (`GROUP BY`) ตามมิติที่ต้องการรายงานผลให้ตรงกันอย่างแม่นยำ และสื่อความหมายของการรวมกลุ่มข้อมูล (Aggregate) ให้ชัดเจน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเลือกคอลัมน์ดิบ (เช่น `submitted_at`) มาแสดงใน `SELECT` โดยที่ไม่ได้ถูกรวมไว้ใน `GROUP BY` ส่งผลให้ Query ทำงานล้มเหลว หรือคืนค่าที่ไม่ถูกต้องและชี้นำความหมายผิดๆ ขึ้นอยู่กับฐานข้อมูลแต่ละชนิด
- **ตัวอย่างโค้ด:**

```sql
/* submitted_at is selected but not part of the grouping intent. */
SELECT
    submitted_at,
    status,
    COUNT(*) AS review_count
FROM code_reviews
WHERE submitted_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY status
ORDER BY submitted_at DESC;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ทุกคอลัมน์ที่ไม่ได้อยู่ภายใต้ฟังก์ชัน Aggregate จะต้องระบุไว้ใน `GROUP BY` อย่างตั้งใจ เพื่อให้ผลลัพธ์สรุปรายงานจำนวนตามวันและสถานะได้อย่างถูกต้องสมบูรณ์
- **ตัวอย่างโค้ด:**

```sql
/* Selected dimensions match the GROUP BY report question. */
SELECT
    DATE_TRUNC('day', submitted_at) AS review_day,
    status,
    COUNT(*) AS review_count
FROM code_reviews
WHERE submitted_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY review_day, status
ORDER BY review_day DESC, status;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** จัดกลุ่มข้อมูล (`GROUP BY`) ตามมิติที่ต้องการรายงานผลให้ตรงกันอย่างแม่นยำ และสื่อความหมายของการรวมกลุ่มข้อมูล (Aggregate) ให้ชัดเจน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Index-Friendly Predicates (การเขียนเงื่อนไขแบบ SARGable เพื่อรองรับการทำงานของ Index)

- **สรุปสาระสำคัญ:** รักษาคอลัมน์ที่มี Index ให้ค้นหาได้รวดเร็วโดยการหลีกเลี่ยงการใช้ฟังก์ชันครอบทางฝั่งคอลัมน์ในเงื่อนไข `WHERE`

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การนำฟังก์ชันจัดรูปแบบ เช่น `TO_CHAR(submitted_at, 'YYYY-MM')` ไปครอบคอลัมน์ บังคับให้ฐานข้อมูลต้องประมวลผลคำนวณทุกๆ แถว ซึ่งบล็อกการใช้งาน Index และลดประสิทธิภาพการทำงานอย่างมาก
- **ตัวอย่างโค้ด:**

```sql
/* Formatting the column forces work on every row. */
SELECT id, title, submitted_at
FROM code_reviews
WHERE TO_CHAR(submitted_at, 'YYYY-MM') = '2026-01'
ORDER BY submitted_at DESC;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แสดงเงื่อนไขกรองช่วงเวลาในรูปแบบช่วงเปิดครึ่งเดียว (Half-Open Range Predicates) บนคอลัมน์ดิบโดยตรง ซึ่งช่วยให้ฐานข้อมูลสามารถดึง Index มาใช้ค้นหาข้อมูล (Seek) ได้ทันที
- **ตัวอย่างโค้ด:**

```sql
/* Range predicates keep submitted_at searchable by index. */
SELECT id, title, submitted_at
FROM code_reviews
WHERE submitted_at >= TIMESTAMPTZ '2026-01-01'
  AND submitted_at < TIMESTAMPTZ '2026-02-01'
ORDER BY submitted_at DESC;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** รักษาคอลัมน์ที่มี Index ให้ค้นหาได้รวดเร็วโดยการหลีกเลี่ยงการใช้ฟังก์ชันครอบทางฝั่งคอลัมน์ในเงื่อนไข `WHERE`

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Transactions for Atomic Workflows (การใช้ Transaction สำหรับกระบวนการทำงานที่เป็น Atomic)

- **สรุปสาระสำคัญ:** ห่อหุ้มคำสั่งการเขียนข้อมูลหลายขั้นตอนไว้ภายใน Transaction เพื่อให้การเปลี่ยนแปลงทั้งหมดสำเร็จหรือล้มเหลวไปพร้อมกันแบบ Atomic Unit

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การรันคำสั่งเขียนข้อมูลหลายส่วนแยกจากกันโดยไม่ใช้ Transaction หากเกิดข้อผิดพลาดกลางครรภ์ อาจทำให้สถานะการอนุมัติสำเร็จแต่ไม่มีการบันทึก Audit Event และไม่ได้ตรวจสอบสถานะเริ่มต้นก่อนทำรายการ
- **ตัวอย่างโค้ด:**

```sql
/* Without a transaction, the audit event can fail after approval. */
UPDATE code_reviews
SET status = 'approved',
    approved_at = now()
WHERE id = $1;

INSERT INTO review_events (review_id, event_type, created_at)
VALUES ($1, 'approved', now());
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้คำสั่ง `BEGIN` และ `COMMIT` ห่อหุ้มการอัปเดตสถานะและการบันทึก Event ให้เป็นงานหน่วยเดียวกัน พร้อมทั้งตรวจสอบสถานะเดิมก่อนทำการเปลี่ยนสถานะ
- **ตัวอย่างโค้ด:**

```sql
/* Both writes succeed or fail as one unit. */
BEGIN;

UPDATE code_reviews
SET status = 'approved',
    approved_at = now()
WHERE id = $1
  AND status = 'submitted';

INSERT INTO review_events (review_id, event_type, created_at)
VALUES ($1, 'approved', now());

COMMIT;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ห่อหุ้มคำสั่งการเขียนข้อมูลหลายขั้นตอนไว้ภายใน Transaction เพื่อให้การเปลี่ยนแปลงทั้งหมดสำเร็จหรือล้มเหลวไปพร้อมกันแบบ Atomic Unit

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Migration Backfills (การแบ่งชุดข้อมูลทำ Backfill ระหว่าง Database Migration)

- **สรุปสาระสำคัญ:** แบ่งขั้นตอนการปรับเปลี่ยน Schema, การจัดการเติมข้อมูลเก่า (Backfill) และการบังคับใช้ Constraint ออกเป็นลำดับขั้นตอนเพื่อความปลอดภัยของข้อมูลที่มีอยู่เดิม

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเพิ่มคอลัมน์ใหม่พร้อมใส่เงื่อนไข `NOT NULL` ทันที จะทำให้ Migration ล้มเหลวทันทีในตารางที่มีข้อมูลเดิมอยู่แล้ว หรือบังคับให้ต้องใส่ค่า Default ที่ไม่ปลอดภัย
- **ตัวอย่างโค้ด:**

```sql
/* NOT NULL before backfill can fail on existing rows. */
ALTER TABLE users
ADD COLUMN display_name TEXT NOT NULL;

UPDATE users
SET display_name = name;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แบ่งการย้ายข้อมูลออกเป็น 3 ขั้นตอนที่ปลอดภัย: เพิ่มคอลัมน์ก่อน, อัปเดตข้อมูลเก่าด้วย `UPDATE`, แล้วจึงบังคับใช้ constraint `NOT NULL` เมื่อข้อมูลพร้อมสมบูรณ์
- **ตัวอย่างโค้ด:**

```sql
/* Add the column, backfill old rows, then enforce NOT NULL. */
ALTER TABLE users
ADD COLUMN display_name TEXT;

UPDATE users
SET display_name = COALESCE(NULLIF(name, ''), email)
WHERE display_name IS NULL;

ALTER TABLE users
ALTER COLUMN display_name SET NOT NULL;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** แบ่งขั้นตอนการปรับเปลี่ยน Schema, การจัดการเติมข้อมูลเก่า (Backfill) และการบังคับใช้ Constraint ออกเป็นลำดับขั้นตอนเพื่อความปลอดภัยของข้อมูลที่มีอยู่เดิม

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Parameterized Queries (การใช้ Parameterized Query เพื่อความปลอดภัยและ Query Plan Cache)

- **สรุปสาระสำคัญ:** ผูกอินพุตจากผู้ใช้ด้วย Parameter Bound แทนการนำสตริงมาต่อกัน เพื่อป้องกันช่องโหว่ทางความปลอดภัย เช่น SQL Injection

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การนำสตริงอินพุตจากผู้ใช้มาต่อเข้ากับคำสั่ง SQL โดยตรง เปิดโอกาสให้อินพุตที่มีเครื่องหมายอัญประกาศหรือคำสั่ง SQL สามารถเปลี่ยนโครงสร้างคำสั่งที่ฐานข้อมูลประมวลผลได้
- **ตัวอย่างโค้ด:**

```typescript
// String concatenation turns user input into SQL text.
export async function findUserByEmail(email: string) {
  const result = await db.query(
    "SELECT id, email, name FROM users WHERE email = '" + email + "'"
  );
  return result.rows ?? null;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดข้อความคำสั่ง SQL ให้เป็นสแตติกและส่งผ่านค่าผู้ใช้ในรูปแบบ Parameter Bound (`$1`) ซึ่งช่วยแยกแยะระหว่างโครงสร้างคำสั่งกับข้อมูลอย่างเด็ดขาด
- **ตัวอย่างโค้ด:**

```typescript
// Bound parameters keep user input out of the SQL text.
export async function findUserByEmail(email: string) {
  const result = await db.query(
    "SELECT id, email, name FROM users WHERE email = $1",
    [email]
  );
  return result.rows ?? null;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ผูกอินพุตจากผู้ใช้ด้วย Parameter Bound แทนการนำสตริงมาต่อกัน เพื่อป้องกันช่องโหว่ทางความปลอดภัย เช่น SQL Injection

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Stable Pagination (การแบ่งหน้าข้อมูลแบบเสถียรด้วย Keyset Pagination)

- **สรุปสาระสำคัญ:** กำหนดการเรียงลำดับแบบแน่นอน (Deterministic Ordering) ร่วมกับ Cursor Predicate เพื่อให้การแบ่งหน้าข้อมูลมีความนิ่งและแม่นยำแม้ข้อมูลมีการเปลี่ยนแปลง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ OFFSET Pagination ร่วมกับการเรียงลำดับคอลัมน์ที่ไม่เป็นเอกลักษณ์ ทำให้ตำแหน่งข้อมูลขยับเมื่อมีข้อมูลใหม่เพิ่มเข้ามา ส่งผลให้ผู้ใช้เห็นข้อมูลซ้ำหรือข้ามบางรายการไป
- **ตัวอย่างโค้ด:**

```sql
/* OFFSET can shift when new rows arrive between page loads. */
SELECT id, title, submitted_at
FROM code_reviews
WHERE status = 'submitted'
ORDER BY submitted_at DESC
LIMIT 20 OFFSET $1;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สร้าง Cursor โดยผสมคอลัมน์วันที่เข้ากับ `id` เช่น `(submitted_at, id) < ($1, $2)` เพื่อกำหนดจุดเริ่มต้นของหน้าถัดไปได้อย่างแน่นอนโดยไม่เกิดการคลาดเคลื่อน
- **ตัวอย่างโค้ด:**

```sql
/* Cursor uses timestamp plus id so the next page starts safely. */
SELECT id, title, submitted_at
FROM code_reviews
WHERE status = 'submitted'
  AND (submitted_at, id) < ($1, $2)
ORDER BY submitted_at DESC, id DESC
LIMIT 20;
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** กำหนดการเรียงลำดับแบบแน่นอน (Deterministic Ordering) ร่วมกับ Cursor Predicate เพื่อให้การแบ่งหน้าข้อมูลมีความนิ่งและแม่นยำแม้ข้อมูลมีการเปลี่ยนแปลง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด SQL ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Schema Keys and Constraints:** นำหลักการ "การกำหนดคีย์และข้อกำหนดบน Schema เพื่อความถูกต้องของข้อมูล" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Explicit SELECT Columns:** นำหลักการ "การระบุคอลัมน์ใน SELECT อย่างชัดเจนเป็น API Contract" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Filtering and NULL Handling:** นำหลักการ "การกรองข้อมูลและการจัดการค่า NULL ด้วย IS NULL" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Join Cardinality:** นำหลักการ "การตรวจสอบ Cardinality และการ Pre-aggregate ข้อมูลก่อน JOIN" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Aggregation and Grouping:** นำหลักการ "การจัดกลุ่มข้อมูลใน GROUP BY ให้สอดคล้องกับมิติรายงาน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Index-Friendly Predicates:** นำหลักการ "การเขียนเงื่อนไขแบบ SARGable เพื่อรองรับการทำงานของ Index" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Transactions for Atomic Workflows:** นำหลักการ "การใช้ Transaction สำหรับกระบวนการทำงานที่เป็น Atomic" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Migration Backfills:** นำหลักการ "การแบ่งชุดข้อมูลทำ Backfill ระหว่าง Database Migration" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Parameterized Queries:** นำหลักการ "การใช้ Parameterized Query เพื่อความปลอดภัยและ Query Plan Cache" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Stable Pagination:** นำหลักการ "การแบ่งหน้าข้อมูลแบบเสถียรด้วย Keyset Pagination" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

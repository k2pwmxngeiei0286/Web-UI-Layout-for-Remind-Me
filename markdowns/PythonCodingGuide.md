# Python 3 Clean Architecture & Engineering Guide
### คู่มือแนวทางการเขียน Python ยุคใหม่เพื่อความสะอาดและเสถียรภาพ

> [!NOTE]
> - **หมวดหมู่ (Category):** Core Programming & Backend
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Python 3.10+, PEP 8, Type Hints (PEP 484), Clean Architecture, Dependency Injection
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรมสำคัญของ Python 3: Descriptive Naming, None/Falsy Checks, Immutable Defaults, Comprehensions, Exception Chaining, Context Managers, Dataclasses, Type Hints, Dependency Injection และ Async/Await
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Naming and Readability (การตั้งชื่อและความอ่านง่ายของโค้ด)](#หัวข้อที่-1-naming-and-readability-การตั้งชื่อและความอ่านง่ายของโค้ด)
2. [หัวข้อที่ 2: Truthy, Falsy, and None Checks (การตรวจสอบความจริง เท็จ และค่า None อย่างถูกต้อง)](#หัวข้อที่-2-truthy-falsy-and-none-checks-การตรวจสอบความจริง-เท็จ-และค่า-none-อย่างถูกต้อง)
3. [หัวข้อที่ 3: Mutable Default Arguments (การหลีกเลี่ยงค่าเริ่มต้นแบบ Mutable ในพารามิเตอร์)](#หัวข้อที่-3-mutable-default-arguments-การหลีกเลี่ยงค่าเริ่มต้นแบบ-mutable-ในพารามิเตอร์)
4. [หัวข้อที่ 4: List and Dict Comprehensions (การใช้ Comprehensions ให้เหมาะสมและอ่านง่าย)](#หัวข้อที่-4-list-and-dict-comprehensions-การใช้-comprehensions-ให้เหมาะสมและอ่านง่าย)
5. [หัวข้อที่ 5: Exception Boundaries (การกำหนดขอบเขตข้อผิดพลาดและ Exception Chaining)](#หัวข้อที่-5-exception-boundaries-การกำหนดขอบเขตข้อผิดพลาดและ-exception-chaining)
6. [หัวข้อที่ 6: Context Managers for Files (การจัดการไฟล์และทรัพยากรด้วย with Statement)](#หัวข้อที่-6-context-managers-for-files-การจัดการไฟล์และทรัพยากรด้วย-with-statement)
7. [หัวข้อที่ 7: Dataclasses for Data Shapes (การใช้ Dataclasses กำหนดโครงสร้างข้อมูลที่แน่นอน)](#หัวข้อที่-7-dataclasses-for-data-shapes-การใช้-dataclasses-กำหนดโครงสร้างข้อมูลที่แน่นอน)
8. [หัวข้อที่ 8: Type Hints at Boundaries (การระบุ Type Hints ที่ขอบเขตของโมดูลและฟังก์ชัน)](#หัวข้อที่-8-type-hints-at-boundaries-การระบุ-type-hints-ที่ขอบเขตของโมดูลและฟังก์ชัน)
9. [หัวข้อที่ 9: Dependency Injection for Testability (การฉีด Collaborators เพื่อเพิ่มประสิทธิภาพการทดสอบ)](#หัวข้อที่-9-dependency-injection-for-testability-การฉีด-collaborators-เพื่อเพิ่มประสิทธิภาพการทดสอบ)
10. [หัวข้อที่ 10: Async and Await Boundaries (การจัดการงานอะซิงโครนัสและ Concurrency ด้วย asyncio)](#หัวข้อที่-10-async-and-await-boundaries-การจัดการงานอะซิงโครนัสและ-concurrency-ด้วย-asyncio)

---

## หัวข้อที่ 1: Naming and Readability (การตั้งชื่อและความอ่านง่ายของโค้ด)

- **สรุปสาระสำคัญ:** เน้นการใช้ชื่อตัวแปรและฟังก์ชันขนาดเล็กที่อธิบายเจตนา (Intent) ทางธุรกิจอย่างชัดเจน เพื่อให้อ่านเข้าใจได้ทันทีโดยไม่ต้องเสียเวลาตีความตัวย่อ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ชื่อย่อหรือชื่อที่สั้นเกินไป (เช่น `calc`, `x`, `c`, `a`) บังคับให้ผู้รีวิวต้องทำการย้อนกระบวนการคิด (Reverse Engineer) และเดาโครงสร้างของโดเมนด้วยตนเอง ทำให้โค้ดอ่านยากและเสี่ยงต่อการเข้าใจผิด
- **ตัวอย่างโค้ด:**

```python
# review_score.py
def calc(x):
    # Short names force reviewers to decode the domain first.
    a = len(x.c) * 2
    b = x.a * 5
    return a + b
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตั้งชื่อฟังก์ชันและตัวแปรย่อยตามแนวคิดของธุรกิจ (เช่น `calculate_review_score`, `comment_score`, `approval_score`) ทำให้เข้าใจสูตรคำนวณคะแนนได้ทันที อ่านง่ายเสมือนภาษาพูด
- **ตัวอย่างโค้ด:**

```python
# review_score.py
def calculate_review_score(review):
    # Names show which review signals affect the score.
    comment_score = len(review.comments) * 2
    approval_score = review.approvals * 5
    return comment_score + approval_score
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** เน้นการใช้ชื่อตัวแปรและฟังก์ชันขนาดเล็กที่อธิบายเจตนา (Intent) ทางธุรกิจอย่างชัดเจน เพื่อให้อ่านเข้าใจได้ทันทีโดยไม่ต้องเสียเวลาตีความตัวย่อ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Truthy, Falsy, and None Checks (การตรวจสอบความจริง เท็จ และค่า None อย่างถูกต้อง)

- **สรุปสาระสำคัญ:** ต้องแยกแยะระหว่างข้อมูลที่ขาดหายไป (Missing value หรือ `None`) กับค่าประเภท Falsy ที่มีความหมายและตั้งใจส่งมา เช่น สตริงว่าง (`""`), เลขศูนย์ (`0`), หรือคอลเลกชันว่าง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้การตรวจสอบแบบ Truthy (`if user.nickname:`) จะมองว่าค่า Falsy ทั้งหมด (`""`, `0`, `False`, `None`) เป็นกรณีที่ไม่พบข้อมูลเหมือนกัน ทำให้สตริงว่างที่ผู้ใช้ตั้งใจระบุถูกมองข้ามและข้ามไปใช้ค่า Fallback โดยไม่ถูกต้อง
- **ตัวอย่างโค้ด:**

```python
# display_name.py
def display_name(user):
    # This treats "", 0, False, and None as the same case.
    if user.nickname:
        return user.nickname
    return user.full_name
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบเฉพาะเจาะจงด้วย `is None` เมื่อต้องการเช็กการไม่มีอยู่ของข้อมูลจริง ๆ เพื่อยอมรับค่า Falsy ที่ตั้งใจส่งมา (เช่น สตริงว่าง) ให้ทำงานได้อย่างถูกต้อง
- **ตัวอย่างโค้ด:**

```python
# display_name.py
def display_name(user):
    # None means the caller did not provide a nickname.
    if user.nickname is None:
        return user.full_name
    return user.nickname
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ต้องแยกแยะระหว่างข้อมูลที่ขาดหายไป (Missing value หรือ `None`) กับค่าประเภท Falsy ที่มีความหมายและตั้งใจส่งมา เช่น สตริงว่าง (`""`), เลขศูนย์ (`0`), หรือคอลเลกชันว่าง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Mutable Default Arguments (การหลีกเลี่ยงค่าเริ่มต้นแบบ Mutable ในพารามิเตอร์)

- **สรุปสาระสำคัญ:** หลีกเลี่ยงการใช้ค่าเริ่มต้นแบบแปรเปลี่ยนได้ (Mutable defaults เช่น `[]` หรือ `{}`) ในลายเซ็นฟังก์ชัน โดยให้ใช้วิธีสร้างวัตถุใหม่ภายในตัวฟังก์ชันแทน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ค่าเริ่มต้นของอาร์กิวเมนต์ใน Python ถูกประเมินค่าเพียงครั้งเดียวเมื่อโหลดโมดูล การกำหนด `tags=[]` จะทำให้เกิดการใช้ List เดียวกันซ้ำในทุกๆ การเรียก ส่งผลให้ข้อมูลรั่วไหลและเกิดการปะปนกันของ State ข้ามคำขอหรือข้ามเคสการทดสอบ
- **ตัวอย่างโค้ด:**

```python
# tags.py
def add_review_tag(tag, tags=[]):
    # This default list is reused across every call.
    tags.append(tag)
    return tags
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดค่าเริ่มต้นเป็น `None` และสร้าง List ใหม่ภายในฟังก์ชันเฉพาะกรณีที่ผู้เรียกไม่ได้ส่งอาร์กิวเมนต์มา เพื่อให้มั่นใจว่าแต่ละการเรียกใช้จะได้วัตถุใหม่เสมอ
- **ตัวอย่างโค้ด:**

```python
# tags.py
def add_review_tag(tag, tags=None):
    # Create a fresh list only when the caller omitted tags.
    if tags is None:
        tags = []
    tags.append(tag)
    return tags
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** หลีกเลี่ยงการใช้ค่าเริ่มต้นแบบแปรเปลี่ยนได้ (Mutable defaults เช่น `[]` หรือ `{}`) ในลายเซ็นฟังก์ชัน โดยให้ใช้วิธีสร้างวัตถุใหม่ภายในตัวฟังก์ชันแทน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: List and Dict Comprehensions (การใช้ Comprehensions ให้เหมาะสมและอ่านง่าย)

- **สรุปสาระสำคัญ:** เลือกใช้ Comprehension สำหรับงานกรอง (Filter) และแปลงข้อมูล (Map) ที่กระชับ แต่ควรสลับไปใช้ลูปมาตรฐานเมื่อมีโครงสร้างการแตกกิ่งเงื่อนไข (Branching) ซับซ้อน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การซ้อนเงื่อนไข `if` หลายชั้นภายในลูป `for` สำหรับการแปลงคอลเลกชันพื้นฐาน ทำให้โค้ดยาวและบดบังเจตนาที่แท้จริงของการกรองและแปลงข้อมูล
- **ตัวอย่างโค้ด:**

```python
# reviewers.py
def active_reviewer_emails(users):
    # Nested branches hide the simple filter-and-map intent.
    emails = []
    for user in users:
        if user.is_active:
            if user.email:
                emails.append(user.email.lower())
    return emails
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ List Comprehension รวบกระบวนการกรองและแปลงค่าไว้ในโครงสร้างเดียวที่กระชับ สื่อเจตนาในการทำงานได้ชัดเจนทันที
- **ตัวอย่างโค้ด:**

```python
# reviewers.py
def active_reviewer_emails(users):
    # One filter plus one transformation fits a comprehension.
    return [
        user.email.lower()
        for user in users
        if user.is_active and user.email
    ]
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** เลือกใช้ Comprehension สำหรับงานกรอง (Filter) และแปลงข้อมูล (Map) ที่กระชับ แต่ควรสลับไปใช้ลูปมาตรฐานเมื่อมีโครงสร้างการแตกกิ่งเงื่อนไข (Branching) ซับซ้อน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Exception Boundaries (การกำหนดขอบเขตข้อผิดพลาดและ Exception Chaining)

- **สรุปสาระสำคัญ:** ดักจับข้อยกเว้นเฉพาะเจาะจงตรงขอบเขตการทำงาน (Boundary) และรักษาสาเหตุข้อผิดพลาดดั้งเดิมไว้ด้วย Exception Chaining (`raise ... from error`)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ `except Exception:` เพื่อดักจับทุกอย่างแล้วคืนค่า Default (เช่น `{}`) จะซ่อนข้อผิดพลาดที่แท้จริง ทั้งบั๊กโปรแกรมเมอร์ ไฟล์หาย หรือโครงสร้างข้อมูลผิดพลาด กลายเป็นค่าว่างเงียบๆ ทำให้สืบหาต้นตอได้ยากมาก
- **ตัวอย่างโค้ด:**

```python
# settings.py
import json

def load_settings(path):
    try:
        # The file handle is not scoped, and the default encoding is hidden.
        return json.load(open(path))
    except Exception:
        # Catching everything turns real failures into silent defaults.
        return {}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ดักจับเฉพาะประเภทข้อยกเว้นที่คาดการณ์ไว้ (`FileNotFoundError`, `json.JSONDecodeError`) แล้วโยน Domain Exception พร้อมส่งผ่าน `from error` เพื่อคงประวัติความล้มเหลวเดิมไว้ตรวจสอบ
- **ตัวอย่างโค้ด:**

```python
# settings.py
import json

class SettingsError(Exception):
    pass

def load_settings(path):
    try:
        # The boundary handles only the file and JSON errors it expects.
        with open(path, encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError as error:
        raise SettingsError(f"Settings file not found: {path}") from error
    except json.JSONDecodeError as error:
        raise SettingsError(f"Settings file is invalid JSON: {path}") from error
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ดักจับข้อยกเว้นเฉพาะเจาะจงตรงขอบเขตการทำงาน (Boundary) และรักษาสาเหตุข้อผิดพลาดดั้งเดิมไว้ด้วย Exception Chaining (`raise ... from error`)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Context Managers for Files (การจัดการไฟล์และทรัพยากรด้วย with Statement)

- **สรุปสาระสำคัญ:** ใช้ Context Manager (`with` statement) ในการจัดการทรัพยากร เพื่อให้แน่ใจว่าทรัพยากรจะถูกปิดอย่างปลอดภัยเสมอแม้งานจะเกิดข้อผิดพลาด

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การเปิดไฟล์แล้วพึ่งพาการสั่ง `.close()` ด้วยตัวเอง มีความเสี่ยงหากเกิด Exception ระหว่างทำงานก่อนถึงบรรทัดปิดไฟล์ ส่งผลให้เปิดไฟล์ค้างไว้ (Resource Leak) และการไม่ระบุ Encoding ทำให้ผลลัพธ์ผันแปรตามสภาพแวดล้อม
- **ตัวอย่างโค้ด:**

```python
# export_reviews.py
def write_review_export(path, rows):
    # An exception before close can leave the file handle open.
    file = open(path, "w")
    for row in rows:
        file.write(f"{row.id},{row.status}\n")
    file.close()
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ `with open(..., encoding="utf-8")` กำหนดขอบเขตอายุการใช้งานของไฟล์อย่างชัดเจน ปิดไฟล์ให้อัตโนมัติแม้เกิดข้อผิดพลาด และกำหนด Encoding ป้องกันปัญหาข้ามแพลตฟอร์ม
- **ตัวอย่างโค้ด:**

```python
# export_reviews.py
def write_review_export(path, rows):
    # with closes the file even if writing a row fails.
    with open(path, "w", encoding="utf-8") as file:
        for row in rows:
            file.write(f"{row.id},{row.status}\n")
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Context Manager (`with` statement) ในการจัดการทรัพยากร เพื่อให้แน่ใจว่าทรัพยากรจะถูกปิดอย่างปลอดภัยเสมอแม้งานจะเกิดข้อผิดพลาด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Dataclasses for Data Shapes (การใช้ Dataclasses กำหนดโครงสร้างข้อมูลที่แน่นอน)

- **สรุปสาระสำคัญ:** ใช้ Dataclass กำหนดโครงสร้างข้อมูลภายในแอปพลิเคชันให้เสถียรและมีชื่อฟิลด์ชัดเจน แทนการใช้ Dictionary แบบหลวมๆ ที่เสี่ยงต่อการระบุคีย์ผิด

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การคืนค่าข้อมูลเป็น Dictionary ที่ใช้คีย์คลุมเครือ (`"id"`, `"name"`, `"ok"`) ทำให้ผู้เรียกใช้งานต้องคาดเดาโครงสร้าง พิมพ์คีย์ผิดได้ง่าย และตรวจพบความผิดพลาดได้ยาก
- **ตัวอย่างโค้ด:**

```python
# review_summary.py
def summarize_review(review):
    # Vague dict keys make the returned shape easy to misunderstand.
    return {
        "id": review.id,
        "name": review.title,
        "ok": review.status == "approved",
    }
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดรูปแบบด้วย `@dataclass(frozen=True)` เพื่อให้ชื่อฟิลด์และโครงสร้างข้อมูลที่ส่งกลับชัดเจน ตรวจสอบง่าย รองรับ Autocompletion ใน IDE และสะดวกต่อการทดสอบ
- **ตัวอย่างโค้ด:**

```python
# review_summary.py
from dataclasses import dataclass

@dataclass(frozen=True)
class ReviewSummary:
    review_id: int
    title: str
    approved: bool

def summarize_review(review):
    # The named shape makes every returned field explicit.
    return ReviewSummary(
        review_id=review.id,
        title=review.title,
        approved=review.status == "approved",
    )
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Dataclass กำหนดโครงสร้างข้อมูลภายในแอปพลิเคชันให้เสถียรและมีชื่อฟิลด์ชัดเจน แทนการใช้ Dictionary แบบหลวมๆ ที่เสี่ยงต่อการระบุคีย์ผิด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Type Hints at Boundaries (การระบุ Type Hints ที่ขอบเขตของโมดูลและฟังก์ชัน)

- **สรุปสาระสำคัญ:** ระบุ Type Hints ในจุดขอบเขตของโมดูล (Module Boundaries) ทั้งส่วนอินพุตและเอาต์พุต เพื่อเปิดเผยข้อตกลงในการใช้งานให้ชัดเจนต่อทั้งผู้พัฒนาและระบบ Static Analysis

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การไม่ระบุชนิดข้อมูลของพารามิเตอร์และค่าส่งกลับ ทำให้ผู้ใช้งานฟังก์ชันต้องคาดเดาสัญญาข้อมูล (Contract) ว่ารองรับชนิดข้อมูลใด ส่งผลให้เสี่ยงต่อปัญหา Type Errors
- **ตัวอย่างโค้ด:**

```python
# review_input.py
def parse_review_input(payload):
    # Untyped input and output make callers guess the contract.
    return {
        "title": payload["title"],
        "author_id": payload["author_id"],
    }
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดชนิดข้อมูลอินพุตด้วย `Mapping[str, object]` และกำหนดเอาต์พุตด้วย Dataclass `ReviewInput` ทำให้ขอบเขตข้อตกลงชัดเจนและสามารถรีวิวโค้ดได้ง่ายขึ้น
- **ตัวอย่างโค้ด:**

```python
# review_input.py
from dataclasses import dataclass
from typing import Mapping

@dataclass(frozen=True)
class ReviewInput:
    title: str
    author_id: int

def parse_review_input(payload: Mapping[str, object]) -> ReviewInput:
    # Boundary types show callers what comes in and what comes back.
    return ReviewInput(
        title=str(payload["title"]),
        author_id=int(payload["author_id"]),
    )
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ระบุ Type Hints ในจุดขอบเขตของโมดูล (Module Boundaries) ทั้งส่วนอินพุตและเอาต์พุต เพื่อเปิดเผยข้อตกลงในการใช้งานให้ชัดเจนต่อทั้งผู้พัฒนาและระบบ Static Analysis

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Dependency Injection for Testability (การฉีด Collaborators เพื่อเพิ่มประสิทธิภาพการทดสอบ)

- **สรุปสาระสำคัญ:** ส่งผ่านวัตถุพึ่งพา (Collaborators) เข้าไปในฟังก์ชันหรือคลาส เพื่อให้สามารถทดสอบพฤติกรรมได้โดยไม่ต้องพึ่งพาการ Monkey Patch มอดูลระดับ Global

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การอิมพอร์ตฟังก์ชันที่มี Side-effect มาใช้งานโดยตรงภายในฟังก์ชัน ทำให้โค้ดผูกติดแน่น (Tight Coupling) และบังคับให้เคสการทดสอบต้องพึ่งพาการ Patch เส้นทางการอิมพอร์ต
- **ตัวอย่างโค้ด:**

```python
# notifications.py
from app.email import send_email

def notify_reviewer(review):
    # The global sender makes tests patch the import path.
    send_email(
        review.reviewer_email,
        "Review requested",
        f"Review {review.title} is ready",
    )
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้การฉีด Dependency ผ่านอาร์กิวเมนต์ (`mailer`) ทำให้สามารถส่งวัตถุจำลอง (Fake/Mock Object) ในการทดสอบเพื่อตรวจสอบการส่งข้อความได้อย่างตรงไปตรงมา
- **ตัวอย่างโค้ด:**

```python
# notifications.py
def notify_reviewer(review, mailer):
    # Tests can pass a fake mailer and inspect the message.
    message = f"Review {review.title} is ready"
    mailer.send(
        to=review.reviewer_email,
        subject="Review requested",
        body=message,
    )
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ส่งผ่านวัตถุพึ่งพา (Collaborators) เข้าไปในฟังก์ชันหรือคลาส เพื่อให้สามารถทดสอบพฤติกรรมได้โดยไม่ต้องพึ่งพาการ Monkey Patch มอดูลระดับ Global

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Async and Await Boundaries (การจัดการงานอะซิงโครนัสและ Concurrency ด้วย asyncio)

- **สรุปสาระสำคัญ:** รอการทำงานอะซิงโครนัสและรวบรวมคำสั่งที่เป็นอิสระต่อกันด้วย `asyncio.gather` เพื่อให้แน่ใจว่า Coroutine รันจนเสร็จสมบูรณ์ ไม่รั่วไหลออกไปโดยยังทำรายการไม่เสร็จ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การสร้าง Coroutine Object แล้วจัดเก็บลง List คืนกลับไปโดยไม่สั่ง `await` จะทำให้ผู้รับได้ไปเพียงอ็อบเจกต์ที่ยังไม่ได้ประมวลผล ส่งผลให้งาน I/O ที่ตั้งใจไว้อาจไม่เคยเกิดขึ้นจริง
- **ตัวอย่างโค้ด:**

```python
# profiles.py
async def fetch_profiles(user_ids, api):
    profiles = []
    for user_id in user_ids:
        # This appends coroutine objects, not fetched profiles.
        profiles.append(api.fetch_profile(user_id))
    return profiles
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** รวบรวมงานอะซิงโครนัสที่เป็นอิสระต่อกันแล้วสั่ง `await asyncio.gather(*tasks)` เพื่อให้ประมวลผลงานแบบ Concurrency พร้อมคืนค่าข้อมูลจริงกลับมาอย่างสมบูรณ์
- **ตัวอย่างโค้ด:**

```python
# profiles.py
import asyncio

async def fetch_profiles(user_ids, api):
    # Gather independent async calls so the result is real data.
    tasks = [api.fetch_profile(user_id) for user_id in user_ids]
    return await asyncio.gather(*tasks)
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** รอการทำงานอะซิงโครนัสและรวบรวมคำสั่งที่เป็นอิสระต่อกันด้วย `asyncio.gather` เพื่อให้แน่ใจว่า Coroutine รันจนเสร็จสมบูรณ์ ไม่รั่วไหลออกไปโดยยังทำรายการไม่เสร็จ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด Python ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Naming and Readability:** นำหลักการ "การตั้งชื่อและความอ่านง่ายของโค้ด" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Truthy, Falsy, and None Checks:** นำหลักการ "การตรวจสอบความจริง เท็จ และค่า None อย่างถูกต้อง" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Mutable Default Arguments:** นำหลักการ "การหลีกเลี่ยงค่าเริ่มต้นแบบ Mutable ในพารามิเตอร์" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **List and Dict Comprehensions:** นำหลักการ "การใช้ Comprehensions ให้เหมาะสมและอ่านง่าย" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Exception Boundaries:** นำหลักการ "การกำหนดขอบเขตข้อผิดพลาดและ Exception Chaining" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Context Managers for Files:** นำหลักการ "การจัดการไฟล์และทรัพยากรด้วย with Statement" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Dataclasses for Data Shapes:** นำหลักการ "การใช้ Dataclasses กำหนดโครงสร้างข้อมูลที่แน่นอน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Type Hints at Boundaries:** นำหลักการ "การระบุ Type Hints ที่ขอบเขตของโมดูลและฟังก์ชัน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Dependency Injection for Testability:** นำหลักการ "การฉีด Collaborators เพื่อเพิ่มประสิทธิภาพการทดสอบ" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Async and Await Boundaries:** นำหลักการ "การจัดการงานอะซิงโครนัสและ Concurrency ด้วย asyncio" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

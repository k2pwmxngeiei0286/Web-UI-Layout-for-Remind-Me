# Git Workflow & Version Control Best Practices Guide
### คู่มือแนวทางการใช้งาน Git และการจัดการ Version Control อย่างมืออาชีพ

> [!NOTE]
> - **หมวดหมู่ (Category):** DevOps & Version Control
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Git Pro Workflows, Conventional Commits, Atomic History, Secure Secret Handling
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 แนวทางปฏิบัติการใช้งาน Git: Pre-work Status Check, Interactive Staging, Atomic Commits, Branching & Upstream Tracking, Rebase Sync, Diff Review, Conflict Resolution, Revert vs Reset, Secret Protection และ Release Tags
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Status Before Work (การตรวจสอบสถานะของสาขาและพื้นที่ทำงานก่อนเริ่มงาน)](#หัวข้อที่-1-status-before-work-การตรวจสอบสถานะของสาขาและพื้นที่ทำงานก่อนเริ่มงาน)
2. [หัวข้อที่ 2: Interactive Staging Hunks (การเลือก Stage เฉพาะส่วนโค้ดด้วย git add -p)](#หัวข้อที่-2-interactive-staging-hunks-การเลือก-stage-เฉพาะส่วนโค้ดด้วย-git-add--p)
3. [หัวข้อที่ 3: Atomic Commits and Messages (การสร้าง Atomic Commit และข้อความที่สื่อความหมาย)](#หัวข้อที่-3-atomic-commits-and-messages-การสร้าง-atomic-commit-และข้อความที่สื่อความหมาย)
4. [หัวข้อที่ 4: Branch Naming and Upstream (การตั้งชื่อ Topic Branch และการผูก Upstream Tracking)](#หัวข้อที่-4-branch-naming-and-upstream-การตั้งชื่อ-topic-branch-และการผูก-upstream-tracking)
5. [หัวข้อที่ 5: Fetch, Pull, and Rebase Sync (การซิงก์ประวัติโค้ดด้วย Fetch และ Rebase อย่างปลอดภัย)](#หัวข้อที่-5-fetch-pull-and-rebase-sync-การซิงก์ประวัติโค้ดด้วย-fetch-และ-rebase-อย่างปลอดภัย)
6. [หัวข้อที่ 6: Reviewing Diffs Before Push (การตรวจสอบ Diff และ Whitespace ก่อนสั่ง Push)](#หัวข้อที่-6-reviewing-diffs-before-push-การตรวจสอบ-diff-และ-whitespace-ก่อนสั่ง-push)
7. [หัวข้อที่ 7: Conflict Resolution Without Overwriting (การแก้ Conflict อย่างมีสติและทดสอบซ้ำก่อน Rebase ต่อ)](#หัวข้อที่-7-conflict-resolution-without-overwriting-การแก้-conflict-อย่างมีสติและทดสอบซ้ำก่อน-rebase-ต่อ)
8. [หัวข้อที่ 8: Revert vs Reset (การเลือกใช้ Revert บนประวัติที่แชร์ และ Reset บนประวัติภายใน)](#หัวข้อที่-8-revert-vs-reset-การเลือกใช้-revert-บนประวัติที่แชร์-และ-reset-บนประวัติภายใน)
9. [หัวข้อที่ 9: Gitignore and Secret Safety (การป้องกัน Secrets และลบไฟล์หลุดด้วย git rm --cached)](#หัวข้อที่-9-gitignore-and-secret-safety-การป้องกัน-secrets-และลบไฟล์หลุดด้วย-git-rm---cached)
10. [หัวข้อที่ 10: Tags and Release Points (การสร้าง Annotated Release Tag ที่ปลอดภัยและทดสอบแล้ว)](#หัวข้อที่-10-tags-and-release-points-การสร้าง-annotated-release-tag-ที่ปลอดภัยและทดสอบแล้ว)

---

## หัวข้อที่ 1: Status Before Work (การตรวจสอบสถานะของสาขาและพื้นที่ทำงานก่อนเริ่มงาน)

- **สรุปสาระสำคัญ:** การตรวจสอบสถานะของสาขา (Branch), ความสะอาดของพื้นที่ทำงาน (Working tree) และ Remote state ก่อนเริ่มแก้ไขโค้ดทุกครั้ง เพื่อป้องกันไม่ให้สร้างงานบนฐานโค้ดที่ผิดพลาด

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การรันคำสั่ง `git pull` ทันทีโดยไม่ตรวจสอบสถานะเดิม จากนั้นแก้ไขไฟล์ แล้วสั่ง `git add .` และ `git commit` โดยไม่รู้ว่าตนเองกำลังทำงานอยู่บน Branch ใด หรือมีโค้ดส่วนใดเปลี่ยนแปลงไปบ้าง ซึ่งทำให้ยากต่อการตรวจสอบประวัติย้อนหลังและอาจสร้าง Commit บนฐานที่ไม่ถูกต้อง
- **ตัวอย่างโค้ด:**

```bash
# Pull ทันทีโดยไม่ตรวจสอบสถานะ อาจซ่อนการเปลี่ยนแปลงของ Base โค้ด
git pull
code src/app.ts
git add .
git commit -m "updates"
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบ Branch ปัจจุบันและความสะอาดของ Working tree ก่อนเป็นอันดับแรก จากนั้นใช้ `git fetch` เพื่ออัปเดต Remote state และดูความแตกต่างของไฟล์ (diff) ก่อนลงมือแก้ไขโค้ดเสมอ
- **ตัวอย่างโค้ด:**

```bash
# ยืนยัน Branch และสถานะไฟล์ก่อนทำการแก้ไข
git status --short --branch
git fetch origin
git status --short --branch
git diff --stat
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การตรวจสอบสถานะของสาขา (Branch), ความสะอาดของพื้นที่ทำงาน (Working tree) และ Remote state ก่อนเริ่มแก้ไขโค้ดทุกครั้ง เพื่อป้องกันไม่ให้สร้างงานบนฐานโค้ดที่ผิดพลาด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Interactive Staging Hunks (การเลือก Stage เฉพาะส่วนโค้ดด้วย git add -p)

- **สรุปสาระสำคัญ:** การคัดเลือกและ Stage เฉพาะส่วนของโค้ด (Hunks) ที่เกี่ยวข้องกันอย่างพิถีพิถันก่อนทำ Commit เพื่อให้แต่ละ Commit บรรจุเฉพาะการเปลี่ยนแปลงที่เกี่ยวข้องกันจริงๆ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้คำสั่ง `git add .` เพื่อ Stage การเปลี่ยนแปลงทั้งหมดรวดเดียว ส่งผลให้โค้ดที่ไม่เกี่ยวข้องกัน ไฟล์ที่สร้างขึ้นชั่วคราว (generated files) หรือโค้ดที่ใช้ Debug ถูกรวมเข้าไปใน Commit เดียวกัน ทำให้รีวิวยากและระบุเจตนาของการแก้ไขไม่ได้
- **ตัวอย่างโค้ด:**

```bash
# สั่ง Stage ทั้งหมดรวมถึงไฟล์ Debug และไฟล์สร้างใหม่อื่นๆ
git add .
git commit -m "fix stuff"
git push
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบ Unstaged diff ก่อน แล้วใช้คำสั่ง `git add -p` เพื่อเลือก Stage ทีละ Hunk ที่เกี่ยวข้องกัน จากนั้นตรวจสอบ Staged diff อีกครั้งก่อน Commit
- **ตัวอย่างโค้ด:**

```bash
# ตรวจสอบ diff แล้วเลือก Stage เฉพาะ Hunk ที่เกี่ยวข้อง
git diff
git add -p src/review.ts
git diff --staged
git commit -m "fix review navigation labels"
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การคัดเลือกและ Stage เฉพาะส่วนของโค้ด (Hunks) ที่เกี่ยวข้องกันอย่างพิถีพิถันก่อนทำ Commit เพื่อให้แต่ละ Commit บรรจุเฉพาะการเปลี่ยนแปลงที่เกี่ยวข้องกันจริงๆ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Atomic Commits and Messages (การสร้าง Atomic Commit และข้อความที่สื่อความหมาย)

- **สรุปสาระสำคัญ:** การทำ Commit แบบ Atomic คือแบ่ง Commit ให้มีขนาดเล็กพอเหมาะต่อการรีวิว และเขียน Commit message ที่อธิบายเหตุผลหรือเจตนาของการเปลี่ยนแปลงทั้งในมุมการใช้งานหรือการบำรุงรักษา

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การทำ "Grab-bag commit" ที่รวมเอาการปรับปรุง UI และการเขียน Test เข้าไว้ด้วยกัน พร้อมระบุข้อความสั้นๆ เช่น "work" ผู้รีวิวไม่สามารถแยกแยะวัตถุประสงค์ของการแก้ไขได้ และหากต้องการ Revert เฉพาะส่วนจะทำได้ยากและมีความเสี่ยงสูง
- **ตัวอย่างโค้ด:**

```bash
# มัดรวมทุกไฟล์และตั้งชื่อ commit สั้นๆ ไม่สื่อความหมาย
git add .
git commit -m "work"
git push
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกการเปลี่ยนแปลงพฤติกรรมระบบออกจากชุดทดสอบ (Test coverage) และระบุ Commit message ที่อธิบายถึงเหตุผลของการแก้ไขชัดเจน
- **ตัวอย่างโค้ด:**

```bash
# Commit สำหรับการปรับปรุงพฤติกรรม UI
git add components/lesson/lesson-pager.tsx
git commit -m "improve lesson navigation controls"

# แยก Commit สำหรับครอบคลุมการทดสอบ
git add tests/content/navigation.test.ts
git commit -m "cover lesson navigation boundaries"
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การทำ Commit แบบ Atomic คือแบ่ง Commit ให้มีขนาดเล็กพอเหมาะต่อการรีวิว และเขียน Commit message ที่อธิบายเหตุผลหรือเจตนาของการเปลี่ยนแปลงทั้งในมุมการใช้งานหรือการบำรุงรักษา

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Branch Naming and Upstream (การตั้งชื่อ Topic Branch และการผูก Upstream Tracking)

- **สรุปสาระสำคัญ:** การตั้งชื่อ Topic branch ให้สื่อความหมายถึงประเภทของงาน และการตั้งค่า Upstream tracking เพื่อให้การ Sync โค้ดในอนาคตไปยัง Remote branch ที่ถูกต้อง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การ Commit โค้ดโดยตรงบน Branch `main` แล้วสั่ง Push ขึ้น `origin HEAD` โดยไม่มีเป้าหมายที่ชัดเจน เพิ่มความเสี่ยงของการเกิดข้อผิดพลาดบน Branch หลัก และทำให้ยากต่อการรีวิว
- **ตัวอย่างโค้ด:**

```bash
# Commit โดยตรงบน main และ push ขึ้น HEAD โดยไม่ระบุเป้าหมาย
git switch main
git commit -am "changes"
git push origin HEAD
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สลับไปสร้าง Topic branch ที่มีชื่อระบุวัตถุประสงค์ชัดเจน พร้อมกำหนด Upstream tracking ด้วย `-u` ในการ Push ครั้งแรก
- **ตัวอย่างโค้ด:**

```bash
# สร้าง Topic branch และตั้งค่า Upstream tracking ชัดเจน
git switch -c feature/git-track-lessons
git push -u origin feature/git-track-lessons
git status --short --branch
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การตั้งชื่อ Topic branch ให้สื่อความหมายถึงประเภทของงาน และการตั้งค่า Upstream tracking เพื่อให้การ Sync โค้ดในอนาคตไปยัง Remote branch ที่ถูกต้อง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Fetch, Pull, and Rebase Sync (การซิงก์ประวัติโค้ดด้วย Fetch และ Rebase อย่างปลอดภัย)

- **สรุปสาระสำคัญ:** การสั่ง `git fetch` เพื่อดูความเปลี่ยนแปลงจาก Upstream ก่อนรวมโค้ดเสมอ และเลือกใช้การ Merge หรือ Rebase อย่างตั้งใจตามบริบทของ Branch

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้คำสั่ง `git pull` โดยไม่ตรวจสอบก่อนว่ามีการเปลี่ยนแปลงใดจาก Upstream บ้าง แล้วตามด้วย `git push --force` โดยไม่ได้ตรวจผลลัพธ์ ทำให้ประวัติการแก้โค้ดถูกเขียนทับอย่างไม่ตั้งใจ
- **ตัวอย่างโค้ด:**

```bash
# Pull โดยไม่ตรวจสอบ แล้ว force push ทับประวัติโดยไม่ตรวจเช็ก
git pull
git push --force
git status
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สั่ง `git fetch` เพื่อให้มองเห็นความเปลี่ยนแปลงของ Remote ก่อน จากนั้นตรวจสอบ Log และทำ Rebase บน Feature branch พร้อมสั่งรัน Test ยืนยันการทำงาน
- **ตัวอย่างโค้ด:**

```bash
# Fetch เพื่อดูการเปลี่ยนแปลงก่อน แล้ว rebase และรัน test ยืนยัน
git fetch origin
git log --oneline --decorate --max-count=5 HEAD..origin/main
git rebase origin/main
npm test
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การสั่ง `git fetch` เพื่อดูความเปลี่ยนแปลงจาก Upstream ก่อนรวมโค้ดเสมอ และเลือกใช้การ Merge หรือ Rebase อย่างตั้งใจตามบริบทของ Branch

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Reviewing Diffs Before Push (การตรวจสอบ Diff และ Whitespace ก่อนสั่ง Push)

- **สรุปสาระสำคัญ:** การตรวจสอบ Diff ของไฟล์ทั้งส่วนที่ยังไม่ Stage, Staged แล้ว และ Commits ที่เตรียมส่งออกไป ก่อนสั่ง Push ขึ้น Remote เพื่อป้องกันไฟล์ขยะหรือโค้ด Debug หลุดออกไป

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การสั่ง `git add .` และ `git commit` แล้ว Push ทันทีโดยไม่มีการตรวจทานในเครื่องตนเองก่อน ส่งผลให้การรีวิวเกิดขึ้นหลัง Push ซึ่งสายเกินไปหากมีไฟล์ที่ไม่เกี่ยวข้องหลุดออกไป
- **ตัวอย่างโค้ด:**

```bash
# Push ทันทีโดยไม่มีการ Local review ก่อน
git add .
git commit -m "final"
git push
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบข้อผิดพลาดเรื่อง Whitespace ด้วย `git diff --check` เช็ก Staged/Unstaged diff และตรวจสอบ Commit log ก่อนสั่ง Push
- **ตัวอย่างโค้ด:**

```bash
# ตรวจสอบการเปลี่ยนแปลงและ commit log ก่อน push
git diff --check
git diff
git diff --staged
git log --oneline origin/main..HEAD
git push
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การตรวจสอบ Diff ของไฟล์ทั้งส่วนที่ยังไม่ Stage, Staged แล้ว และ Commits ที่เตรียมส่งออกไป ก่อนสั่ง Push ขึ้น Remote เพื่อป้องกันไฟล์ขยะหรือโค้ด Debug หลุดออกไป

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Conflict Resolution Without Overwriting (การแก้ Conflict อย่างมีสติและทดสอบซ้ำก่อน Rebase ต่อ)

- **สรุปสาระสำคัญ:** การแก้ไข Conflict โดยทำความเข้าใจเจตนาของโค้ดทั้งสองฝั่ง แล้ว Stage เฉพาะไฟล์ที่ผ่านการแก้ไขและทดสอบแล้ว แทนที่จะเลือกทับฝั่งใดฝั่งหนึ่งอย่างหลับตา

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้คำสั่งเชิงกลยุทธ์แบบรวบรัด เช่น `git checkout --theirs .` และ Force push เพื่อเคลียร์ Conflict ซึ่งเสี่ยงต่อการลบงานหรือการตัดสินใจในระดับส่วนธุรกิจ (Domain decisions) ของฝั่งตนเองหรือเพื่อนร่วมทีมออกไปโดยไม่ตั้งใจ
- **ตัวอย่างโค้ด:**

```bash
# เลือกเอาฝั่งอื่นทั้งหมดโดยไม่ดูไฟล์ แล้ว force push
git checkout --theirs .
git add .
git rebase --continue
git push --force
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบไฟล์ที่มี Conflict ดูความแตกต่างทั้งสองฝั่ง ปรับแก้ไฟล์ให้ถูกต้อง รัน Automate test ยืนยัน แล้วจึง Stage ไฟล์นั้นเพื่อดำเนินการ Rebase ต่อไป
- **ตัวอย่างโค้ด:**

```bash
# ตรวจสอบจุดขัดแย้ง ปรับแก้ รัน test และ stage เฉพาะไฟล์ที่แก้ไขแล้ว
git status
git diff --merge src/lesson.ts
code src/lesson.ts
npm test
git add src/lesson.ts
git rebase --continue
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การแก้ไข Conflict โดยทำความเข้าใจเจตนาของโค้ดทั้งสองฝั่ง แล้ว Stage เฉพาะไฟล์ที่ผ่านการแก้ไขและทดสอบแล้ว แทนที่จะเลือกทับฝั่งใดฝั่งหนึ่งอย่างหลับตา

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Revert vs Reset (การเลือกใช้ Revert บนประวัติที่แชร์ และ Reset บนประวัติภายใน)

- **สรุปสาระสำคัญ:** การเลือกใช้ `revert` เมื่อต้องการยกเลิกการเปลี่ยนแปลงบน History ที่ถูก Push และแชร์กับทีมไปแล้ว และใช้ `reset` เฉพาะการ Cleanup ประวัติภายในเครื่องตนเองก่อน Push เท่านั้น

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การสั่ง `git reset --hard` บน Branch `main` ที่ถูกแชร์ให้ทีมไปแล้ว แล้ว Force push ทับ ซึ่งเป็นการเขียนประวัติศาสตร์ใหม่ ส่งผลกระทบทำให้ Repository ของเพื่อนร่วมทีมคนอื่นเกิดปัญหาทันที
- **ตัวอย่างโค้ด:**

```bash
# Reset ประวัติบน main ที่แชร์ไปแล้ว แล้ว force push
git switch main
git reset --hard HEAD~1
git push --force
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** สลับมาที่ `main` ดึงโค้ดล่าสุด แล้วใช้คำสั่ง `git revert` เพื่อสร้าง Commit ใหม่ที่ยกเลิกพฤติกรรมเดิม โดยยังคงรักษา History เดิมที่แชร์ร่วมกันไว้
- **ตัวอย่างโค้ด:**

```bash
# ใช้ revert เพื่อยกเลิกการเปลี่ยนแปลงโดยไม่ทำลายประวัติที่แชร์ร่วมกัน
git fetch origin
git switch main
git pull --ff-only
git revert 4f3a2b1
git push
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การเลือกใช้ `revert` เมื่อต้องการยกเลิกการเปลี่ยนแปลงบน History ที่ถูก Push และแชร์กับทีมไปแล้ว และใช้ `reset` เฉพาะการ Cleanup ประวัติภายในเครื่องตนเองก่อน Push เท่านั้น

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Gitignore and Secret Safety (การป้องกัน Secrets และลบไฟล์หลุดด้วย git rm --cached)

- **สรุปสาระสำคัญ:** การป้องกันไม่ให้ไฟล์ชั่วคราว Build artifacts และความลับ (Secrets) ถูกติดตามใน Version control รวมถึงการรีบนำความลับที่เผลอหลุดไปออกจาก Index ทันที

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การสั่ง `git add .` โดยไม่มีการตั้งค่า `.gitignore` ที่ครอบคลุม ทำให้ไฟล์รหัสผ่าน ความลับ (`.env`) หรือไฟล์ Build สุ่มเสี่ยงต่อการถูก Commit และ Push ขึ้น Repository สาธารณะ
- **ตัวอย่างโค้ด:**

```bash
# Stage ไฟล์ทั้งหมดโดยไม่ป้องกัน secret หรือ build output
git add .
git commit -m "add config"
git push
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ระบุ Pattern ของไฟล์ที่ไม่ต้องการไว้ใน `.gitignore` สั่งนำความลับออกจาก Index ด้วย `git rm --cached` แล้วจึง Commit ไฟล์ `.gitignore` เข้าสู่ระบบ
- **ตัวอย่างโค้ด:**

```bash
# ระบุไฟล์ความลับใน .gitignore และนำไฟล์ความลับออกจาก index
printf ".env\n.env.local\ndist/\nnode_modules/\n" >> .gitignore
git rm --cached .env
git status --short
git add .gitignore
git commit -m "ignore local secrets and build output"
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การป้องกันไม่ให้ไฟล์ชั่วคราว Build artifacts และความลับ (Secrets) ถูกติดตามใน Version control รวมถึงการรีบนำความลับที่เผลอหลุดไปออกจาก Index ทันที

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Tags and Release Points (การสร้าง Annotated Release Tag ที่ปลอดภัยและทดสอบแล้ว)

- **สรุปสาระสำคัญ:** การสร้าง Annotated tag ที่ระบุเวอร์ชันและข้อความกำกับอย่างชัดเจนสำหรับจุด Release หลังจากที่ได้ผ่านการตรวจสอบและทดสอบ Commit นั้นๆ เรียบร้อยแล้ว

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การตั้งชื่อ Tag แบบเลื่อนลอยหรือคลุมเครือ (เช่น `latest`) และสั่ง `git push --tags` เพื่อส่งทุก Tag ในเครื่องขึ้นไป ซึ่งอาจปล่อย Release point ที่ยังไม่พร้อมออกไปโดยไม่ตั้งใจ
- **ตัวอย่างโค้ด:**

```bash
# ใช้ tag คลุมเครือและ push ทุก tag ขึ้นไปพร้อมกัน
git tag latest
git push --tags
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบความสะอาดของ Branch รันการทดสอบ ยืนยัน Commit ล่าสุด แล้วจึงสร้าง Annotated tag ด้วย `-a` พร้อมข้อความระบุเวอร์ชัน แล้ว Push เฉพาะ Tag นั้นขึ้น Remote
- **ตัวอย่างโค้ด:**

```bash
# ตรวจสอบสถานะ ทดสอบโค้ด สร้าง annotated tag และ push เฉพาะ tag นั้น
git status --short --branch
npm test
git log --oneline --max-count=1
git tag -a v1.4.0 -m "Release v1.4.0"
git push origin v1.4.0
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** การสร้าง Annotated tag ที่ระบุเวอร์ชันและข้อความกำกับอย่างชัดเจนสำหรับจุด Release หลังจากที่ได้ผ่านการตรวจสอบและทดสอบ Commit นั้นๆ เรียบร้อยแล้ว

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด Git ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Status Before Work:** นำหลักการ "การตรวจสอบสถานะของสาขาและพื้นที่ทำงานก่อนเริ่มงาน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Interactive Staging Hunks:** นำหลักการ "การเลือก Stage เฉพาะส่วนโค้ดด้วย git add -p" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Atomic Commits and Messages:** นำหลักการ "การสร้าง Atomic Commit และข้อความที่สื่อความหมาย" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Branch Naming and Upstream:** นำหลักการ "การตั้งชื่อ Topic Branch และการผูก Upstream Tracking" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Fetch, Pull, and Rebase Sync:** นำหลักการ "การซิงก์ประวัติโค้ดด้วย Fetch และ Rebase อย่างปลอดภัย" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Reviewing Diffs Before Push:** นำหลักการ "การตรวจสอบ Diff และ Whitespace ก่อนสั่ง Push" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Conflict Resolution Without Overwriting:** นำหลักการ "การแก้ Conflict อย่างมีสติและทดสอบซ้ำก่อน Rebase ต่อ" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Revert vs Reset:** นำหลักการ "การเลือกใช้ Revert บนประวัติที่แชร์ และ Reset บนประวัติภายใน" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Gitignore and Secret Safety:** นำหลักการ "การป้องกัน Secrets และลบไฟล์หลุดด้วย git rm --cached" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Tags and Release Points:** นำหลักการ "การสร้าง Annotated Release Tag ที่ปลอดภัยและทดสอบแล้ว" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

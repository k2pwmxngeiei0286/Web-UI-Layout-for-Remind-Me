# Next.js App Router Architecture & Best Practices Guide
### คู่มือสถาปัตยกรรมและการเขียน Next.js (App Router)

> [!NOTE]
> - **หมวดหมู่ (Category):** Full-Stack React Framework
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Next.js 14 / 15 App Router Conventions, React Server Components (RSC), Client Islands
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรม Next.js App Router: Special Files Conventions, Layout vs Page Boundaries, Server vs Client Components, Client Component Islands, Parallel Fetching, Loading/Error Boundaries, Caching และ Route Handlers
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: App Router File Conventions (การใช้โครงสร้างไฟล์และโฟลเดอร์ตามมาตรฐาน App Router)](#หัวข้อที่-1-app-router-file-conventions-การใช้โครงสร้างไฟล์และโฟลเดอร์ตามมาตรฐาน-app-router)
2. [หัวข้อที่ 2: Layout and Page Boundaries (การแยกขอบเขต UI ส่วนกลางใน Layout และเนื้อหาใน Page)](#หัวข้อที่-2-layout-and-page-boundaries-การแยกขอบเขต-ui-ส่วนกลางใน-layout-และเนื้อหาใน-page)
3. [หัวข้อที่ 3: Server vs Client Components (การแบ่งแยกบทบาทระหว่าง RSC และ Client Components)](#หัวข้อที่-3-server-vs-client-components-การแบ่งแยกบทบาทระหว่าง-rsc-และ-client-components)
4. [หัวข้อที่ 4: Small Client Component Islands (การจำกัดขอบเขต Client JavaScript ให้เล็กที่สุด)](#หัวข้อที่-4-small-client-component-islands-การจำกัดขอบเขต-client-javascript-ให้เล็กที่สุด)
5. [หัวข้อที่ 5: Server-Side Data Fetching (การดึงข้อมูลบน Server Component และการจัดการ Dynamic Route)](#หัวข้อที่-5-server-side-data-fetching-การดึงข้อมูลบน-server-component-และการจัดการ-dynamic-route)
6. [หัวข้อที่ 6: Parallel Data Fetching (การดึงข้อมูลหลายชุดพร้อมกันด้วย Promise.all บน Server)](#หัวข้อที่-6-parallel-data-fetching-การดึงข้อมูลหลายชุดพร้อมกันด้วย-promiseall-บน-server)
7. [หัวข้อที่ 7: Loading and Error Boundaries (การจัดการ UI ระหว่างรอและกรณีเกิดข้อผิดพลาดด้วย loading.tsx และ error.tsx)](#หัวข้อที่-7-loading-and-error-boundaries-การจัดการ-ui-ระหว่างรอและกรณีเกิดข้อผิดพลาดด้วย-loadingtsx-และ-errortsx)
8. [หัวข้อที่ 8: Caching and Revalidation Intent (การกำหนดกลยุทธ์ Caching และ Revalidation อย่างตั้งใจ)](#หัวข้อที่-8-caching-and-revalidation-intent-การกำหนดกลยุทธ์-caching-และ-revalidation-อย่างตั้งใจ)
9. [หัวข้อที่ 9: Metadata per Route (การกำหนด SEO Metadata และ OpenGraph แบบคงที่และไดนามิก)](#หัวข้อที่-9-metadata-per-route-การกำหนด-seo-metadata-และ-opengraph-แบบคงที่และไดนามิก)
10. [หัวข้อที่ 10: Route Handlers as API Boundaries (การสร้าง REST API Endpoint ด้วย Route Handlers)](#หัวข้อที่-10-route-handlers-as-api-boundaries-การสร้าง-rest-api-endpoint-ด้วย-route-handlers)

---

## หัวข้อที่ 1: App Router File Conventions (การใช้โครงสร้างไฟล์และโฟลเดอร์ตามมาตรฐาน App Router)

- **สรุปสาระสำคัญ:** ควรใช้โครงสร้างโฟลเดอร์และไฟล์พิเศษ (Special Files) ของ Next.js App Router ในการจัดการเส้นทาง (Routing) เพื่อให้สอดคล้องกับข้อกำหนดและคอนเวนชันของเฟรมเวิร์ก แทนการสร้างรูปแบบการตั้งชื่อไฟล์ขึ้นมาเอง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การคิดค้นรูปแบบชื่อไฟล์แบบเรียบ (Flat naming scheme) เช่น `projects-projectId.tsx` และแกะค่า URL เองด้วย `window.location.pathname.split("/")` ซึ่งเป็นการข้ามระบบการจัดเส้นทาง (Routing), การตรวจสอบชนิดข้อมูล (Typing), การ Prerender และระบบ Static Params ของ Next.js
- **ตัวอย่างโค้ด:**

```tsx
// app/projects-projectId.tsx
export default function ProjectsProjectIdPage() {
  // Parsing the URL by hand bypasses App Router conventions and typing.
  const projectId = window.location.pathname.split("/").at(-1);
  return <h1>Project {projectId}</h1>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** กำหนดเส้นทางผ่านโครงสร้างโฟลเดอร์ `app/projects/[projectId]/page.tsx` และอ่านค่า Dynamic Segment ผ่าน Route Props (`params`) ที่ Next.js จัดเตรียมไว้ให้ ซึ่งช่วยรักษาความถูกต้องของ Type และทำงานร่วมกับเฟรมเวิร์กได้อย่างสมบูรณ์
- **ตัวอย่างโค้ด:**

```tsx
// app/projects/[projectId]/page.tsx
export default async function ProjectPage({
  params,
}: PageProps<"/projects/[projectId]">) {
  // Route props keep dynamic segments typed and aligned with the folder path.
  const { projectId } = await params;
  return <h1>Project {projectId}</h1>;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ควรใช้โครงสร้างโฟลเดอร์และไฟล์พิเศษ (Special Files) ของ Next.js App Router ในการจัดการเส้นทาง (Routing) เพื่อให้สอดคล้องกับข้อกำหนดและคอนเวนชันของเฟรมเวิร์ก แทนการสร้างรูปแบบการตั้งชื่อไฟล์ขึ้นมาเอง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Layout and Page Boundaries (การแยกขอบเขต UI ส่วนกลางใน Layout และเนื้อหาใน Page)

- **สรุปสาระสำคัญ:** แบ่งแยกหน้าที่โครงสร้างให้ชัดเจน โดยกำหนดให้ Layout จัดเก็บเฉพาะ UI และส่วนการนำทางกลางที่ใช้ร่วมกัน (Shared chrome) ส่วนข้อมูลเฉพาะของแต่ละเส้นทางควรจัดการภายใน Page

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การดึงข้อมูลเฉพาะสำหรับหน้าปลายทาง (Leaf-page data) ไว้ภายใน Layout เช่น `getLatestReviews()` ส่งผลให้การนำทางไปยังหน้าลูก (Child routes) อื่นๆ ทั้งหมดถูกบล็อกและต้องรอข้อมูลที่อาจไม่ได้ใช้งาน ซึ่งทำให้ประสิทธิภาพการนำทางและการทำ Streaming แย่ลง
- **ตัวอย่างโค้ด:**

```tsx
// app/dashboard/layout.tsx
import { getLatestReviews } from "@/lib/reviews";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetching leaf-page data here blocks child routes that may not need it.
  const reviews = await getLatestReviews();
  return (
    <section>
      <aside>{reviews.length} reviews need attention</aside>
      <main>{children}</main>
    </section>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ Layout จัดการโครงสร้าง UI และส่วนการนำทางกลางอย่างคงที่ และปล่อยให้ Page ของแต่ละหน้าลูกเป็นผู้รับผิดชอบการดึงข้อมูลเฉพาะเส้นทางนั้นๆ เอง
- **ตัวอย่างโค้ด:**

```tsx
// app/dashboard/layout.tsx
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The layout owns shared navigation while child pages supply route content.
  return (
    <section>
      <nav aria-label="Dashboard">
        <Link href="/dashboard">Overview</Link>
        <Link href="/dashboard/reviews">Reviews</Link>
      </nav>
      <main>{children}</main>
    </section>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** แบ่งแยกหน้าที่โครงสร้างให้ชัดเจน โดยกำหนดให้ Layout จัดเก็บเฉพาะ UI และส่วนการนำทางกลางที่ใช้ร่วมกัน (Shared chrome) ส่วนข้อมูลเฉพาะของแต่ละเส้นทางควรจัดการภายใน Page

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Server vs Client Components (การแบ่งแยกบทบาทระหว่าง RSC และ Client Components)

- **สรุปสาระสำคัญ:** เลือกใช้ Server Components สำหรับการดึงข้อมูลและการจัดการความลับฝั่งเซิร์ฟเวอร์ และใช้ Client Components เฉพาะส่วนที่ต้องปฏิสัมพันธ์กับผู้ใช้เท่านั้น (Interactivity)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** กำหนดคำสั่ง `"use client"` ครอบทั้งหน้า (Page-level boundary) ส่งผลให้การดึงข้อมูลหลักของหน้าต้องย้ายไปทำฝั่ง Client หลังขั้นตอน Hydration ซึ่งทำให้การแสดงผลช้าลงและสูญเสียประโยชน์ของการเรนเดอร์บนเซิร์ฟเวอร์
- **ตัวอย่างโค้ด:**

```tsx
// app/reviews/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";

export default function ReviewPage() {
  const [review, setReview] = useState(null);
  // This client boundary moves page data fetching after hydration.
  useEffect(() => {
    fetch("/api/current-review")
      .then((response) => response.json())
      .then(setReview);
  }, []);
  if (!review) {
    return <p>Loading...</p>;
  }
  return <h1>{review.title}</h1>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** คงโครงสร้างหลักของหน้าเป็น Server Component เพื่อดึงข้อมูลล่วงหน้าบนเซิร์ฟเวอร์ แล้วส่งต่อเฉพาะข้อมูลที่ต้องใช้กับการกดปุ่มไปยัง Client Component ย่อย (`VoteButton`)
- **ตัวอย่างโค้ด:**

```tsx
// app/reviews/[id]/page.tsx
import { VoteButton } from "./vote-button";
import { getReview } from "@/lib/reviews";

export default async function ReviewPage({
  params,
}: PageProps<"/reviews/[id]">) {
  const { id } = await params;
  // Server rendering fetches the review before handing votes to a client island.
  const review = await getReview(id);
  return (
    <article>
      <h1>{review.title}</h1>
      <p>{review.summary}</p>
      <VoteButton initialVotes={review.votes} />
    </article>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** เลือกใช้ Server Components สำหรับการดึงข้อมูลและการจัดการความลับฝั่งเซิร์ฟเวอร์ และใช้ Client Components เฉพาะส่วนที่ต้องปฏิสัมพันธ์กับผู้ใช้เท่านั้น (Interactivity)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Small Client Component Islands (การจำกัดขอบเขต Client JavaScript ให้เล็กที่สุด)

- **สรุปสาระสำคัญ:** จำกัดขอบเขตของ Client Components ให้เล็กที่สุดเฉพาะส่วนที่จำเป็น (Client Islands) เพื่อป้องกันไม่ให้ส่วน UI นิ่งติดเข้าไปใน Client Bundle

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ประกาศ `"use client"` ที่ระดับ Root Layout เพียงเพื่อจัดการ State ของช่องค้นหา ส่งผลให้ทั้ง Root Layout และคอมโพเนนต์ลูกทั้งหมดถูกดึงเข้าไปใน Client Bundle ทำให้ขนาดไฟล์ JavaScript ใหญ่ขึ้นและเพิ่มภาระการทำ Hydration
- **ตัวอย่างโค้ด:**

```tsx
// app/layout.tsx
"use client";
import { useState } from "react";
import { SiteLogo } from "./site-logo";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  // One input state pulls the whole root layout into the client bundle.
  return (
    <html lang="en">
      <body>
        <header>
          <SiteLogo />
          <input value={query} onChange={(event) => setQuery(event.target.value)} />
        </header>
        {children}
      </body>
    </html>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกคอมโพเนนต์ช่องค้นหาออกไปเป็น Client Component ขนาดเล็ก (`SearchBox`) และคง Root Layout ให้เป็น Server Component ช่วยให้โครงสร้างหลักของหน้าไม่ถูกเพิ่มเข้าไปในชุดโค้ดฝั่งเบราว์เซอร์
- **ตัวอย่างโค้ด:**

```tsx
// app/layout.tsx
import { SearchBox } from "./search-box";
import { SiteLogo } from "./site-logo";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only SearchBox needs client JavaScript; the root layout stays server-rendered.
  return (
    <html lang="en">
      <body>
        <header>
          <SiteLogo />
          <SearchBox />
        </header>
        {children}
      </body>
    </html>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** จำกัดขอบเขตของ Client Components ให้เล็กที่สุดเฉพาะส่วนที่จำเป็น (Client Islands) เพื่อป้องกันไม่ให้ส่วน UI นิ่งติดเข้าไปใน Client Bundle

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Server-Side Data Fetching (การดึงข้อมูลบน Server Component และการจัดการ Dynamic Route)

- **สรุปสาระสำคัญ:** ทำการดึงข้อมูลหลักของหน้าบนเซิร์ฟเวอร์โดยตรงก่อนการเรนเดอร์ เพื่อให้ได้ข้อมูลพร้อมแสดงผลทันที ปลอดภัยจากความลับรั่วไหล และได้ผลดีต่อ SEO

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การดึงข้อมูลสำคัญฝั่ง Client ผ่าน `useEffect` หลังกระบวนการ Hydration และเรียกผ่าน API ทอดหนึ่ง ทำให้การแสดงผลข้อมูลล่าช้า เพิ่มระยะเวลาเรียก API หลายต่อ และกระทบต่อประสิทธิภาพ SEO
- **ตัวอย่างโค้ด:**

```tsx
// app/articles/[slug]/article-client.tsx
"use client";
import { useEffect, useState } from "react";

export function ArticleClient({ slug }: { slug: string }) {
  const [article, setArticle] = useState(null);
  // Hydration-gated fetching delays page data and adds an avoidable API hop.
  useEffect(() => {
    fetch("/api/articles/" + slug)
      .then((response) => response.json())
      .then(setArticle);
  }, [slug]);

  if (!article) {
    return <p>Loading article...</p>;
  }
  return <h1>{article.title}</h1>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ดึงข้อมูลบทความโดยตรงใน Server Component บนเซิร์ฟเวอร์ก่อนส่งผลลัพธ์ และใช้ฟังก์ชัน `notFound()` ของ Next.js เพื่อจัดการกรณีไม่พบข้อมูลและตอบกลับด้วยสถานะ 404 ได้ทันที
- **ตัวอย่างโค้ด:**

```tsx
// app/articles/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/articles";

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  // Fetch essential page data on the server and use notFound for missing slugs.
  const article = await getArticleBySlug(slug);
  if (!article) {
    notFound();
  }
  return (
    <article>
      <h1>{article.title}</h1>
      <p>{article.excerpt}</p>
    </article>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ทำการดึงข้อมูลหลักของหน้าบนเซิร์ฟเวอร์โดยตรงก่อนการเรนเดอร์ เพื่อให้ได้ข้อมูลพร้อมแสดงผลทันที ปลอดภัยจากความลับรั่วไหล และได้ผลดีต่อ SEO

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Parallel Data Fetching (การดึงข้อมูลหลายชุดพร้อมกันด้วย Promise.all บน Server)

- **สรุปสาระสำคัญ:** สำหรับคำขอข้อมูลที่เป็นอิสระต่อกัน ควรเริ่มเรียกใช้งานพร้อมกันในแบบขนาน (Parallel) ก่อนการสั่ง `await` เพื่อหลีกเลี่ยงปัญหา Waterfall

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้คำสั่ง `await` รอรับผลลัพธ์ทีละคำขอตามลำดับ ทั้งที่คำขอหลังไม่ได้ใช้ผลลัพธ์จากคำขอแรก ทำให้เกิด Server-side Waterfall ที่ใช้เวลาเรนเดอร์เท่ากับผลรวมเวลาของทุกคำขอเรียงต่อกัน
- **ตัวอย่างโค้ด:**

```tsx
// app/projects/[projectId]/page.tsx
import { getProject, getReviewSummary } from "@/lib/projects";

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[projectId]">) {
  const { projectId } = await params;
  // Awaiting each independent request in order creates a server-side waterfall.
  const project = await getProject(projectId);
  const summary = await getReviewSummary(projectId);
  return (
    <section>
      <h1>{project.name}</h1>
      <p>{summary.openCount} open reviews</p>
    </section>
  );
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** เริ่มเรียกฟังก์ชันดึงข้อมูลทั้งสองรายการพร้อมกันเป็น Promise แล้วใช้ `Promise.all` เพื่อรอผลลัพธ์ร่วมกันในครั้งเดียว ทำให้เวลาที่ใช้เรนเดอร์เท่ากับเวลาของคำขอที่ช้าที่สุดเพียงตัวเดียว
- **ตัวอย่างโค้ด:**

```tsx
// app/projects/[projectId]/page.tsx
import { getProject, getReviewSummary } from "@/lib/projects";

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[projectId]">) {
  const { projectId } = await params;
  // Start independent requests before awaiting so rendering waits once.
  const projectPromise = getProject(projectId);
  const summaryPromise = getReviewSummary(projectId);
  const [project, summary] = await Promise.all([
    projectPromise,
    summaryPromise,
  ]);
  return (
    <section>
      <h1>{project.name}</h1>
      <p>{summary.openCount} open reviews</p>
    </section>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** สำหรับคำขอข้อมูลที่เป็นอิสระต่อกัน ควรเริ่มเรียกใช้งานพร้อมกันในแบบขนาน (Parallel) ก่อนการสั่ง `await` เพื่อหลีกเลี่ยงปัญหา Waterfall

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: Loading and Error Boundaries (การจัดการ UI ระหว่างรอและกรณีเกิดข้อผิดพลาดด้วย loading.tsx และ error.tsx)

- **สรุปสาระสำคัญ:** ออกแบบหน้าให้มี UI สำหรับสถานะการโหลดข้อมูลทันที และจัดทำ Error Boundary ระดับเส้นทางเพื่อรองรับการดักจับข้อผิดพลาดและการกู้คืนระบบ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การครอบคำสั่งด้วย `try/catch` ภายในหน้า Page เองเพื่อดักจับข้อผิดพลาดทุกกรณี ซึ่งเป็นการซ่อนความล้มเหลวไม่ให้ Route Error Boundary รับรู้ และทำให้ไม่มีกลไกในการแสดง Loading UI หรือปุ่มกดลองใหม่ (Retry)
- **ตัวอย่างโค้ด:**

```tsx
// app/dashboard/reviews/page.tsx
import { getReviews } from "@/lib/reviews";

export default async function ReviewsPage() {
  // Catching every error in the page hides failures from the route boundary.
  try {
    const reviews = await getReviews();
    return reviews.map((review) => <p key={review.id}>{review.title}</p>);
  } catch {
    return <p>Something went wrong.</p>;
  }
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกไฟล์พิเศษ `error.tsx` ที่เป็น Client Component เพื่อจำกัดขอบเขตของข้อผิดพลาด บันทึก Log แสดง UI fallback และมีปุ่มเรียกใช้ฟังก์ชันลองใหม่ (`unstable_retry`) ได้อย่างเป็นระบบ
- **ตัวอย่างโค้ด:**

```tsx
// app/dashboard/reviews/error.tsx
"use client";
import { useEffect } from "react";

export default function ReviewsError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  // A route error boundary can log, show fallback UI, and trigger retry.
  return (
    <section role="alert">
      <h2>Reviews could not load.</h2>
      <button type="button" onClick={() => unstable_retry()}>
        Try again
      </button>
    </section>
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ออกแบบหน้าให้มี UI สำหรับสถานะการโหลดข้อมูลทันที และจัดทำ Error Boundary ระดับเส้นทางเพื่อรองรับการดักจับข้อผิดพลาดและการกู้คืนระบบ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Caching and Revalidation Intent (การกำหนดกลยุทธ์ Caching และ Revalidation อย่างตั้งใจ)

- **สรุปสาระสำคัญ:** กำหนดนโยบายและเจตนาของการแคช (Caching) และการอัปเดตข้อมูล (Revalidation) ให้ชัดเจน เพื่อให้ความสดใหม่ของข้อมูลและความเร็วตรงตามวัตถุประสงค์ของระบบ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การดึงข้อมูลโดยไม่มีการระบุนโยบายความสดใหม่หรือการ Revalidation ไว้อย่างเปิดเผย ทำให้ต้องพึ่งพาพฤติกรรมเริ่มต้นของเฟรมเวิร์ก ซึ่งเสี่ยงต่อการเกิดปัญหาข้อมูลไม่อัปเดตหรือทำให้หน้าเว็บช้าลง
- **ตัวอย่างโค้ด:**

```ts
// lib/posts.ts
export async function getPublishedPosts() {
  // This fetch has no stated freshness or revalidation policy.
  const response = await fetch("https://cms.example.com/posts");
  return response.json();
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ระบุเจตนาอย่างชัดเจนด้วย directive `"use cache"` ร่วมกับ `cacheLife("hours")` และ `cacheTag("posts")` เพื่อกำหนดอายุแคชและแท็กสำหรับการ Revalidate ข้อมูลเมื่อเกิดการแก้ไข
- **ตัวอย่างโค้ด:**

```ts
// lib/posts.ts
import { cacheLife, cacheTag } from "next/cache";

export async function getPublishedPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  // The cache directive, lifetime, and tag make freshness explicit.
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** กำหนดนโยบายและเจตนาของการแคช (Caching) และการอัปเดตข้อมูล (Revalidation) ให้ชัดเจน เพื่อให้ความสดใหม่ของข้อมูลและความเร็วตรงตามวัตถุประสงค์ของระบบ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Metadata per Route (การกำหนด SEO Metadata และ OpenGraph แบบคงที่และไดนามิก)

- **สรุปสาระสำคัญ:** ใช้ Metadata API ใน Server Components (`metadata` หรือ `generateMetadata`) ในการจัดการ `<head>` ของแต่ละเส้นทาง แทนการปรับเปลี่ยนข้อมูลฝั่ง Client

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ปรับเปลี่ยน `document.title` ผ่าน `useEffect` ใน Client Component ซึ่งทำงานหลังเบราว์เซอร์ทำ Hydration เสร็จแล้ว ทำให้ Search Engine Crawlers และ Social Previews ไม่สามารถอ่าน Metadata ที่ถูกต้องได้
- **ตัวอย่างโค้ด:**

```tsx
// app/articles/[slug]/article-title.tsx
"use client";
import { useEffect } from "react";

export function ArticleTitle({ title }: { title: string }) {
  // Updating document.title after hydration is too late for reliable previews.
  useEffect(() => {
    document.title = title;
  }, [title]);
  return <h1>{title}</h1>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ฟังก์ชัน `generateMetadata` ส่งคืนออบเจกต์ Metadata บนเซิร์ฟเวอร์โดยตรง ทำให้ข้อมูล Head เป็นส่วนหนึ่งของ Server Route Contract และแสดงผลการพรีวิวได้อย่างถูกต้อง
- **ตัวอย่างโค้ด:**

```tsx
// app/articles/[slug]/page.tsx
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";

export async function generateMetadata({
  params,
}: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  // generateMetadata makes head data part of the server route contract.
  return {
    title: article?.title ?? "Article not found",
    description: article?.excerpt ?? "This article is not available.",
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/articles/[slug]">) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return <h1>{article?.title}</h1>;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ใช้ Metadata API ใน Server Components (`metadata` หรือ `generateMetadata`) ในการจัดการ `<head>` ของแต่ละเส้นทาง แทนการปรับเปลี่ยนข้อมูลฝั่ง Client

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Route Handlers as API Boundaries (การสร้าง REST API Endpoint ด้วย Route Handlers)

- **สรุปสาระสำคัญ:** แยกส่วนของ HTTP APIs ออกไปไว้ใน Route Handlers (`route.ts`) ให้ชัดเจน และไม่นำไปปะปนกับส่วนประกอบ UI ของหน้าการใช้งาน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** เขียนฟังก์ชัน `export async function GET()` ร่วมกับ Page UI Component ในไฟล์เดียวกัน (`page.tsx`) ซึ่งขัดต่อระบบการจัดเส้นทางของ App Router และทำให้ขอบเขตระหว่าง API กับ UI สับสน
- **ตัวอย่างโค้ด:**

```tsx
// app/reviews/[id]/page.tsx
import { getReview } from "@/lib/reviews";

// Mixing GET and page UI in one file blurs the App Router boundary.
export async function GET() {
  const review = await getReview("current");
  return Response.json(review);
}

export default async function ReviewPage() {
  const review = await getReview("current");
  return <h1>{review.title}</h1>;
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** แยกส่วน API ไปสร้างไว้ในไฟล์ `app/api/reviews/[id]/route.ts` โดยเฉพาะ พร้อมส่งคืนออบเจกต์ JSON และระบุ HTTP Status Code (เช่น 404) ไว้อย่างชัดเจนเมื่อไม่พบข้อมูล
- **ตัวอย่างโค้ด:**

```ts
// app/api/reviews/[id]/route.ts
import { NextResponse } from "next/server";
import { getReview } from "@/lib/reviews";

export async function GET(
  _request: Request,
  context: RouteContext<"/api/reviews/[id]">,
) {
  const { id } = await context.params;
  const review = await getReview(id);
  // The route handler validates lookup results and returns explicit HTTP status.
  if (!review) {
    return NextResponse.json(
      { error: "Review not found." },
      { status: 404 },
    );
  }
  return NextResponse.json({ review });
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** แยกส่วนของ HTTP APIs ออกไปไว้ใน Route Handlers (`route.ts`) ให้ชัดเจน และไม่นำไปปะปนกับส่วนประกอบ UI ของหน้าการใช้งาน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด Next.js ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **App Router File Conventions:** นำหลักการ "การใช้โครงสร้างไฟล์และโฟลเดอร์ตามมาตรฐาน App Router" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Layout and Page Boundaries:** นำหลักการ "การแยกขอบเขต UI ส่วนกลางใน Layout และเนื้อหาใน Page" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Server vs Client Components:** นำหลักการ "การแบ่งแยกบทบาทระหว่าง RSC และ Client Components" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Small Client Component Islands:** นำหลักการ "การจำกัดขอบเขต Client JavaScript ให้เล็กที่สุด" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Server-Side Data Fetching:** นำหลักการ "การดึงข้อมูลบน Server Component และการจัดการ Dynamic Route" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Parallel Data Fetching:** นำหลักการ "การดึงข้อมูลหลายชุดพร้อมกันด้วย Promise.all บน Server" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Loading and Error Boundaries:** นำหลักการ "การจัดการ UI ระหว่างรอและกรณีเกิดข้อผิดพลาดด้วย loading.tsx และ error.tsx" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Caching and Revalidation Intent:** นำหลักการ "การกำหนดกลยุทธ์ Caching และ Revalidation อย่างตั้งใจ" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Metadata per Route:** นำหลักการ "การกำหนด SEO Metadata และ OpenGraph แบบคงที่และไดนามิก" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Route Handlers as API Boundaries:** นำหลักการ "การสร้าง REST API Endpoint ด้วย Route Handlers" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

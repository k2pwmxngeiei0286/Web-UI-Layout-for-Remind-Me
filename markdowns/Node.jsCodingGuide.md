# Node.js Backend Architecture & Systems Guide
### คู่มือสถาปัตยกรรมและการเขียน Node.js สำหรับระบบหลังบ้าน

> [!NOTE]
> - **หมวดหมู่ (Category):** Backend & Server Runtime
> - **มาตรฐานที่ใช้อ้างอิง (Standards):** Node.js LTS, Non-blocking Event Loop, 12-Factor App Config, Stream Pipeline, Structured Logging
> - **วัตถุประสงค์ (Purpose):** รวบรวม 10 สถาปัตยกรรมสำคัญของ Node.js Backend: Process Startup vs Application Wiring, Non-blocking I/O, Async Error Boundaries, Config Validation, Streams, Graceful Shutdown และ Structured Logging
> - **โครงสร้างเอกสาร:** เปรียบเทียบระหว่าง ❌ **Anti-Pattern (โครงสร้างที่ไม่ดี)** กับ ✅ **Best Practice (สถาปัตยกรรมที่ดี)** รวม 10 หัวข้อสำคัญ

---

<a id="-สารบัญ-table-of-contents"></a>
<a id="สารบัญ-table-of-contents"></a>
<a id="table-of-contents"></a>

## 📑 สารบัญ (Table of Contents)

1. [หัวข้อที่ 1: Runtime Boundaries and Entry Points (การแยก Process Startup ออกจาก Application Wiring)](#หัวข้อที่-1-runtime-boundaries-and-entry-points-การแยก-process-startup-ออกจาก-application-wiring)
2. [หัวข้อที่ 2: Async Filesystem Without Blocking (การใช้ Non-blocking I/O เพื่อไม่บล็อก Event Loop)](#หัวข้อที่-2-async-filesystem-without-blocking-การใช้-non-blocking-io-เพื่อไม่บล็อก-event-loop)
3. [หัวข้อที่ 3: Async Failure Boundaries (การกำหนดจุดดักจับ Exception และ Unhandled Rejection)](#หัวข้อที่-3-async-failure-boundaries-การกำหนดจุดดักจับ-exception-และ-unhandled-rejection)
4. [หัวข้อที่ 4: Environment Variables and Configuration (การโหลดและ Validate Config ในช่วง Startup)](#หัวข้อที่-4-environment-variables-and-configuration-การโหลดและ-validate-config-ในช่วง-startup)
5. [หัวข้อที่ 5: Module Side Effects and Startup Code (การป้องกัน Side Effect ขณะ Import โมดูล)](#หัวข้อที่-5-module-side-effects-and-startup-code-การป้องกัน-side-effect-ขณะ-import-โมดูล)
6. [หัวข้อที่ 6: Streams for Large Payloads (การประมวลผลข้อมูลขนาดใหญ่ด้วย Stream Pipeline)](#หัวข้อที่-6-streams-for-large-payloads-การประมวลผลข้อมูลขนาดใหญ่ด้วย-stream-pipeline)
7. [หัวข้อที่ 7: HTTP Request Lifecycle (การควบคุมสถานะและ Lifecycle ของ HTTP Request/Response)](#หัวข้อที่-7-http-request-lifecycle-การควบคุมสถานะและ-lifecycle-ของ-http-requestresponse)
8. [หัวข้อที่ 8: Graceful Shutdown and Process Signals (การปิดโปรเซสอย่างปลอดภัยเมื่อรับสัญญาณ SIGINT/SIGTERM)](#หัวข้อที่-8-graceful-shutdown-and-process-signals-การปิดโปรเซสอย่างปลอดภัยเมื่อรับสัญญาณ-sigintsigterm)
9. [หัวข้อที่ 9: Structured Logging (การบันทึก Log แบบมีโครงสร้าง JSON เพื่อการค้นหาและติดตาม)](#หัวข้อที่-9-structured-logging-การบันทึก-log-แบบมีโครงสร้าง-json-เพื่อการค้นหาและติดตาม)
10. [หัวข้อที่ 10: Input Validation and Path Safety (การตรวจสอบ Input และการป้องกัน Directory Traversal)](#หัวข้อที่-10-input-validation-and-path-safety-การตรวจสอบ-input-และการป้องกัน-directory-traversal)

---

## หัวข้อที่ 1: Runtime Boundaries and Entry Points (การแยก Process Startup ออกจาก Application Wiring)

- **สรุปสาระสำคัญ:** แยกกระบวนการเริ่มทำงานของโปรเซส (**Process Startup**) ออกจากส่วนประกอบของแอปพลิเคชัน (**Application Wiring**) เพื่อให้สถาปัตยกรรมมีความยืดหยุ่น โมดูลสามารถถูกนำมา import ใช้ใน Unit Test หรือสคริปต์อื่นได้โดยไม่เปิดเครือข่าย socket หรือผูกมัดกับพอร์ตโดยทันที

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** สั่งให้เซิร์ฟเวอร์เริ่มฟังพอร์ต (`listen`) ทันทีที่ระดับ Top-level ของโมดูล ทำให้เกิด **Side Effect** เมื่อโมดูลถูก import เข้าไปในระบบทดสอบ หรือสคริปต์อื่น โปรเซสจะเปิด Socket ทันทีโดยไม่ตั้งใจ ส่งผลให้การทดสอบและจัดสรร Runtime ทำได้ยาก
- **ตัวอย่างโค้ด:**

```typescript
// src/app.ts
import http from "node:http";
import { handleRequest } from "./handler";

const server = http.createServer(handleRequest);
// การ import โมดูลนี้จะเปิด socket ทันทีโดยไม่ตั้งใจ
server.listen(process.env.PORT || 3000);

export default server;
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** โค้ดส่วนการประกอบแอปพลิเคชันจะถูกแยกไว้ในฟังก์ชัน (เช่น `createApp`) ส่วนการสั่งเริ่มต้นเซิร์ฟเวอร์จะถูกแยกไว้อยู่ใน **Entry Point** เฉพาะ (เช่น `server.ts`)
- **ตัวอย่างโค้ด:**

```typescript
// src/server.ts
import { createApp } from "./app";
import { readConfig } from "./config";

const config = readConfig(process.env);
const app = createApp({ logger: console });

// การเริ่มต้นโปรเซสถูกแยกไว้อยู่ใน Entry Point โดยเฉพาะ
const server = app.listen(config.port, () => {
  console.info("Server listening on port " + config.port);
});

export { server };
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** แยกกระบวนการเริ่มทำงานของโปรเซส (**Process Startup**) ออกจากส่วนประกอบของแอปพลิเคชัน (**Application Wiring**) เพื่อให้สถาปัตยกรรมมีความยืดหยุ่น โมดูลสามารถถูกนำมา import ใช้ใน Unit Test หรือสคริปต์อื่นได้โดยไม่เปิดเครือข่าย socket หรือผูกมัดกับพอร์ตโดยทันที

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 2: Async Filesystem Without Blocking (การใช้ Non-blocking I/O เพื่อไม่บล็อก Event Loop)

- **สรุปสาระสำคัญ:** เลือกใช้ **Async Filesystem APIs** ในการจัดการไฟล์บนเส้นทางประมวลผลคำขอ (**Request Path**) เพื่อให้ **Event Loop** สามารถทำงานต่อไปได้อย่างต่อเนื่องโดยไม่ถูกบล็อกจากการอ่านไฟล์ดิสก์ที่เชื่องช้า

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** การใช้ Synchronous File APIs (เช่น `readFileSync`) ใน HTTP Handler จะหยุดการทำงานของ **Event Loop** ทั้งหมด ทำให้คำขออื่นๆ ของผู้ใช้รายอื่นโดนบล็อกการทำงานทันที เกิดความล่าช้าสะสมเมื่อมี Concurrent Traffic เข้ามา
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/config.ts
import { readFileSync } from "node:fs";
import type { ServerResponse } from "node:http";

export function sendPublicConfig(response: ServerResponse) {
  // Synchronous I/O จะบล็อกกระบวนการทำงานทั้งหมดในระหว่างจัดการคำขอ
  const file = readFileSync("public-config.json", "utf8");
  response.setHeader("content-type", "application/json");
  response.end(file);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ Async Filesystem API (เช่น `readFile` จาก `node:fs/promises`) คู่กับ `await` เพื่อให้ Event Loop สลับไปรับและประมวลผลคำขออื่นได้ในระหว่างที่รออ่านข้อมูลจากดิสก์
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/config.ts
import { readFile } from "node:fs/promises";
import type { ServerResponse } from "node:http";

export async function sendPublicConfig(response: ServerResponse) {
  // Asynchronous I/O ช่วยให้ Event Loop สามารถให้บริการคำขออื่นต่อได้
  const file = await readFile("public-config.json", "utf8");
  response.setHeader("content-type", "application/json");
  response.end(file);
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** เลือกใช้ **Async Filesystem APIs** ในการจัดการไฟล์บนเส้นทางประมวลผลคำขอ (**Request Path**) เพื่อให้ **Event Loop** สามารถทำงานต่อไปได้อย่างต่อเนื่องโดยไม่ถูกบล็อกจากการอ่านไฟล์ดิสก์ที่เชื่องช้า

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 3: Async Failure Boundaries (การกำหนดจุดดักจับ Exception และ Unhandled Rejection)

- **สรุปสาระสำคัญ:** กำหนดจุดดักจับข้อผิดพลาด (**Failure Boundaries**) สำหรับ Async Code ให้ชัดเจนที่ HTTP Boundary เพื่อบันทึก Context ของข้อผิดพลาดและส่ง Response ตอบกลับหา Client ได้อย่างถูกต้องเพียงครั้งเดียว

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** ปล่อยให้ **Rejected Promise** ปราศจากผู้ดูแล (Rejection Owner) เช่น การเรียกใช้ Async Function ในลักษณะ `.then()` โดยไม่มีการดักจับข้อผิดพลาดผ่าน `.catch()` หรือ `try...catch` ส่งผลให้โปรเซสเกิด **Unhandled Rejection** ในขณะที่ฝั่ง Client อาจค้างรอ Response ตลอดไป
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/reports.ts
import type { ServerResponse } from "node:http";
import { createReport } from "../services/reports";

export function sendReport(response: ServerResponse) {
  // Rejection ไม่มีผู้ดูแล ทำให้ Client อาจไม่ได้ Response ตอบกลับ
  createReport().then((report) => {
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ report }));
  });
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ใช้ `try...catch` ครอบการทำงานของ Async/Await ที่ขอบเขตของ HTTP Boundary เพื่อให้มีบทบาทในการจัดการทั้งกรณีที่สำเร็จและล้มเหลว บันทึก Log และส่ง HTTP Status Code (เช่น 500) กลับไปอย่างชัดเจน
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/reports.ts
import type { ServerResponse } from "node:http";
import { createReport } from "../services/reports";

export async function sendReport(response: ServerResponse) {
  // HTTP boundary เป็นเจ้าของทั้ง Response ในกรณีสำเร็จและล้มเหลว
  try {
    const report = await createReport();
    response.setHeader("content-type", "application/json");
    response.end(JSON.stringify({ report }));
  } catch (error) {
    console.error({ error }, "Could not create report");
    response.statusCode = 500;
    response.end(JSON.stringify({ error: "Could not create report." }));
  }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** กำหนดจุดดักจับข้อผิดพลาด (**Failure Boundaries**) สำหรับ Async Code ให้ชัดเจนที่ HTTP Boundary เพื่อบันทึก Context ของข้อผิดพลาดและส่ง Response ตอบกลับหา Client ได้อย่างถูกต้องเพียงครั้งเดียว

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 4: Environment Variables and Configuration (การโหลดและ Validate Config ในช่วง Startup)

- **สรุปสาระสำคัญ:** อ่านและตรวจสอบความถูกต้อง (**Validate**) ของค่าคอนฟิกูเรชันจากตัวแปรสภาพแวดล้อม (**Environment Variables**) เพียงครั้งเดียวในช่วงเริ่มต้นแอปพลิเคชัน (**Startup Phase**) เพื่อให้ระบบล้มเหลวอย่างรวดเร็ว (Fail Fast) หากข้อมูลไม่ถูกต้อง

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** เรียกอ่าน `process.env` กระจัดกระจายอยู่ลึกเข้าไปในโค้ดส่วน Infrastructure พร้อมซ่อนค่าเริ่มต้นไว้ (Hidden Defaults) ซึ่งอาจส่งผลให้แอปพลิเคชันบน Production ชี้ไปยังระบบหรือฐานข้อมูลทดสอบโดยไม่ตั้งใจ หรือยอมรับค่าตัวเลขที่ไม่ถูกต้อง
- **ตัวอย่างโค้ด:**

```typescript
// src/db.ts
export function connectDatabase() {
  // Hidden defaults อาจทำให้ Production ชี้ไปผิดบริการได้
  return connect({
    url: process.env.DATABASE_URL || "postgres://localhost/dev",
    poolSize: Number(process.env.POOL_SIZE || "not-a-number"),
  });
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** รวบรวมค่าจาก `process.env` มาสร้างเป็น **Typed Config Object** และทำการ Validate ชนิดข้อมูลกับค่าที่จำเป็นทั้งหมดตั้งแต่ระดับ Startup หากค่าไม่ถูกต้องให้ throw Error ออกมาทันทีก่อนที่ระบบจะเริ่มรับ Traffic
- **ตัวอย่างโค้ด:**

```typescript
// src/config.ts
type AppConfig = {
  port: number;
  databaseUrl: string;
};

export function readConfig(env: NodeJS.ProcessEnv): AppConfig {
  const databaseUrl = env.DATABASE_URL;
  const port = Number(env.PORT ?? "3000");

  // ตรวจสอบความถูกต้องของคอนฟิกูเรชันก่อนแอปพลิเคชันจะเริ่มรับ traffic
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required.");
  }
  if (!Number.isInteger(port) || port < 1) {
    throw new Error("PORT must be a positive integer.");
  }

  return { databaseUrl, port };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** อ่านและตรวจสอบความถูกต้อง (**Validate**) ของค่าคอนฟิกูเรชันจากตัวแปรสภาพแวดล้อม (**Environment Variables**) เพียงครั้งเดียวในช่วงเริ่มต้นแอปพลิเคชัน (**Startup Phase**) เพื่อให้ระบบล้มเหลวอย่างรวดเร็ว (Fail Fast) หากข้อมูลไม่ถูกต้อง

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 5: Module Side Effects and Startup Code (การป้องกัน Side Effect ขณะ Import โมดูล)

- **สรุปสาระสำคัญ:** หลีกเลี่ยงการสร้างผลกระทบข้างเคียง (**Side Effects**) เช่น การเริ่มสั่งรัน Background Job, สั่งรัน Timer หรือสร้าง Connection เชื่อมต่อฐานข้อมูล เมื่อโมดูลถูก import เข้ามาใช้งาน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** วางคำสั่ง `setInterval` ไว้ที่ระดับ Top-level ของโมดูล ทำให้การ import โมดูลเข้าใน Unit Test หรือสคริปต์ที่ต้องการเรียกใช้เพียงฟังก์ชันย่อย เกิดการเริ่มรัน Background Process ค้างไว้ตลอดเวลา ส่งผลต่อการทำ Test Isolation
- **ตัวอย่างโค้ด:**

```typescript
// src/jobs/cleanup.ts
import { deleteExpiredSessions } from "../sessions";

// เพียงแค่การ import โมดูลก็ทำให้เริ่มรัน background loop ค้างไว้ทันที
setInterval(() => {
  deleteExpiredSessions();
}, 60_000);

export function cleanupNow() {
  return deleteExpiredSessions();
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ห่อหุ้มการทำงานของ Background Job ไว้ภายใต้ฟังก์ชันควบคุม (เช่น `startCleanupJob`) ให้ผู้เรียกใช้อย่างเปิดเผย (Explicit) เป็นผู้กำหนดช่วงเวลาเริ่มต้นและคืนค่าอินเทอร์เฟซสำหรับการยกเลิก (`stop`)
- **ตัวอย่างโค้ด:**

```typescript
// src/jobs/cleanup.ts
type CleanupJob = {
  stop: () => void;
};

// ผู้เรียกใช้งานเป็นผู้กำหนดเองว่าจะเริ่มหรือหยุด background job เมื่อใด
export function startCleanupJob(runCleanup: () => Promise<void>): CleanupJob {
  const interval = setInterval(() => {
    runCleanup().catch((error) => {
      console.error({ error }, "Cleanup job failed");
    });
  }, 60_000);

  return {
    stop: () => clearInterval(interval),
  };
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** หลีกเลี่ยงการสร้างผลกระทบข้างเคียง (**Side Effects**) เช่น การเริ่มสั่งรัน Background Job, สั่งรัน Timer หรือสร้าง Connection เชื่อมต่อฐานข้อมูล เมื่อโมดูลถูก import เข้ามาใช้งาน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 6: Streams for Large Payloads (การประมวลผลข้อมูลขนาดใหญ่ด้วย Stream Pipeline)

- **สรุปสาระสำคัญ:** ประมวลผลและส่งออกไฟล์ขนาดใหญ่ผ่านทาง **Streams** เพื่อลดการใช้หน่วยความจำ (RAM) ของโปรเซสโดยไม่ต้องโหลดเนื้อหาทั้งหมดเข้ามาไว้ใน RAM ก่อน

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** อ่านไฟล์ขนาดใหญ่ทั้งหมดเข้าหน่วยความจำด้วย `readFile` ก่อนส่งออกเป็น Response ทำให้การใช้ RAM เพิ่มขึ้นแปรผันตรงตามขนาดไฟล์และปริมาณผู้ใช้งานพร้อมกัน จนอาจเกิด Memory Pressure หรือทำให้อุปกรณ์หยุดทำงาน (Crash)
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/download.ts
import { readFile } from "node:fs/promises";
import type { ServerResponse } from "node:http";

export async function sendExport(filePath: string, response: ServerResponse) {
  // การโหลดไฟล์ทั้งหมดเข้า RAM ทำให้การใช้หน่วยความจำพุ่งสูงตามขนาดไฟล์
  const file = await readFile(filePath);
  response.setHeader("content-type", "text/csv");
  response.end(file);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ส่งข้อมูลผ่าน Stream โดยใช้ `pipeline` ร่วมกับ `createReadStream` เพื่อควบคุมแรงดันขากลับ (**Backpressure**) และจัดการกับข้อผิดพลาดของ Stream ได้อย่างปลอดภัย
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/download.ts
import { createReadStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import type { ServerResponse } from "node:http";

export async function sendExport(filePath: string, response: ServerResponse) {
  response.setHeader("content-type", "text/csv");
  try {
    // pipeline ทำหน้าที่ประสานงานเรื่อง backpressure และจัดการ error ของ stream
    await pipeline(createReadStream(filePath), response);
  } catch (error) {
    console.error({ error, filePath }, "Export stream failed");
    if (!response.headersSent) {
      response.statusCode = 500;
      response.end("Could not stream export.");
    }
  }
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ประมวลผลและส่งออกไฟล์ขนาดใหญ่ผ่านทาง **Streams** เพื่อลดการใช้หน่วยความจำ (RAM) ของโปรเซสโดยไม่ต้องโหลดเนื้อหาทั้งหมดเข้ามาไว้ใน RAM ก่อน

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 7: HTTP Request Lifecycle (การควบคุมสถานะและ Lifecycle ของ HTTP Request/Response)

- **สรุปสาระสำคัญ:** ลำดับขั้นตอนการตรวจสอบ HTTP Method, ขีดจำกัดของขนาด Payload (**Body Limits**) และการจบการทำงาน Response ให้ถูกต้อง เพื่อตัดการทำงานของ Request ที่ไม่ถูกต้องออกตั้งแต่เนิ่นๆ (**Early Exit**)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** อ่านข้อมูลจาก Request Body ทั้งหมดแบบไม่จำกัดขนาด ก่อนที่จะตรวจสอบว่า HTTP Method ถูกต้องหรือไม่ รวมถึงลืมหยุดการทำงาน (`return`) หลังจากส่ง Response 405 ซึ่งทำให้โค้ดพยายามส่ง Response ซ้ำซ้อน
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/webhook.ts
import type { IncomingMessage, ServerResponse } from "node:http";

export async function handleWebhook(
  request: IncomingMessage,
  response: ServerResponse,
) {
  let body = "";
  // อ่านข้อมูลโดยไม่จำกัดขนาดก่อนการตรวจสอบ HTTP Method
  for await (const chunk of request) {
    body += chunk;
  }
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.end("Method not allowed.");
  }
  response.end("Received " + body.length + " bytes.");
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบและปฏิเสธ HTTP Method ที่ไม่รองรับทันทีก่อนการเริ่มอ่าน Body พร้อมทั้งจำกัดขนาดข้อมูลขณะอ่าน และสั่ง `return` ออกทันทีเมื่อส่ง Error Response แล้ว
- **ตัวอย่างโค้ด:**

```typescript
// src/routes/webhook.ts
import type { IncomingMessage, ServerResponse } from "node:http";

async function readBody(request: IncomingMessage, limitBytes: number) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > limitBytes) {
      throw new Error("Body too large.");
    }
  }
  return body;
}

export async function handleWebhook(
  request: IncomingMessage,
  response: ServerResponse,
) {
  // ปฏิเสธ Method ที่ไม่รองรับทันทีก่อนอ่าน Body
  if (request.method !== "POST") {
    response.statusCode = 405;
    response.end("Method not allowed.");
    return;
  }
  const body = await readBody(request, 64_000);
  response.end("Received " + body.length + " bytes.");
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ลำดับขั้นตอนการตรวจสอบ HTTP Method, ขีดจำกัดของขนาด Payload (**Body Limits**) และการจบการทำงาน Response ให้ถูกต้อง เพื่อตัดการทำงานของ Request ที่ไม่ถูกต้องออกตั้งแต่เนิ่นๆ (**Early Exit**)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 8: Graceful Shutdown and Process Signals (การปิดโปรเซสอย่างปลอดภัยเมื่อรับสัญญาณ SIGINT/SIGTERM)

- **สรุปสาระสำคัญ:** หยุดรับงานใหม่และปิดการเชื่อมต่อทรัพยากรภายนอก (เช่น Database) ให้เรียบร้อยเมื่อโปรเซสได้รับสัญญาณปิดระบบ (**Process Signals** เช่น `SIGINT`, `SIGTERM`)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** สั่งสั่งยุติการทำงานของโปรเซสทันทีด้วย `process.exit(0)` เมื่อรับสัญญาณ ทำให้คำขอที่กำลังประมวลผลอยู่ค้างไว้ และตัดสายการเชื่อมต่อของบริการภายนอกอย่างกะทันหัน
- **ตัวอย่างโค้ด:**

```typescript
// src/server.ts
// ยุติโปรเซสทันที ทำให้ In-flight requests ถูกยกเลิกกลางคัน
process.on("SIGTERM", () => {
  process.exit(0);
});
process.on("SIGINT", () => {
  process.exit(0);
});
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** หยุดรับคำขอใหม่ด้วย `server.close()` รอให้คำขอเดิมทำงานเสร็จ ดึงกระบวนการปิดการเชื่อมต่อ Database และตั้งค่า Timeout สำรองเพื่อบังคับปิดหากกระบวนการ Shutdown ค้าง
- **ตัวอย่างโค้ด:**

```typescript
// src/shutdown.ts
import type { Server } from "node:http";

export function installShutdown(server: Server, closeDatabase: () => Promise<void>) {
  async function shutdown(signal: string) {
    console.info("Received " + signal + ", shutting down");
    // หยุดรับงานใหม่ก่อนเริ่มปิดดิเพนเดนซีภายนอก
    server.close(async () => {
      await closeDatabase();
      process.exit(0);
    });
    setTimeout(() => {
      console.error("Shutdown timed out");
      process.exit(1);
    }, 10_000).unref();
  }

  process.once("SIGTERM", () => shutdown("SIGTERM"));
  process.once("SIGINT", () => shutdown("SIGINT"));
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** หยุดรับงานใหม่และปิดการเชื่อมต่อทรัพยากรภายนอก (เช่น Database) ให้เรียบร้อยเมื่อโปรเซสได้รับสัญญาณปิดระบบ (**Process Signals** เช่น `SIGINT`, `SIGTERM`)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 9: Structured Logging (การบันทึก Log แบบมีโครงสร้าง JSON เพื่อการค้นหาและติดตาม)

- **สรุปสาระสำคัญ:** บันทึก Log ในรูปแบบโครงสร้างที่เครื่องมืออ่านได้ (**Machine-Readable** เช่น JSON) มี Context ในการสืบค้น และไม่รั่วไหลข้อมูลที่เป็นความลับ

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** บันทึกข้อความแบบ Free-form string และการพิมพ์รหัสผ่านหรือข้อมูลสำคัญลงใน Log ตรงๆ ซึ่งทำให้ระบบ Log Management ทำงานค้นหาได้ยาก และก่อให้เกิดปัญหาความปลอดภัย (Data Leak)
- **ตัวอย่างโค้ด:**

```typescript
// src/login.ts
export function logLoginAttempt(email: string, password: string) {
  // การบันทึกความลับใน Log นำไปสู่การรั่วไหลของข้อมูลบน Production
  console.log("Login failed for " + email + " with password " + password);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ส่งออก Log ในรูปแบบโครงสร้าง JSON ที่มีฟิลด์คงที่และชัดเจน (เช่น `time`, `level`, `requestId`) เพื่อให้ค้นหาและจับคู่เหตุการณ์ย้อนหลังได้สะดวก
- **ตัวอย่างโค้ด:**

```typescript
// src/logging.ts
type LogEvent = {
  level: "info" | "error";
  message: string;
  requestId: string;
  durationMs?: number;
};

export function logEvent(event: LogEvent) {
  // ฟิลด์ที่มีโครงสร้างแน่นอนช่วยให้ค้นหาและวิเคราะห์ log ได้สะดวก
  console.log(
    JSON.stringify({
      time: new Date().toISOString(),
      ...event,
    })
  );
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** บันทึก Log ในรูปแบบโครงสร้างที่เครื่องมืออ่านได้ (**Machine-Readable** เช่น JSON) มี Context ในการสืบค้น และไม่รั่วไหลข้อมูลที่เป็นความลับ

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## หัวข้อที่ 10: Input Validation and Path Safety (การตรวจสอบ Input และการป้องกัน Directory Traversal)

- **สรุปสาระสำคัญ:** ตรวจสอบความถูกต้องของข้อมูลนำเข้าจากผู้ใช้งานก่อนนำไปใช้จัดจัดการกับโครงสร้างเส้นทางไฟล์ (**Filesystem Paths**) เพื่อป้องกันช่องโหว่การเข้าถึงไฟล์นอกขอบเขต (**Path Traversal**)

### ❌ โครงสร้างโค้ดที่ไม่ดี (Anti-Pattern)

- **คำอธิบายปัญหา:** นำชื่อไฟล์จากผู้ใช้ไปต่อกับเส้นทางไดเรกทอรีตรงๆ ผ่าน `path.join` โดยไม่กรองค่า ทำให้ผู้ไม่หวังดีส่งคำสั่งเช่น `../` เพื่อเข้าถึงหรือแก้ไขไฟล์ภายนอกโฟลเดอร์ที่ได้รับอนุญาตได้
- **ตัวอย่างโค้ด:**

```typescript
// src/files.ts
import path from "node:path";

export function resolveUploadPath(fileName: string) {
  // Input จากผู้ใช้อาจข้ามออกไปภายนอกไดเรกทอรีที่กำหนดได้ (Path Traversal)
  return path.join("uploads", fileName);
}
```

### ✅ โครงสร้างโค้ดที่ดี (Best Practice)

- **คำอธิบายแนวทางแก้ไข:** ตรวจสอบรูปแบบชื่อไฟล์ด้วย Regular Expression, แปลงเส้นทางสัมบูรณ์ด้วย `path.resolve` และตรวจสอบว่าพาธปลายทางเริ่มต้นด้วย root path ที่อนุญาตไว้หรือไม่
- **ตัวอย่างโค้ด:**

```typescript
// src/files.ts
import path from "node:path";

const uploadRoot = path.resolve("uploads");

export function resolveUploadPath(fileName: string) {
  // ตรวจสอบรูปแบบข้อความและตรวจสอบเปรียบเทียบกับ root directory ที่อนุญาต
  if (!/^[a-z0-9._-]+$/i.test(fileName)) {
    throw new Error("Invalid file name.");
  }
  const targetPath = path.resolve(uploadRoot, fileName);
  if (!targetPath.startsWith(uploadRoot + path.sep)) {
    throw new Error("Path escapes upload directory.");
  }
  return targetPath;
}
```

### 💡 สรุปข้อคิดและหลักการ (Key Takeaway)

> **แก่นสำคัญ:** ตรวจสอบความถูกต้องของข้อมูลนำเข้าจากผู้ใช้งานก่อนนำไปใช้จัดจัดการกับโครงสร้างเส้นทางไฟล์ (**Filesystem Paths**) เพื่อป้องกันช่องโหว่การเข้าถึงไฟล์นอกขอบเขต (**Path Traversal**)

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

---

## 🎯 สรุปภาพรวมและเช็กลิสต์การนำไปใช้ (Architectural Checklist)

เมื่อทำการ Review หรือเขียนโค้ด Node.js ให้ตรวจสอบตามรายการต่อไปนี้:

- [ ] **Runtime Boundaries and Entry Points:** นำหลักการ "การแยก Process Startup ออกจาก Application Wiring" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Async Filesystem Without Blocking:** นำหลักการ "การใช้ Non-blocking I/O เพื่อไม่บล็อก Event Loop" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Async Failure Boundaries:** นำหลักการ "การกำหนดจุดดักจับ Exception และ Unhandled Rejection" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Environment Variables and Configuration:** นำหลักการ "การโหลดและ Validate Config ในช่วง Startup" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Module Side Effects and Startup Code:** นำหลักการ "การป้องกัน Side Effect ขณะ Import โมดูล" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Streams for Large Payloads:** นำหลักการ "การประมวลผลข้อมูลขนาดใหญ่ด้วย Stream Pipeline" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **HTTP Request Lifecycle:** นำหลักการ "การควบคุมสถานะและ Lifecycle ของ HTTP Request/Response" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Graceful Shutdown and Process Signals:** นำหลักการ "การปิดโปรเซสอย่างปลอดภัยเมื่อรับสัญญาณ SIGINT/SIGTERM" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Structured Logging:** นำหลักการ "การบันทึก Log แบบมีโครงสร้าง JSON เพื่อการค้นหาและติดตาม" ไปปฏิบัติอย่างเคร่งครัด
- [ ] **Input Validation and Path Safety:** นำหลักการ "การตรวจสอบ Input และการป้องกัน Directory Traversal" ไปปฏิบัติอย่างเคร่งครัด

[⬆ กลับสู่สารบัญ](#สารบัญ-table-of-contents)

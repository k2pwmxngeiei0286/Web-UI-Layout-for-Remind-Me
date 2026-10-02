import { FormEvent, ReactNode, useMemo, useState } from "react";

type IconName =
  | "calendar"
  | "check"
  | "chevron-left"
  | "chevron-right"
  | "clock"
  | "grid"
  | "menu"
  | "note"
  | "plus"
  | "search"
  | "settings"
  | "sparkle"
  | "x";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    calendar: (
      <>
        <path d="M7 2v3M17 2v3M3.5 9h17" />
        <rect x="3.5" y="4" width="17" height="17" rx="2.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    "chevron-left": <path d="m15 18-6-6 6-6" />,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    grid: (
      <>
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <rect x="14" y="14" width="6" height="6" rx="1" />
      </>
    ),
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    note: (
      <>
        <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h6M9 16h6" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z" />
      </>
    ),
    sparkle: <path d="M12 2c.5 5.4 3.1 8.1 8 8.5-4.9.4-7.5 3.1-8 8.5-.5-5.4-3.1-8.1-8-8.5 4.9-.4 7.5-3.1 8-8.5Z" />,
    x: <path d="m6 6 12 12M18 6 6 18" />,
  };

  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7">
        {paths[name]}
      </g>
    </svg>
  );
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

type CalendarItem = {
  day: number;
  label: string;
  tone: "pink" | "yellow" | "blue";
  monthOffset?: number;
};

const initialItems: CalendarItem[] = [
  { day: 2, label: "Dentist · 10:30", tone: "blue" },
  { day: 4, label: "Plan weekend", tone: "yellow" },
  { day: 8, label: "Team catch-up", tone: "pink" },
  { day: 12, label: "Call Mum", tone: "yellow" },
  { day: 14, label: "Dinner · 7:00", tone: "pink" },
  { day: 18, label: "Deep work", tone: "blue" },
  { day: 23, label: "Gallery opening", tone: "pink" },
  { day: 27, label: "Water plants", tone: "blue" },
];

function monthCells(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
  const days = new Date(year, month + 1, 0).getDate();
  const previousDays = new Date(year, month, 0).getDate();
  return Array.from({ length: 42 }, (_, index) => {
    if (index < mondayOffset) {
      return { day: previousDays - mondayOffset + index + 1, outside: true, offset: -1 };
    }
    if (index >= mondayOffset + days) {
      return { day: index - mondayOffset - days + 1, outside: true, offset: 1 };
    }
    return { day: index - mondayOffset + 1, outside: false, offset: 0 };
  });
}

const toneClasses = {
  pink: "bg-[#ffd7e2] text-[#71253d]",
  yellow: "bg-[#fff0aa] text-[#594a12]",
  blue: "bg-[#dbeaf7] text-[#24445e]",
};

export default function App() {
  const [view, setView] = useState<"month" | "day">("month");
  const [displayDate, setDisplayDate] = useState(new Date(2025, 4, 1));
  const [selectedDay, setSelectedDay] = useState(14);
  const [items, setItems] = useState(initialItems);
  const [tasks, setTasks] = useState([
    { text: "Send the project outline", done: true },
    { text: "Pick up fresh flowers", done: false },
    { text: "Book train tickets", done: false },
  ]);
  const [journal, setJournal] = useState(
    "The air felt especially soft this morning. I took the long way home, noticed the tiny pink blooms by the corner shop, and remembered to slow down.\n\nLittle note: make more room for unhurried things.",
  );
  const [noteOpen, setNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const cells = useMemo(
    () => monthCells(displayDate.getFullYear(), displayDate.getMonth()),
    [displayDate],
  );

  function changeMonth(amount: number) {
    setDisplayDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  }

  function addNote(event: FormEvent) {
    event.preventDefault();
    const trimmed = newNote.trim();
    if (!trimmed) return;
    setItems((current) => [
      ...current.filter(
        (item) =>
          !(
            item.day === selectedDay &&
            item.label.startsWith("Note:") &&
            item.monthOffset === displayDate.getMonth()
          ),
      ),
      {
        day: selectedDay,
        label: `Note: ${trimmed}`,
        tone: "pink",
        monthOffset: displayDate.getMonth(),
      },
    ]);
    setNewNote("");
    setNoteOpen(false);
  }

  const dateLabel = `${monthNames[displayDate.getMonth()]} ${displayDate.getFullYear()}`;

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#1d1d1b]">
      <div className="technical-grid fixed inset-0 pointer-events-none opacity-60" />

      <header className="relative z-30 flex h-[72px] items-center justify-between border-b border-[#d9d5d0] bg-[#fffdf9]/95 px-5 backdrop-blur md:px-8">
        <div className="flex items-center gap-3">
          <button
            aria-label="Open navigation"
            className="grid size-10 place-items-center rounded-full border border-[#ded9d2] lg:hidden"
            onClick={() => setMobileNav(true)}
          >
            <Icon name="menu" />
          </button>
          <div className="relative grid size-10 place-items-center rounded-[13px] bg-[#f4a5bb] text-[#582338]">
            <Icon name="calendar" size={21} />
            <span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#fffdf9] bg-[#fff0a8]" />
          </div>
          <div>
            <p className="text-[19px] font-black leading-none tracking-[-0.04em]">REMIND ME</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#9b777f]">
              Things worth remembering
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <label className="flex h-10 w-48 items-center gap-2 rounded-full border border-[#ded9d2] bg-white px-4 text-[#8d8882] lg:w-60">
            <Icon name="search" size={17} />
            <input
              aria-label="Search notes and reminders"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaa49e]"
              placeholder="Find a note..."
            />
          </label>
          <button
            aria-label="Settings"
            className="grid size-10 place-items-center rounded-full border border-[#ded9d2] bg-white transition hover:rotate-12 hover:bg-[#fff1f5]"
          >
            <Icon name="settings" size={18} />
          </button>
          <div className="ml-1 grid size-10 place-items-center rounded-full bg-[#322b2e] text-xs font-bold text-white">
            AM
          </div>
        </div>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-72px)]">
        <aside
          className={`${mobileNav ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-[#d9d5d0] bg-[#fffdf9] p-5 transition-transform lg:static lg:z-auto lg:w-[220px] lg:translate-x-0 xl:w-[250px]`}
        >
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <span className="font-black tracking-tight">MENU</span>
            <button
              aria-label="Close navigation"
              className="grid size-9 place-items-center rounded-full border border-[#ded9d2]"
              onClick={() => setMobileNav(false)}
            >
              <Icon name="x" />
            </button>
          </div>
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#aaa39d]">
            My space
          </p>
          <nav className="space-y-1.5">
            <button className="nav-item nav-active">
              <Icon name="calendar" />
              Calendar
              <span className="ml-auto rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-bold">4</span>
            </button>
            <button className="nav-item">
              <Icon name="note" />
              Daily notes
            </button>
            <button className="nav-item">
              <Icon name="check" />
              All tasks
            </button>
          </nav>

          <div className="my-7 border-t border-dashed border-[#d8d1ca]" />
          <p className="mb-3 px-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#aaa39d]">
            Little labels
          </p>
          <div className="space-y-3 px-3 text-xs font-semibold">
            <div className="flex items-center gap-3"><span className="size-2.5 rounded-full bg-[#ef8caa]" />Personal</div>
            <div className="flex items-center gap-3"><span className="size-2.5 rounded-full bg-[#e2c853]" />Important</div>
            <div className="flex items-center gap-3"><span className="size-2.5 rounded-full bg-[#8db9d8]" />Slow days</div>
          </div>

          <div className="relative mt-auto overflow-hidden rounded-[22px] border border-[#e3c8cf] bg-[#ffe8ee] p-4 pt-16">
            <div className="flower-mark absolute -right-1 top-0" aria-hidden="true">
              <span /><span /><span /><span /><i />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em]">A tiny thought</p>
            <p className="mt-2 text-xs leading-relaxed text-[#6d4e56]">
              You don&apos;t have to do everything today.
            </p>
          </div>
        </aside>

        {mobileNav && (
          <button
            aria-label="Close navigation overlay"
            className="fixed inset-0 z-40 bg-[#282124]/30 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileNav(false)}
          />
        )}

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-7 xl:px-10 xl:py-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-[#a1707e]">
                <Icon name="sparkle" size={13} />
                Your gentle agenda
              </div>
              <h1 className="text-[clamp(2rem,4vw,3.4rem)] font-black leading-none tracking-[-0.065em]">
                {dateLabel}
                <span className="ml-3 inline-block align-top text-lg font-medium tracking-normal text-[#e78daa]">
                  / 05
                </span>
              </h1>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex rounded-full border border-[#d9d4ce] bg-white p-1">
                {(["month", "day"] as const).map((option) => (
                  <button
                    className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition ${
                      view === option ? "bg-[#282326] text-white" : "text-[#8f8985] hover:text-black"
                    }`}
                    key={option}
                    onClick={() => setView(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                className="hidden h-10 items-center gap-2 rounded-full bg-[#ee9db5] px-4 text-xs font-black text-[#512333] shadow-[0_4px_0_#c66f89] transition active:translate-y-1 active:shadow-none sm:flex"
                onClick={() => setNoteOpen(true)}
              >
                <Icon name="plus" size={16} />
                ADD NOTE
              </button>
            </div>
          </div>

          <div className="grid gap-5 2xl:grid-cols-[minmax(620px,1.65fr)_minmax(330px,.75fr)]">
            <div className="overflow-hidden rounded-[24px] border border-[#d9d4ce] bg-[#fffdf9] shadow-[0_14px_50px_rgba(87,61,68,.06)]">
              <div className="flex items-center justify-between border-b border-[#ded9d3] px-4 py-3 sm:px-5">
                <button
                  className="grid size-9 place-items-center rounded-full border border-[#ded9d3] bg-white transition hover:bg-[#ffe9ef]"
                  onClick={() => changeMonth(-1)}
                  aria-label="Previous month"
                >
                  <Icon name="chevron-left" />
                </button>
                <button
                  className="text-xs font-black uppercase tracking-[0.16em]"
                  onClick={() => setDisplayDate(new Date(2025, 4, 1))}
                >
                  Today
                </button>
                <button
                  className="grid size-9 place-items-center rounded-full border border-[#ded9d3] bg-white transition hover:bg-[#ffe9ef]"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
                >
                  <Icon name="chevron-right" />
                </button>
              </div>

              {view === "month" ? (
                <>
                  <div className="grid grid-cols-7 border-b border-[#ded9d3] bg-[#faf8f4]">
                    {weekdays.map((weekday) => (
                      <div
                        className="border-r border-[#e4dfda] px-1 py-3 text-center text-[9px] font-black tracking-[0.14em] text-[#928b86] last:border-r-0"
                        key={weekday}
                      >
                        {weekday}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {cells.map((cell, index) => {
                      const dayItems = cell.outside
                        ? []
                        : items.filter(
                            (item) =>
                              item.day === cell.day &&
                              (item.monthOffset === undefined ||
                                item.monthOffset === displayDate.getMonth()),
                          );
                      const isSelected = !cell.outside && cell.day === selectedDay;
                      return (
                        <button
                          className={`calendar-cell group ${cell.outside ? "bg-[#faf9f6] text-[#c8c2bc]" : ""} ${
                            isSelected ? "selected-cell" : ""
                          }`}
                          key={`${cell.day}-${index}`}
                          onClick={() => {
                            if (!cell.outside) setSelectedDay(cell.day);
                          }}
                        >
                          <span
                            className={`grid size-7 place-items-center rounded-full text-[11px] font-bold transition ${
                              isSelected ? "bg-[#282326] text-white" : "group-hover:bg-[#f8e0e7]"
                            }`}
                          >
                            {cell.day}
                          </span>
                          <div className="mt-1 w-full space-y-1">
                            {dayItems.slice(0, 2).map((item) => (
                              <span
                                className={`block truncate rounded-[6px] px-1.5 py-1 text-left text-[9px] font-bold sm:text-[10px] ${toneClasses[item.tone]}`}
                                key={item.label}
                              >
                                {item.label}
                              </span>
                            ))}
                          </div>
                          {!cell.outside && (
                            <span className="absolute bottom-2 right-2 hidden size-5 place-items-center rounded-full bg-[#282326] text-white opacity-0 transition group-hover:opacity-100 sm:grid">
                              <Icon name="plus" size={11} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="day-timeline min-h-[630px] p-5 sm:p-8">
                  <div className="mb-8 flex items-center gap-4">
                    <div className="grid size-16 place-items-center rounded-[20px] bg-[#f19eb7] text-2xl font-black shadow-[4px_4px_0_#2b2628]">
                      {selectedDay}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[.16em] text-[#a57280]">
                        Wednesday
                      </p>
                      <h2 className="mt-1 text-2xl font-black tracking-tight">A day with room to breathe.</h2>
                    </div>
                  </div>
                  {[
                    ["09:00", "Morning reset & coffee", "blue"],
                    ["10:30", "Focus session", "pink"],
                    ["13:00", "Lunch outside", "yellow"],
                    ["19:00", "Dinner with Mia", "pink"],
                  ].map(([time, label, tone]) => (
                    <div className="grid grid-cols-[62px_1fr] gap-4" key={time}>
                      <span className="pt-4 text-[10px] font-black text-[#938c86]">{time}</span>
                      <div className="relative min-h-28 border-l border-dashed border-[#cac3bc] pl-5 pt-3">
                        <div
                          className={`rounded-xl px-4 py-3 text-sm font-bold ${toneClasses[tone as keyof typeof toneClasses]}`}
                        >
                          {label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside className="grid min-w-0 gap-5 md:grid-cols-2 2xl:grid-cols-1 2xl:self-start">
              <section className="rounded-[24px] border border-[#d9d4ce] bg-[#fffdf9] p-5">
                <div className="mb-5 flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#a47782]">
                      Wednesday · {String(selectedDay).padStart(2, "0")}
                    </p>
                    <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">Today&apos;s rhythm</h2>
                  </div>
                  <span className="grid size-9 place-items-center rounded-full bg-[#fff0aa] text-[#6b5a16]">
                    <Icon name="clock" size={17} />
                  </span>
                </div>
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <button
                      className="group flex w-full items-center gap-3 rounded-xl border border-transparent p-2 text-left transition hover:border-[#eadfe1] hover:bg-[#fff7f9]"
                      key={task.text}
                      onClick={() =>
                        setTasks((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, done: !item.done } : item,
                          ),
                        )
                      }
                    >
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-md border ${
                          task.done
                            ? "border-[#dc7896] bg-[#e98fab] text-white"
                            : "border-[#cfc8c2] bg-white"
                        }`}
                      >
                        {task.done && <Icon name="check" size={13} />}
                      </span>
                      <span className={`text-xs font-semibold ${task.done ? "text-[#aaa29d] line-through" : ""}`}>
                        {task.text}
                      </span>
                    </button>
                  ))}
                </div>
                <button
                  className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.13em] text-[#ae5873] hover:text-[#6b263c]"
                  onClick={() =>
                    setTasks((current) => [...current, { text: "A new gentle reminder", done: false }])
                  }
                >
                  <Icon name="plus" size={15} />
                  Add a small thing
                </button>
              </section>

              <section className="note-paper relative overflow-hidden rounded-[24px] border border-[#ddc9ce] bg-[#ffeef2] p-5 pb-4">
                <div className="absolute right-4 top-4 rotate-6 rounded-sm bg-[#f3ce5c] px-2 py-1 text-[8px] font-black uppercase tracking-[.14em] shadow-sm">
                  keep this
                </div>
                <div className="mb-4 flex items-center gap-2">
                  <Icon name="note" size={17} />
                  <h2 className="text-sm font-black uppercase tracking-[0.13em]">Daily note</h2>
                </div>
                <textarea
                  aria-label="Daily journal entry"
                  className="min-h-48 w-full resize-none bg-transparent text-[13px] font-medium leading-7 text-[#5c444a] outline-none md:min-h-56"
                  onChange={(event) => setJournal(event.target.value)}
                  value={journal}
                />
                <div className="mt-2 flex items-center justify-between border-t border-[#e5cfd5] pt-3 text-[9px] font-bold uppercase tracking-[.12em] text-[#a77c87]">
                  <span>Saved just now</span>
                  <span>{journal.split(/\s+/).filter(Boolean).length} words</span>
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>

      <button
        aria-label="Add note"
        className="fixed bottom-5 right-5 z-30 grid size-14 place-items-center rounded-full bg-[#e98fab] text-[#4f2030] shadow-[0_5px_0_#8c4058] active:translate-y-1 active:shadow-none sm:hidden"
        onClick={() => setNoteOpen(true)}
      >
        <Icon name="plus" size={22} />
      </button>

      {noteOpen && (
        <div className="fixed inset-0 z-[60] grid place-items-end bg-[#2c2528]/35 p-0 backdrop-blur-sm sm:place-items-center sm:p-5">
          <form
            className="w-full rounded-t-[28px] border border-[#e0d8d3] bg-[#fffdf9] p-6 shadow-2xl sm:max-w-md sm:rounded-[28px]"
            onSubmit={addNote}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[.18em] text-[#a56a7a]">
                  {monthNames[displayDate.getMonth()]} {selectedDay}
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight">Pin a reminder</h2>
              </div>
              <button
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full border border-[#ded7d1]"
                onClick={() => setNoteOpen(false)}
                type="button"
              >
                <Icon name="x" />
              </button>
            </div>
            <label className="text-[10px] font-black uppercase tracking-[.14em]" htmlFor="new-note">
              What should we remember?
            </label>
            <textarea
              autoFocus
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-[#ded6d1] bg-white p-4 text-sm outline-none transition focus:border-[#e58da8] focus:ring-4 focus:ring-[#f8dce4]"
              id="new-note"
              onChange={(event) => setNewNote(event.target.value)}
              placeholder="Lunch with Sam, water the plants..."
              value={newNote}
            />
            <button
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#292426] text-xs font-black uppercase tracking-[.12em] text-white transition hover:bg-[#a94f6b]"
              type="submit"
            >
              <Icon name="plus" size={16} />
              Pin to the day
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

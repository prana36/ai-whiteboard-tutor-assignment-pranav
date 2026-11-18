"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, AudioLines, BookOpen, Check, ChevronDown, Clock3, Download, FilePlus2, Headphones, Highlighter, Lightbulb, LoaderCircle, MessageCircle, Pause, PenLine, Play, RotateCcw, Search, Send, Sparkles, Volume2, VolumeX, X } from "lucide-react";
import { Whiteboard, type BoardAnnotation } from "@/components/Whiteboard";
import type { Lesson, LessonChapter, LessonMessage, SavedLesson } from "@/types/lesson";

const STORAGE_KEY = "braynix-tutor-lessons-v1";
const SUGGESTIONS = ["How binary search finds a number", "Why the Moon has phases", "How a fraction becomes a decimal"];
const formatTime = (seconds: number) => `${Math.floor(Math.max(0, seconds) / 60)}:${String(Math.floor(Math.max(0, seconds)) % 60).padStart(2, "0")}`;
const estimateDuration = (chapters: LessonChapter[]) => chapters.map((chapter) => Math.max(12, Math.ceil(chapter.narration.trim().split(/\s+/).length / 2.35)));
const errorText = (payload: unknown, fallback: string) => payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string" ? payload.error : fallback;

function readShelf(): SavedLesson[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = value ? JSON.parse(value) : [];
    return Array.isArray(parsed) ? parsed as SavedLesson[] : [];
  } catch { return []; }
}

function ChapterDot({ active, complete }: { active: boolean; complete: boolean }) {
  return <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? "bg-[#dff4eb] text-[#267b5c]" : active ? "bg-[#eaf0ff] text-[#3867e8] ring-1 ring-[#3867e8]/25" : "bg-[#f1f1ef] text-[#9a9ca3]"}`}>{complete ? <Check size={14} /> : null}</span>;
}

export default function TutorPage() {
  const [topic, setTopic] = useState("");
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [searchLessons, setSearchLessons] = useState("");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [durations, setDurations] = useState<number[]>([]);
  const [tracks, setTracks] = useState<string[]>([]);
  const [voiceMode, setVoiceMode] = useState<"openai" | "browser" | null>(null);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [prepareProgress, setPrepareProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [status, setStatus] = useState<{ configured: boolean; model: string } | null>(null);
  const [messages, setMessages] = useState<LessonMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [annotations, setAnnotations] = useState<Record<string, BoardAnnotation[]>>({});
  const [tool, setTool] = useState<"select" | "pen" | "highlight">("select");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [view, setView] = useState<"board" | "conversation">("board");
  const [shelfOpen, setShelfOpen] = useState(false);
  const [clock, setClock] = useState("9:41 AM");
  const audioRef = useRef<HTMLAudioElement>(null);
  const shelfRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const lessonRef = useRef(lesson);
  const playingRef = useRef(playing);

  useEffect(() => { lessonRef.current = lesson; playingRef.current = playing; }, [lesson, playing]);
  useEffect(() => {
    setLessons(readShelf());
    fetch("/api/status").then((response) => response.json()).then(setStatus).catch(() => setStatus({ configured: false, model: "" }));
    const tick = () => setClock(new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date()));
    tick(); const timer = window.setInterval(tick, 60_000); return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!shelfOpen) return;
    const close = (event: MouseEvent) => { if (!shelfRef.current?.contains(event.target as Node)) setShelfOpen(false); };
    document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close);
  }, [shelfOpen]);

  const chapter = lesson?.chapters[chapterIndex];
  const safeDurations = useMemo(() => lesson ? (durations.length === lesson.chapters.length ? durations : estimateDuration(lesson.chapters)) : [], [lesson, durations]);
  const starts = useMemo(() => safeDurations.map((_, index) => safeDurations.slice(0, index).reduce((sum, duration) => sum + duration, 0)), [safeDurations]);
  const totalDuration = safeDurations.reduce((sum, value) => sum + value, 0);
  const chapterDuration = safeDurations[chapterIndex] || 0;
  const localPlayhead = Math.max(0, Math.min(chapterDuration, playhead - (starts[chapterIndex] ?? 0)));
  const chapterProgress = chapterDuration ? localPlayhead / chapterDuration : 0;
  const shelfMatches = lessons.filter((item) => `${item.title} ${item.topic}`.toLowerCase().includes(searchLessons.toLowerCase()));

  const stopPlayback = useCallback(() => {
    setPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    if (audioRef.current) audioRef.current.pause();
  }, []);

  useEffect(() => () => tracks.forEach((url) => URL.revokeObjectURL(url)), [tracks]);
  useEffect(() => () => {
    requestRef.current?.abort();
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || voiceMode !== "openai" || !tracks[chapterIndex]) return;
    audio.playbackRate = rate; audio.muted = muted;
    if (playing) audio.play().catch(() => { setPlaying(false); setVoiceError("Your browser could not play the prepared narration. Try browser voice."); });
    else audio.pause();
  }, [chapterIndex, tracks, voiceMode, playing, rate, muted]);

  useEffect(() => {
    if (!playing || voiceMode !== "browser") return;
    const timer = window.setInterval(() => {
      const end = (starts[chapterIndex] ?? 0) + (safeDurations[chapterIndex] ?? 0);
      setPlayhead((current) => Math.min(end, current + 0.25 * rate));
    }, 250);
    return () => window.clearInterval(timer);
  }, [playing, voiceMode, chapterIndex, starts, safeDurations, rate]);

  function speakBrowserChapter(index: number) {
    const nextChapter = lessonRef.current?.chapters[index];
    if (!nextChapter || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(nextChapter.narration);
    utterance.rate = rate;
    utterance.volume = muted ? 0 : 1;
    utterance.onend = () => {
      if (!playingRef.current) return;
      const next = index + 1;
      if (lessonRef.current && next < lessonRef.current.chapters.length) {
        setPlayhead(starts[next] ?? totalDuration);
        setChapterIndex(next);
        window.setTimeout(() => { if (playingRef.current) speakBrowserChapter(next); }, 0);
      } else {
        setPlaying(false);
        setPlayhead(totalDuration);
      }
    };
    window.speechSynthesis.speak(utterance);
  }

  function persist(saved: SavedLesson) {
    setLessons((current) => {
      const next = [saved, ...current.filter((item) => item.id !== saved.id)].slice(0, 30);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { setError("This lesson works for now, but browser storage is full, so it could not be saved."); }
      return next;
    });
  }

  function startNewLesson() {
    requestRef.current?.abort();
    requestRef.current = null;
    stopPlayback();
    setLesson(null); setTopic(""); setError(""); setVoiceError(""); setGenerating(false); setPreparing(false);
  }

  async function generateLesson(event?: FormEvent<HTMLFormElement>, requestedTopic?: string) {
    event?.preventDefault(); const value = (requestedTopic ?? topic).trim();
    if (value.length < 3) { setError("Try a topic with at least a few words, like ‘How binary search works’."); return; }
    stopPlayback(); requestRef.current?.abort(); const controller = new AbortController(); requestRef.current = controller;
    setGenerating(true); setError(""); setVoiceError(""); setQuestion(""); setMessages([]); setAnnotations({}); setQuizSubmitted(false); setQuizAnswer(null); setTracks([]); setDurations([]); setVoiceMode(null); setPlayhead(0); setChapterIndex(0); setPrepareProgress(0);
    if (requestedTopic) setTopic(requestedTopic);
    try {
      const response = await fetch("/api/lesson", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic: value }), signal: controller.signal });
      const payload = await response.json(); if (!response.ok) throw new Error(errorText(payload, "The lesson could not be generated. Please retry."));
      const nextLesson = payload as Lesson;
      if (!nextLesson.chapters?.length) throw new Error("The tutor did not return a complete lesson. Please try again.");
      setLesson(nextLesson); setView("board");
      persist({ id: nextLesson.id, topic: nextLesson.topic, title: nextLesson.title, hook: nextLesson.hook, objective: nextLesson.objective, chapters: nextLesson.chapters, quiz: nextLesson.quiz, createdAt: nextLesson.createdAt });
      setMessages([{ role: "assistant", content: `Let’s explore ${nextLesson.topic}. ${nextLesson.hook} I’ve set up ${nextLesson.chapters.length} short chapters; you can stop me or jump in with a question anytime.` }]);
    } catch (caught) {
      if (caught instanceof Error && caught.name === "AbortError") return;
      setError(caught instanceof Error ? caught.message : "Something went wrong while building the lesson.");
    } finally { if (requestRef.current === controller) setGenerating(false); }
  }

  function openSaved(item: SavedLesson) {
    stopPlayback(); setLesson({ ...item, hook: item.hook ?? "Let’s take this idea one clear step at a time." }); setTopic(item.topic); setChapterIndex(0); setPlayhead(0); setTracks([]); setDurations([]); setVoiceMode(null); setPrepareProgress(0); setAnnotations({}); setQuizAnswer(null); setQuizSubmitted(false); setError(""); setVoiceError(""); setMessages([{ role: "assistant", content: `Welcome back to ${item.title}. Prepare the voice again to play this saved lesson.` }]); setShelfOpen(false); setView("board");
  }

  async function prepareVoice() {
    if (!lesson || preparing) return;
    stopPlayback(); requestRef.current?.abort(); const controller = new AbortController(); requestRef.current = controller;
    setPreparing(true); setVoiceError(""); setPrepareProgress(0); const nextTracks: string[] = []; const nextDurations: number[] = [];
    try {
      for (let index = 0; index < lesson.chapters.length; index += 1) {
        const response = await fetch("/api/speech", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: lesson.chapters[index].narration }), signal: controller.signal });
        if (!response.ok) { const payload = await response.json().catch(() => null); throw new Error(errorText(payload, "Voice could not be prepared.")); }
        const url = URL.createObjectURL(await response.blob()); nextTracks.push(url);
        const duration = await new Promise<number>((resolve) => {
          const probe = new Audio(url); let done = false;
          const finish = () => { if (done) return; done = true; resolve(Number.isFinite(probe.duration) ? probe.duration : estimateDuration([lesson.chapters[index]])[0]); };
          probe.addEventListener("loadedmetadata", finish, { once: true }); probe.addEventListener("error", finish, { once: true }); window.setTimeout(finish, 2500);
        });
        nextDurations.push(Math.max(1, duration)); setPrepareProgress(Math.round(((index + 1) / lesson.chapters.length) * 100));
      }
      setTracks(nextTracks); setDurations(nextDurations); setVoiceMode("openai"); setPlayhead(0); setChapterIndex(0);
    } catch (caught) {
      nextTracks.forEach((url) => URL.revokeObjectURL(url)); if (caught instanceof Error && caught.name === "AbortError") return;
      setVoiceError(caught instanceof Error ? caught.message : "Voice could not be prepared.");
    } finally { if (requestRef.current === controller) setPreparing(false); }
  }

  function useBrowserVoice() {
    if (!("speechSynthesis" in window)) { setVoiceError("This browser does not support speech synthesis. Try a current version of Chrome, Edge, or Safari."); return; }
    setVoiceError(""); setVoiceMode("browser"); setTracks([]); setDurations(lesson ? estimateDuration(lesson.chapters) : []); setPlayhead(0); setChapterIndex(0);
  }

  function togglePlayback() {
    if (!lesson) return;
    if (!voiceMode) { setVoiceError("Prepare the narrated voice before starting playback."); return; }
    if (playing) { if (voiceMode === "browser") window.speechSynthesis.pause(); else audioRef.current?.pause(); setPlaying(false); }
    else {
      if (playhead >= totalDuration && totalDuration > 0) { setPlayhead(0); setChapterIndex(0); if (audioRef.current) audioRef.current.currentTime = 0; }
      setPlaying(true);
      if (voiceMode === "browser") {
        if (window.speechSynthesis.paused && window.speechSynthesis.speaking) window.speechSynthesis.resume();
        else speakBrowserChapter(playhead >= totalDuration ? 0 : chapterIndex);
      }
    }
  }

  function restartLesson() {
    stopPlayback();
    setPlayhead(0);
    setChapterIndex(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }

  function seek(seconds: number) {
    if (!lesson) return;
    const value = Math.max(0, Math.min(totalDuration, seconds));
    const found = starts.findIndex((start, index) => value >= start && value < start + safeDurations[index]);
    const target = found === -1 ? lesson.chapters.length - 1 : found;
    const fallbackSeek = voiceMode === "browser" ? (starts[target] ?? 0) : value;
    setPlayhead(fallbackSeek); setChapterIndex(target);
    if (voiceMode === "openai" && target === chapterIndex && audioRef.current) audioRef.current.currentTime = Math.max(0, value - (starts[target] ?? 0));
    if (voiceMode === "browser" && playing) { setPlayhead(starts[target] ?? 0); speakBrowserChapter(target); }
  }

  function chooseChapter(index: number) {
    if (!lesson || index < 0 || index >= lesson.chapters.length) return;
    const wasPlaying = playing; if (voiceMode === "browser") window.speechSynthesis.cancel();
    setChapterIndex(index); setPlayhead(starts[index] ?? 0);
    if (voiceMode === "browser" && wasPlaying) { setPlaying(true); window.setTimeout(() => speakBrowserChapter(index), 0); }
  }

  function onAudioEnded() {
    if (!lesson) return;
    if (chapterIndex < lesson.chapters.length - 1) { const next = chapterIndex + 1; setChapterIndex(next); setPlayhead(starts[next] ?? 0); }
    else { setPlaying(false); setPlayhead(totalDuration); }
  }

  async function askTutor(event?: FormEvent<HTMLFormElement>, suggested?: string) {
    event?.preventDefault(); if (!lesson || busy) return;
    const value = (suggested ?? question).trim(); if (!value) return;
    stopPlayback(); const history = [...messages, { role: "user" as const, content: value }];
    setMessages(history); setQuestion(""); setSelectedLabel(""); setBusy(true); setError("");
    try {
      const response = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: value, title: lesson.title, objective: lesson.objective, chapters: lesson.chapters, history: messages }) });
      const payload = await response.json(); if (!response.ok) throw new Error(errorText(payload, "The tutor could not answer. Please retry."));
      setMessages((current) => [...current, { role: "assistant", content: payload.answer }]);
    } catch (caught) { setMessages((current) => current.slice(0, -1)); setQuestion(value); setError(caught instanceof Error ? caught.message : "The tutor could not answer. Please retry."); }
    finally { setBusy(false); }
  }

  function exportBoard() {
    const svg = document.getElementById("tutor-whiteboard-svg"); if (!svg) return;
    const copy = svg.cloneNode(true) as SVGSVGElement; copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml;charset=utf-8" }));
    link.download = `${lesson?.topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "lesson"}-whiteboard.svg`; link.click(); URL.revokeObjectURL(link.href);
  }

  const displayElapsed = formatTime(playhead); const displayTotal = formatTime(totalDuration);

  return <main className="min-h-screen bg-[#f5f5f2] text-[#252a35]">
    <header className="sticky top-0 z-40 flex h-[70px] items-center justify-between border-b border-[#e8e7e1] bg-[#fbfbf9]/90 px-4 backdrop-blur-xl md:px-7">
      <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#e9edff] text-[#3867e8]"><AudioLines size={20} /></div><div><p className="font-semibold tracking-[-0.02em]">Scribble<span className="text-[#3867e8]">wise</span></p><p className="hidden text-[11px] text-[#92959d] sm:block">A visual learning studio</p></div></div>
      <div className="hidden items-center gap-2 rounded-full border border-[#eae9e4] bg-white px-3 py-1.5 text-xs text-[#737985] sm:flex"><span className={`h-2 w-2 rounded-full ${status?.configured ? "bg-[#54bd90]" : "bg-[#e4b252]"}`} />{status?.configured ? "AI tutor ready" : status ? "AI needs server setup" : "Connecting tutor…"}</div>
      <div className="flex items-center gap-2"><div className="relative" ref={shelfRef}><button type="button" onClick={() => setShelfOpen((value) => !value)} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#606673] hover:bg-[#f0f0ed]" aria-expanded={shelfOpen}><BookOpen size={16} /><span className="hidden sm:inline">My lessons</span>{lessons.length > 0 && <span className="rounded-full bg-[#e9edff] px-1.5 py-0.5 text-[10px] text-[#3867e8]">{lessons.length}</span>}<ChevronDown size={14} className="hidden sm:block" /></button>
        {shelfOpen && <div className="absolute right-0 top-12 z-50 w-[min(350px,calc(100vw-24px))] rounded-[22px] border border-[#e8e7e1] bg-white p-3 shadow-[0_18px_60px_rgba(39,46,62,0.15)]"><div className="flex items-center justify-between px-2 pb-2"><p className="font-semibold">Your lesson shelf</p><button onClick={() => setShelfOpen(false)} aria-label="Close saved lessons"><X size={17} /></button></div><div className="relative mb-2"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9da4]" /><input value={searchLessons} onChange={(event) => setSearchLessons(event.target.value)} placeholder="Search saved lessons" className="h-10 w-full rounded-xl bg-[#f5f5f2] pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-[#3867e8]/20" /></div><div className="max-h-[300px] space-y-1 overflow-y-auto">{shelfMatches.length ? shelfMatches.map((item) => <button key={item.id} onClick={() => openSaved(item)} className="w-full rounded-xl px-3 py-2.5 text-left hover:bg-[#f5f5f2]"><p className="truncate text-sm font-medium">{item.title}</p><p className="mt-1 truncate text-xs text-[#858a94]">{item.topic} · {new Date(item.createdAt).toLocaleDateString()}</p></button>) : <p className="px-3 py-8 text-center text-sm text-[#8a8d94]">{lessons.length ? "No lessons match that search." : "Lessons you create will appear here."}</p>}</div></div>}</div>
        <span className="hidden h-7 w-px bg-[#e8e7e1] md:block" /><button type="button" onClick={startNewLesson} className="flex h-10 items-center gap-2 rounded-full bg-[#3867e8] px-4 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(56,103,232,0.2)] hover:bg-[#2857d7]"><FilePlus2 size={16} /><span className="hidden sm:inline">New lesson</span><span className="sm:hidden">New</span></button>
      </div>
    </header>

    {!lesson ? <section className="mx-auto flex min-h-[calc(100vh-70px)] max-w-[1000px] flex-col justify-center px-5 pb-16 pt-12"><div className="mx-auto max-w-[730px] text-center">
      <div className="mx-auto mb-7 flex h-[72px] w-[72px] rotate-[-4deg] items-center justify-center rounded-[24px] bg-[#e9edff] text-[#3867e8] shadow-[0_13px_30px_rgba(56,103,232,0.14)]"><Sparkles size={30} strokeWidth={1.7} /></div><p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#667ed3]">Your own patient, visual tutor</p><h1 className="font-[family-name:var(--font-display)] text-[clamp(38px,7vw,66px)] font-semibold leading-[1.03] tracking-[-0.055em] text-[#222936]">Big ideas, drawn<br className="hidden sm:block" /> one step at a time.</h1><p className="mx-auto mt-5 max-w-[540px] text-base leading-7 text-[#777c86] sm:text-lg">What would you like to understand? Tell Scribblewise and it will build a short lesson with a live whiteboard and a voice you can pause, replay, and question.</p>
      <form onSubmit={(event) => void generateLesson(event)} className="mx-auto mt-9 flex max-w-[680px] flex-col gap-2 rounded-[24px] border border-[#e7e7e2] bg-white p-2.5 shadow-[0_16px_45px_rgba(37,44,58,0.08)] focus-within:border-[#b8c5f4] focus-within:ring-4 focus-within:ring-[#3867e8]/[0.06] sm:flex-row sm:items-center"><input autoFocus value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={160} placeholder="Try “How does a rainbow form?”" className="h-12 min-w-0 flex-1 rounded-2xl bg-transparent px-4 text-[15px] outline-none placeholder:text-[#a1a4ab]" aria-label="Topic to learn" /><button disabled={generating} className="flex h-12 items-center justify-center gap-2 rounded-[17px] bg-[#3867e8] px-5 text-sm font-semibold text-white hover:bg-[#2857d7] disabled:cursor-wait disabled:opacity-70">{generating ? <><LoaderCircle size={17} className="animate-spin" />Building lesson</> : <>Teach me <ArrowRight size={17} /></>}</button></form>
      {error && <p role="alert" className="mx-auto mt-4 max-w-lg rounded-2xl bg-[#fff0ed] px-4 py-3 text-left text-sm text-[#b74a3c]">{error}</p>}{generating && <div className="mx-auto mt-5 flex items-center justify-center gap-2 text-sm text-[#777c86]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3867e8]" />Choosing an example, sketching the board, and preparing your lesson…</div>}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2"><span className="mr-1 text-xs text-[#9699a0]">A few ideas:</span>{SUGGESTIONS.map((suggestion) => <button key={suggestion} onClick={() => { setTopic(suggestion); void generateLesson(undefined, suggestion); }} disabled={generating} className="rounded-full border border-[#e8e8e3] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#747a85] hover:border-[#bac6ef] hover:text-[#3867e8] disabled:opacity-50">{suggestion}</button>)}</div>
      <div className="mt-14 grid gap-3 text-left sm:grid-cols-3">{[{ icon: <PenLine size={17} />, title: "See the idea", detail: "A whiteboard that builds as your tutor explains." }, { icon: <Headphones size={17} />, title: "Learn at your pace", detail: "Pause, replay, or move through the lesson." }, { icon: <CircleHelpIcon />, title: "Stay curious", detail: "Ask questions or check what you learned." }].map((item) => <div key={item.title} className="rounded-[20px] border border-[#e9e8e3] bg-white/65 p-4"><div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0f2fb] text-[#6578c0]">{item.icon}</div><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs leading-5 text-[#898d96]">{item.detail}</p></div>)}</div><p className="mt-8 text-[11px] text-[#a2a4aa]">AI-generated lesson and synthetic voice · For learning and exploration</p>
    </div></section> : <div className="mx-auto max-w-[1600px] px-3 pb-8 pt-4 sm:px-5 lg:px-7">
      <div className="mb-4 flex items-center justify-between gap-3"><div className="min-w-0"><button onClick={() => { stopPlayback(); setLesson(null); }} className="mb-1 inline-flex items-center gap-1 text-xs font-semibold text-[#7b808b] hover:text-[#3867e8]"><ArrowLeft size={14} />All lessons</button><h1 className="truncate text-lg font-semibold tracking-[-0.02em] sm:text-xl">{lesson.title}</h1></div><div className="hidden items-center gap-2 rounded-full border border-[#e8e7e1] bg-white px-3 py-2 text-xs text-[#747984] md:flex"><span className={`h-2 w-2 rounded-full ${voiceMode ? "bg-[#49b987]" : "bg-[#e7b957]"}`} />{voiceMode === "openai" ? "AI voice ready" : voiceMode === "browser" ? "Browser voice" : "Voice not prepared"}<span className="ml-1 text-[#aaa]">· {clock}</span></div><button onClick={() => setShelfOpen(true)} className="flex items-center gap-1.5 rounded-full border border-[#e8e7e1] bg-white px-3 py-2 text-xs font-medium text-[#747984] lg:hidden"><BookOpen size={14} />Saved</button></div>
      <div className="mb-3 grid grid-cols-2 rounded-2xl border border-[#e8e7e1] bg-white p-1 sm:hidden"><button onClick={() => setView("board")} className={`rounded-xl py-2 text-sm font-semibold ${view === "board" ? "bg-[#eef1fb] text-[#3867e8]" : "text-[#858a93]"}`}>Whiteboard</button><button onClick={() => setView("conversation")} className={`rounded-xl py-2 text-sm font-semibold ${view === "conversation" ? "bg-[#eef1fb] text-[#3867e8]" : "text-[#858a93]"}`}>Conversation</button></div>

      <div className="grid min-h-[calc(100vh-138px)] gap-4 lg:grid-cols-[250px_minmax(0,1fr)_320px] xl:grid-cols-[270px_minmax(0,1fr)_350px]">
        <aside className="lesson-rail hidden rounded-[25px] border border-[#e8e7e1] bg-[#fbfbf9] p-4 lg:block"><div className="mb-5 flex items-center justify-between px-1"><div><p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#9296a0]">Today’s lesson</p><p className="mt-1 text-sm font-semibold">{lesson.chapters.length} short chapters</p></div><Clock3 size={16} className="text-[#a1a4ac]" /></div>
          <div className="space-y-1">{lesson.chapters.map((item, index) => <button key={item.id} onClick={() => chooseChapter(index)} className={`flex w-full items-start gap-3 rounded-[17px] p-2.5 text-left ${index === chapterIndex ? "bg-[#eff2fc]" : "hover:bg-[#f3f3f0]"}`}><ChapterDot active={index === chapterIndex} complete={index < chapterIndex} /><span className="min-w-0 flex-1"><span className={`block text-[13px] font-semibold leading-5 ${index === chapterIndex ? "text-[#355dc5]" : "text-[#555b66]"}`}>{item.title}</span><span className="mt-1 line-clamp-2 block text-[11px] leading-4 text-[#9599a1]">{item.takeaway}</span></span></button>)}</div>
          <div className="my-5 h-px bg-[#e9e8e3]" /><div className="rounded-[18px] bg-[#f4f2ec] p-3.5"><div className="flex items-center gap-2 text-[#b18b3b]"><Lightbulb size={15} /><p className="text-[11px] font-bold uppercase tracking-[0.12em]">Learning goal</p></div><p className="mt-2 text-xs leading-5 text-[#717681]">{lesson.objective}</p></div>
          <div className="mt-5"><p className="px-1 text-[11px] font-bold uppercase tracking-[0.15em] text-[#9296a0]">Your board tools</p><div className="mt-2 space-y-1"><button onClick={() => setTool("select")} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium ${tool === "select" ? "bg-[#eff2fc] text-[#3867e8]" : "text-[#737984] hover:bg-[#f3f3f0]"}`}><Search size={15} />Select & ask</button><button onClick={() => setTool("pen")} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium ${tool === "pen" ? "bg-[#eff2fc] text-[#3867e8]" : "text-[#737984] hover:bg-[#f3f3f0]"}`}><PenLine size={15} />Draw on the board</button><button onClick={() => setTool("highlight")} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium ${tool === "highlight" ? "bg-[#eff2fc] text-[#3867e8]" : "text-[#737984] hover:bg-[#f3f3f0]"}`}><Highlighter size={15} />Highlight an idea</button></div></div>
          <div className="mt-5 rounded-[18px] border border-[#eeeae0] bg-white p-3.5"><div className="flex items-center gap-2 text-[#777c87]"><AudioLines size={15} /><p className="text-xs font-semibold">Voice narration</p></div>{voiceMode === "openai" ? <p className="mt-2 text-[11px] leading-4 text-[#8e939c]">AI-generated voice · measured length {displayTotal}</p> : voiceMode === "browser" ? <p className="mt-2 text-[11px] leading-4 text-[#8e939c]">Browser voice · timing is approximate</p> : <button onClick={() => void prepareVoice()} disabled={preparing} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#f0f2fb] px-3 py-2 text-xs font-semibold text-[#4262c2] disabled:opacity-60">{preparing ? <><LoaderCircle size={14} className="animate-spin" />Preparing {prepareProgress}%</> : <><Headphones size={14} />Prepare voice</>}</button>}{voiceError && <div className="mt-2"><p role="alert" className="text-[11px] leading-4 text-[#bd5647]">{voiceError}</p>{voiceMode !== "browser" && <button onClick={useBrowserVoice} className="mt-2 text-[11px] font-semibold text-[#3867e8] underline">Use browser voice instead</button>}</div>}</div><p className="mt-5 px-1 text-[10px] leading-4 text-[#a0a3aa]">Your lesson and board notes are saved in this browser. Voice audio is prepared again when you return.</p>
        </aside>

        <section className={`${view === "conversation" ? "hidden sm:block" : ""} min-w-0`}><div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1"><div className="flex min-w-0 items-center gap-2"><span className="rounded-full bg-[#e9edff] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#4a67c4]">Chapter {chapterIndex + 1} / {lesson.chapters.length}</span><h2 className="truncate text-sm font-semibold">{chapter?.title}</h2></div><div className="flex items-center gap-1"><button onClick={() => chapter && setAnnotations((value) => ({ ...value, [chapter.id]: (value[chapter.id] ?? []).slice(0, -1) }))} disabled={!chapter || !annotations[chapter.id]?.length} title="Undo last mark" className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-[#777c86] hover:bg-white disabled:opacity-35"><RotateCcw size={14} /><span className="hidden sm:inline">Undo</span></button><button onClick={exportBoard} title="Download whiteboard SVG" className="flex h-9 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-[#777c86] hover:bg-white"><Download size={14} /><span className="hidden sm:inline">Export</span></button><span className="hidden h-6 w-px bg-[#e4e3de] sm:block" /><button onClick={() => setTool("select")} aria-label="Select tool" className={`flex h-9 w-9 items-center justify-center rounded-xl ${tool === "select" ? "bg-white text-[#3867e8] shadow-sm" : "text-[#7c8089] hover:bg-white"}`}><Search size={15} /></button><button onClick={() => setTool("pen")} aria-label="Draw tool" className={`flex h-9 w-9 items-center justify-center rounded-xl ${tool === "pen" ? "bg-white text-[#3867e8] shadow-sm" : "text-[#7c8089] hover:bg-white"}`}><PenLine size={15} /></button><button onClick={() => setTool("highlight")} aria-label="Highlight tool" className={`flex h-9 w-9 items-center justify-center rounded-xl ${tool === "highlight" ? "bg-white text-[#3867e8] shadow-sm" : "text-[#7c8089] hover:bg-white"}`}><Highlighter size={15} /></button></div></div>
          {chapter && <Whiteboard key={chapter.id} scene={chapter.board} progress={voiceMode === "browser" && playing ? Math.max(chapterProgress, 0.08) : chapterProgress} tool={tool} annotations={annotations[chapter.id] ?? []} onAddAnnotation={(annotation) => setAnnotations((value) => ({ ...value, [chapter.id]: [...(value[chapter.id] ?? []), annotation] }))} onSelectLabel={(label) => { setSelectedLabel(label); setQuestion((current) => current || `Can you explain “${label.split(" — ")[0]}” in this diagram?`); setView("conversation"); }} />}
          <div className="mt-3 rounded-[22px] border border-[#e8e7e1] bg-white px-4 py-4 sm:px-5"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs text-[#8e939d]"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3f4fa] text-[#6578c0]"><MessageCircle size={14} /></span><span className="font-semibold text-[#515762]">Tutor narration</span><span className="hidden sm:inline">· {chapter?.narration.trim().split(/\s+/).length} words</span></div><button onClick={() => chapter && void askTutor(undefined, `Could you explain this chapter another way? ${chapter.title}`)} disabled={busy} className="text-xs font-semibold text-[#3867e8] hover:underline">Explain another way</button></div><p className="text-[14px] leading-7 text-[#565d69] sm:text-[15px]">{chapter?.narration}</p><div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-[#f6f5f1] px-3.5 py-3"><Lightbulb size={15} className="mt-0.5 shrink-0 text-[#be963d]" /><p className="text-xs leading-5 text-[#707681]"><span className="font-semibold text-[#535a65]">Keep in mind: </span>{chapter?.takeaway}</p></div></div>
          <div className="mt-3 rounded-[22px] border border-[#e8e7e1] bg-white px-4 py-4 sm:px-5"><div className="mb-2 flex items-center justify-between"><p className="text-xs font-semibold text-[#555b66]">Lesson map</p><span className="text-[10px] text-[#999da5]">Choose a chapter to jump</span></div><div className="flex gap-2 overflow-x-auto pb-1">{lesson.chapters.map((item, index) => <button key={item.id} onClick={() => chooseChapter(index)} className={`min-w-[128px] flex-1 rounded-xl border px-3 py-2 text-left ${index === chapterIndex ? "border-[#c6d1f4] bg-[#f2f4fc]" : "border-[#efeee9] bg-white hover:bg-[#f8f8f5]"}`}><span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#9a9da5]">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block truncate text-xs font-semibold text-[#565c67]">{item.title}</span></button>)}</div></div>
          <div className="mt-3 rounded-[22px] border border-[#e8e7e1] bg-white px-4 py-4 sm:px-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8d929c]">Quick check</p><p className="mt-1.5 text-sm font-semibold leading-6">{lesson.quiz.question}</p></div><span className="rounded-full bg-[#f4f2ec] px-2 py-1 text-[10px] font-semibold text-[#9b8145]">Try it</span></div><div className="mt-3 grid gap-2 sm:grid-cols-2">{lesson.quiz.options.map((option, index) => <button key={option} onClick={() => { setQuizAnswer(index); setQuizSubmitted(false); }} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-xs ${quizSubmitted && index === lesson.quiz.answerIndex ? "border-[#a6dcc3] bg-[#eff9f3] text-[#267b5c]" : quizSubmitted && index === quizAnswer ? "border-[#f0c0b7] bg-[#fff3f0] text-[#ae5547]" : quizAnswer === index ? "border-[#b6c4f1] bg-[#f0f3ff] text-[#385cc4]" : "border-[#efeee9] text-[#656b76] hover:bg-[#f8f8f5]"}`}><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f2f2ef] text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>{option}{quizSubmitted && index === lesson.quiz.answerIndex && <Check size={14} className="ml-auto shrink-0" />}</button>)}</div>{quizAnswer !== null && !quizSubmitted && <button onClick={() => setQuizSubmitted(true)} className="mt-3 rounded-xl bg-[#3867e8] px-4 py-2 text-xs font-semibold text-white hover:bg-[#2857d7]">Check answer</button>}{quizSubmitted && <div className={`mt-3 rounded-xl px-3.5 py-3 text-xs leading-5 ${quizAnswer === lesson.quiz.answerIndex ? "bg-[#eff9f3] text-[#397a60]" : "bg-[#fff6e8] text-[#866d37]"}`}><span className="font-semibold">{quizAnswer === lesson.quiz.answerIndex ? "That’s it!" : "Good try. Here’s the idea."}</span> {lesson.quiz.explanation}<button onClick={() => { setQuizAnswer(null); setQuizSubmitted(false); }} className="ml-2 font-semibold underline">Try again</button></div>}</div>
        </section>

        <aside className={`${view === "board" ? "hidden sm:flex" : "flex"} min-h-[calc(100vh-180px)] flex-col overflow-hidden rounded-[25px] border border-[#e8e7e1] bg-[#fbfbf9] lg:min-h-0`}><div className="flex items-center justify-between border-b border-[#eae9e4] px-4 py-3.5"><div className="flex items-center gap-2.5"><div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#e9edff] text-[#3867e8]"><Sparkles size={15} /></div><div><p className="text-sm font-semibold">Ask your tutor</p><p className="text-[10px] text-[#969aa3]">Questions about this lesson</p></div></div><button onClick={() => setMessages((value) => value.slice(0, 1))} title="Clear conversation" className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999da4] hover:bg-[#f0f0ed]"><span className="sr-only">Clear conversation</span>···</button></div>
          <div className="flex-1 space-y-4 overflow-y-auto px-3.5 py-4 sm:px-4" aria-live="polite">{messages.map((message, index) => <div key={`${index}-${message.role}`} className={`flex gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" && <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] bg-[#e9edff] text-[#3867e8]"><Sparkles size={13} /></span>}<div className={`max-w-[88%] whitespace-pre-wrap rounded-[17px] px-3.5 py-3 text-[12px] leading-[1.65] ${message.role === "user" ? "rounded-tr-md bg-[#3867e8] text-white" : "rounded-tl-md bg-white text-[#626874] shadow-[0_2px_9px_rgba(20,30,50,0.04)]"}`}>{message.content}</div></div>)}{busy && <div className="flex items-center gap-2 pl-1 text-xs text-[#818691]"><LoaderCircle size={14} className="animate-spin text-[#3867e8]" />Thinking through that…</div>}{messages.length < 3 && <div className="space-y-2 pt-1"><p className="px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#a0a3aa]">You could ask</p>{["Can you make that simpler?", "Give me a real-life example.", "What should I remember?"].map((item) => <button key={item} onClick={() => void askTutor(undefined, item)} disabled={busy} className="block w-full rounded-xl border border-[#ecebe6] bg-white px-3 py-2.5 text-left text-[11px] text-[#747985] hover:border-[#cbd4ef] hover:text-[#3867e8] disabled:opacity-50">{item}<ArrowRight size={12} className="float-right mt-0.5" /></button>)}</div>}{error && <div role="alert" className="rounded-xl bg-[#fff0ed] px-3 py-2.5 text-xs leading-5 text-[#b74a3c]">{error}<button onClick={() => setError("")} className="ml-1 font-semibold underline">Dismiss</button></div>}{selectedLabel && <p className="text-[10px] text-[#979ba4]">Selected on board: {selectedLabel}</p>}</div>
          <form onSubmit={(event) => void askTutor(event)} className="border-t border-[#eae9e4] bg-white p-3">{selectedLabel && <div className="mb-2 flex items-center justify-between rounded-lg bg-[#f1f3fb] px-2.5 py-1.5 text-[10px] text-[#5368ae]"><span className="truncate">About: {selectedLabel}</span><button type="button" onClick={() => setSelectedLabel("")} aria-label="Remove selected label"><X size={13} /></button></div>}<div className="flex items-end gap-2 rounded-[17px] border border-[#e9e8e3] bg-[#fafaf8] p-1.5 focus-within:border-[#becaf0]"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void askTutor(); } }} rows={2} maxLength={600} placeholder="Ask a follow-up…" aria-label="Ask a question about this lesson" className="max-h-28 min-h-[42px] flex-1 resize-none bg-transparent px-2.5 py-2 text-xs leading-5 outline-none placeholder:text-[#a0a3aa]" /><button disabled={!question.trim() || busy} aria-label="Send question" className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#3867e8] text-white hover:bg-[#2857d7] disabled:bg-[#d7dce9]"><Send size={15} /></button></div><div className="mt-2 flex items-center justify-between px-1"><span className="text-[9px] text-[#a4a6ad]">AI can make mistakes; check important ideas.</span><span className="text-[9px] text-[#b0b2b8]">Enter to send</span></div></form>
        </aside>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e4e4df] bg-[#fbfbf9]/95 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl sm:static sm:mt-4 sm:rounded-[22px] sm:border sm:px-5 sm:py-3"><div className="flex items-center gap-3 sm:gap-4"><button onClick={restartLesson} aria-label="Restart lesson" title="Restart lesson" className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#717681] hover:bg-[#f0f0ed] sm:flex"><RotateCcw size={17} /></button><button onClick={togglePlayback} disabled={generating || preparing} aria-label={playing ? "Pause lesson" : "Play lesson"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#3867e8] text-white shadow-[0_5px_14px_rgba(56,103,232,0.2)] hover:bg-[#2857d7] disabled:bg-[#afbce0]">{playing ? <Pause size={19} fill="currentColor" /> : <Play size={19} fill="currentColor" className="ml-0.5" />}</button><span className="w-[36px] shrink-0 text-[11px] tabular-nums text-[#777d88] sm:w-[42px]">{displayElapsed}</span><div className="min-w-0 flex-1"><input aria-label="Seek lesson" type="range" min="0" max={Math.max(1, totalDuration)} step="0.1" value={Math.min(playhead, totalDuration)} onChange={(event) => seek(Number(event.target.value))} className="lesson-range h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#e9e9e5]" style={{ background: `linear-gradient(to right, #3867e8 ${totalDuration ? (playhead / totalDuration) * 100 : 0}%, #e9e9e5 0%)` }} /><div className="mt-1.5 hidden items-center justify-between text-[9px] text-[#a0a3aa] sm:flex">{lesson.chapters.map((item, index) => <button key={item.id} onClick={() => chooseChapter(index)} className={index === chapterIndex ? "font-semibold text-[#5368b9]" : ""}>{item.title}</button>)}</div></div><span className="w-[36px] shrink-0 text-right text-[11px] tabular-nums text-[#9a9da5] sm:w-[42px]">{displayTotal}</span><button onClick={() => { setMuted((value) => !value); if (voiceMode === "browser" && "speechSynthesis" in window && playing) { window.speechSynthesis.cancel(); setPlaying(false); window.setTimeout(() => setPlaying(true), 40); } }} aria-label={muted ? "Unmute narration" : "Mute narration"} className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#717681] hover:bg-[#f0f0ed] sm:flex">{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}</button><label className="hidden items-center gap-1 rounded-lg px-1.5 text-[10px] text-[#848994] sm:flex"><span className="sr-only">Playback speed</span><select value={rate} onChange={(event) => setRate(Number(event.target.value))} aria-label="Playback speed" className="bg-transparent text-xs outline-none"><option value={0.8}>0.8×</option><option value={1}>1×</option><option value={1.2}>1.2×</option><option value={1.5}>1.5×</option></select></label><span className="hidden text-[10px] text-[#aaadb3] md:block">{voiceMode === "openai" ? "AI-generated voice" : voiceMode === "browser" ? "Browser speech" : "Prepare voice to begin"}</span></div><audio ref={audioRef} src={voiceMode === "openai" ? tracks[chapterIndex] : undefined} onLoadedMetadata={(event) => { event.currentTarget.currentTime = localPlayhead; }} onTimeUpdate={(event) => setPlayhead((starts[chapterIndex] ?? 0) + event.currentTarget.currentTime)} onEnded={onAudioEnded} preload="auto" className="hidden" /></div>
      <div className="h-[78px] sm:hidden" />
    </div>}
  </main>;
}

function CircleHelpIcon() { return <MessageCircle size={17} />; }

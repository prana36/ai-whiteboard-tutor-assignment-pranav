import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="flex min-h-screen items-center justify-center bg-[#f5f5f2] px-5 text-[#252a35]"><div className="max-w-md rounded-[28px] border border-[#e8e7e1] bg-white p-9 text-center shadow-[0_20px_70px_rgba(39,46,62,0.08)]"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9edff] text-[#3867e8]"><SearchX size={24} /></div><h1 className="mt-5 text-2xl font-semibold">This page wandered off</h1><p className="mt-2 text-sm leading-6 text-[#777c86]">Let’s head back to the whiteboard and keep learning.</p><Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#3867e8] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2857d7]"><ArrowLeft size={15} />Back to Scribblewise</Link></div></main>;
}

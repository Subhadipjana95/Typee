"use client"

import { BorderBeam } from "border-beam"
import { ThinkingOrb } from "thinking-orbs"
import { ArrowRight, Check, Clock3, RotateCcw, Sparkles } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

const TEST_TEXT =
  "The best ideas arrive when curiosity meets consistency. Keep your hands relaxed, find your rhythm, and let every accurate keystroke build momentum."

const DURATIONS = [15, 30, 60]

export default function Page() {
  const [duration, setDuration] = useState(30)
  const [timeLeft, setTimeLeft] = useState(30)
  const [value, setValue] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = useCallback((nextDuration = duration) => {
    setDuration(nextDuration)
    setTimeLeft(nextDuration)
    setValue("")
    setIsRunning(false)
    setIsFinished(false)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }, [duration])

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return

    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        if (current <= 1) {
          setIsRunning(false)
          setIsFinished(true)
          return 0
        }
        return current - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning, timeLeft])

  const stats = useMemo(() => {
    const typedWords = value.trim() ? value.trim().split(/\s+/).length : 0
    const elapsed = Math.max(duration - timeLeft, 1)
    const wpm = Math.round((typedWords / elapsed) * 60)
    const correctCharacters = value
      .split("")
      .filter((character, index) => character === TEST_TEXT[index]).length
    const accuracy = value.length
      ? Math.round((correctCharacters / value.length) * 100)
      : 100

    return { wpm, accuracy }
  }, [duration, timeLeft, value])

  const handleChange = (nextValue: string) => {
    if (isFinished || nextValue.length > TEST_TEXT.length) return
    if (!isRunning && nextValue.length > 0) setIsRunning(true)
    setValue(nextValue)
    if (nextValue === TEST_TEXT) {
      setIsRunning(false)
      setIsFinished(true)
    }
  }

  const progress = Math.min((value.length / TEST_TEXT.length) * 100, 100)

  return (
    <main className="min-h-svh overflow-hidden bg-[#10151b] text-[#f4f3ef]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(228,113,67,0.12),transparent_30%),radial-gradient(circle_at_85%_80%,rgba(74,108,119,0.18),transparent_36%)]" />
      <div className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col px-6 py-6 sm:px-10 lg:px-14">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-lg bg-[#e87545] text-[#10151b]">
              <Sparkles className="size-4" />
            </span>
            typee
          </a>
          <nav className="hidden items-center gap-7 text-sm text-white/55 sm:flex">
            <a className="text-white" href="#test">Practice</a>
            <a className="transition-colors hover:text-white" href="#stats">Your stats</a>
            <a className="transition-colors hover:text-white" href="#about">About</a>
          </nav>
          <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/55">
            Daily challenge <span className="ml-1 text-[#e87545]">#042</span>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 lg:py-24" id="test">
          <div className="mb-12 max-w-2xl">
            <p className="mb-5 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.22em] text-[#e87545]">
              <span className="h-px w-8 bg-[#e87545]" />
              Build your flow
            </p>
            <h1 className="max-w-xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-white sm:text-7xl">
              Type sharp.
              <br />
              <span className="text-white/35">Think fast.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-white/50">
              A calm space to train your accuracy, build speed, and make every keystroke count.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:items-start">
            <div>
              <div className="mb-4 flex items-center justify-between text-xs text-white/45">
                <div className="flex items-center gap-2">
                  <Clock3 className="size-3.5" />
                  <span>{isFinished ? "Test complete" : isRunning ? "Typing in progress" : "Ready when you are"}</span>
                  {isRunning && <ThinkingOrb state="working" size={20} aria-hidden="true" />}
                </div>
                <span className="font-mono text-white/75">{String(timeLeft).padStart(2, "0")}s</span>
              </div>

              <BorderBeam active={isRunning} size="line" colorVariant="sunset" theme="dark" strength={0.85}>
                <div className="rounded-2xl border border-white/10 bg-[#171e25]/90 p-6 shadow-2xl shadow-black/20 sm:p-8">
                  <div className="mb-8 h-1 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-[#e87545] transition-[width] duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="min-h-28 text-xl leading-9 tracking-[-0.01em] text-white/35 sm:text-2xl sm:leading-10">
                    {TEST_TEXT.split("").map((character, index) => {
                      const typed = value[index]
                      const className = typed === undefined
                        ? ""
                        : typed === character
                          ? "text-white"
                          : "rounded-sm bg-red-400/20 text-red-300"
                      return <span className={className} key={`${character}-${index}`}>{character}</span>
                    })}
                  </p>
                  <input
                    ref={inputRef}
                    aria-label="Type the passage shown above"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    className="mt-8 w-full border-b border-white/15 bg-transparent pb-3 text-lg text-white outline-none placeholder:text-white/25 focus:border-[#e87545]"
                    disabled={isFinished}
                    onChange={(event) => handleChange(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") reset()
                    }}
                    placeholder="Start typing here..."
                    spellCheck={false}
                    value={value}
                  />
                  <div className="mt-5 flex items-center justify-between text-xs text-white/35">
                    <span>Press <kbd className="rounded border border-white/15 px-1.5 py-0.5 font-mono text-white/60">esc</kbd> to restart</span>
                    <span>{value.length} / {TEST_TEXT.length}</span>
                  </div>
                </div>
              </BorderBeam>
            </div>

            <aside className="grid grid-cols-2 gap-3 lg:grid-cols-1" id="stats">
              <div className="rounded-2xl border border-white/10 bg-white/4 p-5">
                <p className="text-xs text-white/40">Your speed</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">{stats.wpm}<span className="ml-1 text-sm font-normal text-white/35">wpm</span></p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/4 p-5">
                <p className="text-xs text-white/40">Accuracy</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">{stats.accuracy}<span className="ml-1 text-sm font-normal text-white/35">%</span></p>
              </div>
              <div className="col-span-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/4 p-5 lg:col-span-1">
                <div>
                  <p className="text-xs text-white/40">Test length</p>
                  <div className="mt-3 flex gap-1.5">
                    {DURATIONS.map((option) => (
                      <button
                        className={`rounded-md px-2.5 py-1 text-xs transition-colors ${duration === option ? "bg-[#e87545] text-[#10151b]" : "bg-white/8 text-white/55 hover:bg-white/15"}`}
                        key={option}
                        onClick={() => reset(option)}
                        type="button"
                      >
                        {option}s
                      </button>
                    ))}
                  </div>
                </div>
                <button aria-label="Restart test" className="grid size-9 place-items-center rounded-full border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white" onClick={() => reset()} type="button">
                  <RotateCcw className="size-4" />
                </button>
              </div>
            </aside>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/40">
            <span className="flex items-center gap-2"><Check className="size-3.5 text-[#e87545]" /> No account needed</span>
            <span className="flex items-center gap-2"><Check className="size-3.5 text-[#e87545]" /> No distractions</span>
            <a className="ml-auto flex items-center gap-1 text-white/65 transition-colors hover:text-white" href="#about">How it works <ArrowRight className="size-3.5" /></a>
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-white/10 pt-5 text-xs text-white/35" id="about">
          <span>Made for people who care about the details.</span>
          <span className="font-mono">© 2025 typee</span>
        </footer>
      </div>
    </main>
  )
}

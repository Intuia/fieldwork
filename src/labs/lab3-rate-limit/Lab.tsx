import { useState, useCallback } from 'react'
import { RateLimitServer, type RateLimitStrategy, type AttemptResult } from './server'
import { Zap, RotateCcw, RefreshCw, Globe, Info } from 'lucide-react'

interface LogEntry {
  id: number;
  attemptNumber: number;
  result: AttemptResult;
  sessionId: string;
  ip: string;
}

const strategyDescriptions: Record<RateLimitStrategy, string> = {
  'client-side': 'Counter stored on the client (cookie/JS). Attacker resets by clearing cookies.',
  'session-based': 'Counter per server session. Attacker resets by starting a new session.',
  'per-account': 'Counter per username. Locks account after 5 failures — also locks out the real user.',
  'layered': 'Combines account delay + IP challenge + global detection. Never fully locks an account.',
}

export function RateLimitLab() {
  const [strategy, setStrategy] = useState<RateLimitStrategy>('client-side')
  const [server, setServer] = useState(() => new RateLimitServer('client-side'))
  const [log, setLog] = useState<LogEntry[]>([])
  const [sessionId, setSessionId] = useState('session-001')
  const [ip, setIp] = useState('192.168.1.1')
  const [attemptCount, setAttemptCount] = useState(0)

  const handleStrategyChange = useCallback((newStrategy: RateLimitStrategy) => {
    setStrategy(newStrategy)
    setServer(new RateLimitServer(newStrategy))
    setLog([])
    setAttemptCount(0)
    setSessionId('session-001')
    setIp('192.168.1.1')
  }, [])

  const fireAttempt = useCallback(() => {
    const newCount = attemptCount + 1
    setAttemptCount(newCount)

    const result = server.attempt('admin', sessionId, ip)

    const entry: LogEntry = {
      id: newCount,
      attemptNumber: newCount,
      result,
      sessionId,
      ip,
    }
    setLog(prev => [entry, ...prev])
  }, [server, sessionId, ip, attemptCount])

  const changeSession = useCallback(() => {
    const newSessionNum = parseInt(sessionId.split('-')[1] || '1') + 1
    const newId = `session-${String(newSessionNum).padStart(3, '0')}`
    setSessionId(newId)
    // For client-side strategy, also reset the client counter
    if (strategy === 'client-side') {
      server.resetClientCounter()
    }
  }, [sessionId, strategy, server])

  const changeIp = useCallback(() => {
    const parts = ip.split('.')
    const lastOctet = parseInt(parts[3] || '1') + 1
    setIp(`192.168.1.${lastOctet}`)
  }, [ip])

  const handleReset = useCallback(() => {
    server.reset()
    setLog([])
    setAttemptCount(0)
    setSessionId('session-001')
    setIp('192.168.1.1')
  }, [server])

  function getResultColor(result: AttemptResult): string {
    if (!result.allowed) {
      return 'text-red-400'
    } else if (result.delay && result.delay > 0) {
      return 'text-amber-400'
    } else {
      return 'text-green-400'
    }
  }

  function getResultBg(result: AttemptResult): string {
    if (!result.allowed) {
      return 'bg-red-500/10 border-red-500/20'
    } else if (result.delay && result.delay > 0) {
      return 'bg-amber-500/10 border-amber-500/20'
    } else {
      return 'bg-green-500/10 border-green-500/20'
    }
  }

  function getResultLabel(result: AttemptResult): string {
    if (!result.allowed) {
      return 'BLOCKED'
    } else if (result.delay && result.delay > 0) {
      return 'DELAYED'
    } else {
      return 'ALLOWED'
    }
  }

  // Calculate progress bar for the attempt counter
  const maxDisplay = 5
  const progressPercent = Math.min(100, (attemptCount / maxDisplay) * 100)

  return (
    <div className="space-y-6">
      {/* Strategy selector */}
      <div>
        <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
          Rate-limit strategy
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(['client-side', 'session-based', 'per-account', 'layered'] as RateLimitStrategy[]).map(s => (
            <button
              key={s}
              onClick={() => handleStrategyChange(s)}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                strategy === s
                  ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                  : 'border-[var(--border-subtle)] bg-navy-800 text-slate-400 hover:bg-navy-700/50'
              }`}
            >
              <div className="font-heading font-bold text-xs uppercase">{s}</div>
              <div className="text-[11px] mt-1 leading-snug opacity-80">
                {strategyDescriptions[s]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Current state display */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
          <div className="font-mono text-[10px] text-slate-500 uppercase">Session</div>
          <div className="font-mono text-sm text-cyan-400 mt-1">{sessionId}</div>
        </div>
        <div className="p-3 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
          <div className="font-mono text-[10px] text-slate-500 uppercase">IP Address</div>
          <div className="font-mono text-sm text-cyan-400 mt-1">{ip}</div>
        </div>
        <div className="p-3 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
          <div className="font-mono text-[10px] text-slate-500 uppercase">Attempts</div>
          <div className="font-mono text-sm text-cyan-400 mt-1">{attemptCount}</div>
          <div className="mt-1.5 w-full h-1.5 bg-navy-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                progressPercent >= 100 ? 'bg-red-500' : progressPercent >= 60 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={fireAttempt}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-navy-900 font-heading font-bold text-sm rounded-lg hover:bg-teal-400 transition-colors"
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          Fire Attempt
        </button>
        <button
          onClick={changeSession}
          className="flex items-center gap-2 px-4 py-2 border border-cyan-500/30 text-cyan-400 text-sm rounded-lg hover:bg-cyan-500/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          Change Session
        </button>
        <button
          onClick={changeIp}
          className="flex items-center gap-2 px-4 py-2 border border-purple-500/30 text-purple-400 text-sm rounded-lg hover:bg-purple-500/10 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" aria-hidden="true" />
          Change IP
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-slate-500/30 text-slate-400 text-sm rounded-lg hover:bg-slate-500/10 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          Reset
        </button>
      </div>

      {/* Attempt log */}
      <div>
        <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
          Attempt log ({log.length} entries)
        </h4>
        <div className="max-h-64 overflow-y-auto space-y-1.5 rounded-lg">
          {log.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
              No attempts yet. Select a strategy and fire attempts.
            </div>
          )}
          {log.map(entry => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg border text-sm ${getResultBg(entry.result)}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-xs text-slate-500">
                  #{entry.attemptNumber}
                </span>
                <span className={`font-mono text-xs font-bold ${getResultColor(entry.result)}`}>
                  {getResultLabel(entry.result)}
                </span>
              </div>
              <div className="text-xs text-slate-300">{entry.result.reason}</div>
              {entry.result.delay ? (
                <div className="text-xs text-amber-400 mt-1">
                  +{entry.result.delay}s delay imposed
                </div>
              ) : null}
              <div className="flex gap-3 mt-1 text-[10px] text-slate-500 font-mono">
                <span>session: {entry.sessionId}</span>
                <span>ip: {entry.ip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What this teaches */}
      <div className="p-4 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-4 h-4 text-teal-400" aria-hidden="true" />
          <h4 className="font-heading font-bold text-sm text-teal-400">What this teaches</h4>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed">
          <li>A lockout counter helps only when enforced in the right place.</li>
          <li>Client-side counters can be edited; session counters reset with a new session.</li>
          <li>Account lockout can be abused to deny service to legitimate users.</li>
          <li>Layered throttling with delays and challenges avoids permanent lockout while still slowing attackers.</li>
        </ul>
        <div className="mt-2 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slides 14, 40</span>
        </div>
      </div>
    </div>
  )
}

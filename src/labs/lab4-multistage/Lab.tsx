import { useState, useCallback, useRef } from 'react'
import { MultistageServer, type StateStorageMode, type StageResult, type ClientState } from './server'
import { Shield, Zap, RotateCcw, SkipForward, Repeat, Shuffle, Users, Info, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface LogEntry {
  id: number;
  stageAttempted: number;
  data: Record<string, string>;
  result: StageResult;
  attack?: string;
  mode: StateStorageMode;
}

const stageLabels: Record<number, string> = {
  1: 'Identifier',
  2: 'Password',
  3: 'Challenge',
}

const modeDescriptions: Record<StateStorageMode, string> = {
  'client-side': 'State stored in a hidden form field the client sends back. The server trusts whatever the client claims.',
  'server-side': 'State tracked in a server session with three invariants: SEQUENCE_MONOTONIC, ACCOUNT_BINDING, REPLAY_PREVENTION.',
}

export function MultistageLab() {
  const [mode, setMode] = useState<StateStorageMode>('client-side')
  const [server, setServer] = useState(() => new MultistageServer('client-side'))
  const [currentStage, setCurrentStage] = useState(1)
  const [clientState, setClientState] = useState<ClientState>({ completedStages: [], username: '' })
  const [log, setLog] = useState<LogEntry[]>([])
  const entryCountRef = useRef(0)
  const [authenticated, setAuthenticated] = useState(false)

  // Input fields
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('s3cure!')
  const [answer, setAnswer] = useState('42')

  const handleModeChange = useCallback((newMode: StateStorageMode) => {
    setMode(newMode)
    setServer(new MultistageServer(newMode))
    setCurrentStage(1)
    setClientState({ completedStages: [], username: '' })
    setLog([])
    entryCountRef.current = 0
    setAuthenticated(false)
  }, [])

  const addLogEntry = useCallback((stageAttempted: number, data: Record<string, string>, result: StageResult, attack?: string) => {
    entryCountRef.current += 1
    const entry: LogEntry = {
      id: entryCountRef.current,
      stageAttempted,
      data,
      result,
      attack,
      mode,
    }
    setLog(prevLog => [entry, ...prevLog])
  }, [mode])

  const submitCurrentStage = useCallback(() => {
    const data: { username?: string; password?: string; answer?: string } = {}
    const displayData: Record<string, string> = {}

    if (currentStage === 1) {
      data.username = username
      displayData.username = username
    } else if (currentStage === 2) {
      data.password = password
      displayData.password = '•'.repeat(password.length)
    } else if (currentStage === 3) {
      data.answer = answer
      displayData.answer = answer
    }

    const result = server.submitStage(currentStage, data, clientState)
    addLogEntry(currentStage, displayData, result)

    if (result.success) {
      if (result.authenticated) {
        setAuthenticated(true)
      } else if (result.nextStage) {
        // Update client-side state tracking
        setClientState(prev => ({
          completedStages: [...prev.completedStages, currentStage],
          username: currentStage === 1 ? (data.username || prev.username) : prev.username,
        }))
        setCurrentStage(result.nextStage)
      }
    } else if (result.nextStage && result.nextStage < currentStage) {
      // Server reset us back to an earlier stage
      setCurrentStage(result.nextStage)
      setClientState({ completedStages: [], username: '' })
    }
  }, [currentStage, username, password, answer, server, clientState, addLogEntry])

  // Attack: skip directly to stage 3
  const attackSkipStage = useCallback(() => {
    const data = { answer }
    const result = server.submitStage(3, data, { completedStages: [1, 2], username: 'admin' })
    addLogEntry(3, { answer, attack: 'SKIP to stage 3' }, result, 'Skip Stage')

    if (result.authenticated) {
      setAuthenticated(true)
    }
  }, [answer, server, addLogEntry])

  // Attack: repeat stage 1 after completing it
  const attackRepeatStage = useCallback(() => {
    const data = { username: 'victim' }
    const result = server.submitStage(1, data, clientState)
    addLogEntry(1, { username: 'victim', attack: 'REPEAT stage 1' }, result, 'Repeat Stage')
  }, [server, clientState, addLogEntry])

  // Attack: reorder — submit stage 2 before stage 1
  const attackReorder = useCallback(() => {
    const data = { password }
    const result = server.submitStage(2, data, { completedStages: [], username: '' })
    addLogEntry(2, { password: '•'.repeat(password.length), attack: 'REORDER: stage 2 before 1' }, result, 'Reorder')

    if (result.success && result.nextStage) {
      setCurrentStage(result.nextStage)
    }
  }, [password, server, addLogEntry])

  // Attack: cross-account — start as "admin", switch to "victim" at stage 2
  const attackCrossAccount = useCallback(() => {
    const data = { username: 'victim', password }
    const result = server.submitStage(2, data, { completedStages: [1], username: 'victim' })
    addLogEntry(2, { username: 'victim', password: '•'.repeat(password.length), attack: 'CROSS-ACCOUNT switch' }, result, 'Cross-Account')
  }, [password, server, addLogEntry])

  const handleReset = useCallback(() => {
    server.reset()
    setCurrentStage(1)
    setClientState({ completedStages: [], username: '' })
    setLog([])
    entryCountRef.current = 0
    setAuthenticated(false)
  }, [server])

  function getResultColor(result: StageResult): string {
    if (result.authenticated) {
      return 'text-green-400'
    }
    if (result.invariantViolation) {
      return 'text-purple-400'
    }
    if (!result.success) {
      return 'text-red-400'
    }
    return 'text-teal-400'
  }

  function getResultBg(result: StageResult): string {
    if (result.authenticated) {
      return 'bg-green-500/10 border-green-500/20'
    }
    if (result.invariantViolation) {
      return 'bg-purple-500/10 border-purple-500/20'
    }
    if (!result.success) {
      return 'bg-red-500/10 border-red-500/20'
    }
    return 'bg-teal-500/10 border-teal-500/20'
  }

  function getResultLabel(result: StageResult): string {
    if (result.authenticated) {
      return 'AUTHENTICATED'
    }
    if (result.invariantViolation) {
      return `BLOCKED: ${result.invariantViolation}`
    }
    if (!result.success) {
      return 'FAILED'
    }
    return 'STAGE PASSED'
  }

  const serverState = server.getServerState()

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div>
        <label className="block font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
          State storage mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(['client-side', 'server-side'] as StateStorageMode[]).map(m => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`p-3 rounded-lg border text-left text-sm transition-all ${
                mode === m
                  ? 'border-teal-500/50 bg-teal-500/10 text-teal-300'
                  : 'border-[var(--border-subtle)] bg-navy-800 text-slate-400 hover:bg-navy-700/50'
              }`}
            >
              <div className="font-heading font-bold text-xs uppercase">{m}</div>
              <div className="text-[11px] mt-1 leading-snug opacity-80">
                {modeDescriptions[m]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual state machine */}
      <div className="p-4 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
        <div className="font-mono text-[10px] text-slate-500 uppercase mb-3">Login State Machine</div>
        <div className="flex items-center justify-between gap-2">
          {[1, 2, 3].map(stage => {
            const isCompleted = mode === 'server-side'
              ? serverState.completedStages.includes(stage)
              : clientState.completedStages.includes(stage)
            const isCurrent = currentStage === stage && !authenticated

            return (
              <div key={stage} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex flex-col items-center justify-center w-full p-3 rounded-lg border-2 transition-all ${
                    authenticated
                      ? 'border-green-500/40 bg-green-500/10'
                      : isCompleted
                        ? 'border-teal-500/40 bg-teal-500/10'
                        : isCurrent
                          ? 'border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
                          : 'border-[var(--border-subtle)] bg-navy-900/50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    {isCompleted || authenticated ? (
                      <CheckCircle className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
                    ) : isCurrent ? (
                      <Zap className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                    )}
                    <span className={`font-mono text-xs font-bold ${
                      authenticated ? 'text-green-400'
                        : isCompleted ? 'text-teal-400'
                          : isCurrent ? 'text-cyan-400'
                            : 'text-slate-500'
                    }`}>
                      Stage {stage}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">{stageLabels[stage]}</span>
                </div>
                {stage < 3 && (
                  <div className={`text-xs ${isCompleted ? 'text-teal-500' : 'text-slate-600'}`}>
                    →
                  </div>
                )}
              </div>
            )
          })}
          {/* Final state */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-600">→</div>
            <div className={`flex flex-col items-center p-3 rounded-lg border-2 ${
              authenticated
                ? 'border-green-500/50 bg-green-500/15 shadow-[0_0_16px_rgba(34,197,94,0.2)]'
                : 'border-[var(--border-subtle)] bg-navy-900/50'
            }`}>
              {authenticated ? (
                <Shield className="w-5 h-5 text-green-400" aria-hidden="true" />
              ) : (
                <Shield className="w-5 h-5 text-slate-600" aria-hidden="true" />
              )}
              <span className={`text-[10px] font-mono mt-1 ${authenticated ? 'text-green-400' : 'text-slate-500'}`}>
                {authenticated ? 'IN' : 'Locked'}
              </span>
            </div>
          </div>
        </div>

        {/* Server state info (for server-side mode) */}
        {mode === 'server-side' && (
          <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-[10px] font-mono">
            <div>
              <span className="text-slate-500">Completed: </span>
              <span className="text-cyan-400">[{serverState.completedStages.join(', ')}]</span>
            </div>
            <div>
              <span className="text-slate-500">Bound: </span>
              <span className="text-cyan-400">{serverState.boundUsername || 'none'}</span>
            </div>
            <div>
              <span className="text-slate-500">Auth: </span>
              <span className={serverState.authenticated ? 'text-green-400' : 'text-slate-500'}>
                {String(serverState.authenticated)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Current stage input */}
      {!authenticated && (
        <div className="p-4 bg-navy-800 rounded-lg border border-cyan-500/20">
          <div className="font-mono text-xs text-cyan-400 mb-3">
            Stage {currentStage}: {stageLabels[currentStage]}
          </div>
          <div className="flex flex-wrap gap-3 items-end">
            {currentStage === 1 && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-[var(--border-subtle)] rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-teal-500/50"
                />
              </div>
            )}
            {currentStage === 2 && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-[var(--border-subtle)] rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-teal-500/50"
                />
              </div>
            )}
            {currentStage === 3 && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Challenge: What is 6 x 7?</label>
                <input
                  type="text"
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-900 border border-[var(--border-subtle)] rounded-lg text-sm text-slate-200 font-mono focus:outline-none focus:border-teal-500/50"
                />
              </div>
            )}
            <button
              onClick={submitCurrentStage}
              className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-navy-900 font-heading font-bold text-sm rounded-lg hover:bg-teal-400 transition-colors"
            >
              <Zap className="w-4 h-4" aria-hidden="true" />
              Submit Stage {currentStage}
            </button>
          </div>
        </div>
      )}

      {authenticated && (
        <div className="p-4 bg-green-500/10 border-2 border-green-500/40 rounded-xl text-center">
          <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" aria-hidden="true" />
          <div className="font-heading font-bold text-green-400">Authenticated!</div>
          <p className="text-xs text-green-300/70 mt-1">All stages passed. Reset to try again.</p>
        </div>
      )}

      {/* Attack buttons */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          <label className="font-mono text-xs text-amber-400 uppercase tracking-wider">
            Attack vectors (defensive demonstration)
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={attackSkipStage}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" aria-hidden="true" />
            Skip to Stage 3
          </button>
          <button
            onClick={attackRepeatStage}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Repeat className="w-3.5 h-3.5" aria-hidden="true" />
            Repeat Stage 1
          </button>
          <button
            onClick={attackReorder}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
            Reorder (Stage 2 First)
          </button>
          <button
            onClick={attackCrossAccount}
            className="flex items-center gap-2 px-3 py-1.5 border border-red-500/30 text-red-400 text-xs rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            Cross-Account Switch
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-500/30 text-slate-400 text-xs rounded-lg hover:bg-slate-500/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Reset
          </button>
        </div>
      </div>

      {/* Attempt log */}
      <div>
        <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
          Attempt log ({log.length} entries)
        </h4>
        <div className="max-h-72 overflow-y-auto space-y-1.5 rounded-lg">
          {log.length === 0 && (
            <div className="p-4 text-center text-sm text-slate-500 bg-navy-800 rounded-lg border border-[var(--border-subtle)]">
              No attempts yet. Use the normal flow or attack buttons.
            </div>
          )}
          {log.map(entry => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg border text-sm ${getResultBg(entry.result)}`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">#{entry.id}</span>
                  <span className="font-mono text-[10px] text-slate-500">
                    Stage {entry.stageAttempted} ({stageLabels[entry.stageAttempted]})
                  </span>
                  {entry.attack && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-mono rounded">
                      {entry.attack}
                    </span>
                  )}
                </div>
                <span className={`font-mono text-[10px] font-bold ${getResultColor(entry.result)}`}>
                  {getResultLabel(entry.result)}
                </span>
              </div>
              {entry.result.error && (
                <div className="flex items-start gap-1.5 mt-1">
                  <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-red-300">{entry.result.error}</span>
                </div>
              )}
              {entry.result.success && !entry.result.authenticated && entry.result.nextStage && (
                <div className="text-xs text-teal-300 mt-1">
                  → Proceed to stage {entry.result.nextStage}
                </div>
              )}
              {entry.result.invariantViolation && (
                <div className="flex items-start gap-1.5 mt-1">
                  <Shield className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-xs text-purple-300">
                    Invariant violated: {entry.result.invariantViolation}
                  </span>
                </div>
              )}
              <div className="flex gap-3 mt-1 text-[10px] text-slate-500 font-mono">
                <span>mode: {entry.mode}</span>
                {Object.entries(entry.data).filter(([k]) => k !== 'attack').map(([k, v]) => (
                  <span key={k}>{k}: {v}</span>
                ))}
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
          <li>Multi-stage login must enforce stage ordering on the server, not the client.</li>
          <li>Client-side state (hidden fields, cookies) can be edited to skip or reorder stages.</li>
          <li>Server-side invariants — SEQUENCE_MONOTONIC, ACCOUNT_BINDING, REPLAY_PREVENTION — close these gaps.</li>
          <li>A cross-account attack switches the target user mid-flow if the server doesn't bind the account at stage 1.</li>
        </ul>
        <div className="mt-2 text-right">
          <span className="font-mono text-[10px] text-slate-500">Slides 29, 30, 47</span>
        </div>
      </div>
    </div>
  )
}

"use client"

interface CommandHistoryItem {
  id: string
  command: string
  status: string
  output?: string
  timestamp: string
}

interface CommandHistoryProps {
  commands: CommandHistoryItem[]
  loading: boolean
}

export default function CommandHistory({ commands, loading }: CommandHistoryProps) {
  if (loading) {
    return (
      <div className="border border-terminal-dim rounded p-4 bg-black/30">
        <p className="text-terminal-dim">{"> LOADING HISTORY..."}</p>
      </div>
    )
  }

  return (
    <div className="border border-terminal-dim rounded p-4 bg-black/30">
      <h2 className="text-terminal-accent font-bold mb-4">{"> COMMAND HISTORY"}</h2>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {commands.length === 0 ? (
          <p className="text-terminal-dim text-sm">{"$ no commands yet"}</p>
        ) : (
          commands.map((cmd) => (
            <div key={cmd.id} className="p-3 border border-terminal-dim rounded bg-black/50">
              <div className="flex items-start justify-between gap-2 mb-2">
                <code className="text-terminal-text font-bold text-sm">{cmd.command}</code>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    cmd.status === "EXECUTED"
                      ? "bg-terminal-success/20 text-terminal-success"
                      : "bg-terminal-error/20 text-terminal-error"
                  }`}
                >
                  {cmd.status}
                </span>
              </div>
              <p className="text-terminal-dim text-xs">{cmd.timestamp}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

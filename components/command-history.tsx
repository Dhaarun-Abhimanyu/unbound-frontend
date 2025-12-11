"use client"

interface CommandHistoryItem {
  id?: string
  _id?: string
  command?: string
  command_text?: string // Added based on your schema
  cmd?: string
  text?: string
  input?: string
  query?: string
  status: string
  output?: string
  timestamp?: string
  executed_at?: string // Added based on your schema
  [key: string]: any
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
          commands.map((cmd, index) => {
            // Handle potential API inconsistencies for the command text
            // Added cmd.command_text as the first priority based on your schema
            const commandText = cmd.command_text || cmd.command || cmd.cmd || cmd.text || cmd.input || cmd.query || "Unknown Command"
            
            // Handle timestamp from schema (executed_at) or fallback
            const timeDisplay = cmd.executed_at || cmd.timestamp || new Date().toISOString()

            return (
              <div key={cmd.id || cmd._id || index} className="p-3 border border-terminal-dim rounded bg-black/50">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <code className="text-terminal-text font-bold text-sm flex-1 break-all mr-2">
                    {typeof commandText === 'object' ? JSON.stringify(commandText) : commandText}
                  </code>
                  <span
                    className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                      cmd.status === "EXECUTED"
                        ? "bg-terminal-success/20 text-terminal-success"
                        : "bg-terminal-error/20 text-terminal-error"
                    }`}
                  >
                    {cmd.status}
                  </span>
                </div>
                <p className="text-terminal-dim text-xs">{new Date(timeDisplay).toLocaleString()}</p>
                {cmd.output && (
                  <div className="mt-2 p-2 bg-black/30 rounded border border-terminal-dim/50">
                    <pre className="text-xs text-terminal-dim whitespace-pre-wrap break-all font-mono">
                      {cmd.output}
                    </pre>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

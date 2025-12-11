"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RulesManager from "@/components/admin/rules-manager"
import UsersManager from "@/components/admin/users-manager"
import PendingCommands from "@/components/admin/pending-commands"
import AuditLogs from "@/components/admin/audit-logs"
import CommandSubmit from "@/components/command-submit"

export default function AdminDashboard({ apiKey }: { apiKey: string }) {
  return (
    <Tabs defaultValue="commands" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-black/30 border border-terminal-dim">
        <TabsTrigger 
          value="commands" 
          className="text-terminal-dim data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg hover:text-terminal-text transition-colors"
        >
          COMMANDS
        </TabsTrigger>
        <TabsTrigger 
          value="rules" 
          className="text-terminal-dim data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg hover:text-terminal-text transition-colors"
        >
          RULES
        </TabsTrigger>
        <TabsTrigger 
          value="users" 
          className="text-terminal-dim data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg hover:text-terminal-text transition-colors"
        >
          USERS
        </TabsTrigger>
        <TabsTrigger 
          value="pending" 
          className="text-terminal-dim data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg hover:text-terminal-text transition-colors"
        >
          PENDING
        </TabsTrigger>
        <TabsTrigger 
          value="logs" 
          className="text-terminal-dim data-[state=active]:bg-terminal-accent data-[state=active]:text-terminal-bg hover:text-terminal-text transition-colors"
        >
          AUDIT
        </TabsTrigger>
      </TabsList>

      <TabsContent value="commands" className="mt-4">
        <CommandSubmit apiKey={apiKey} onCommandSubmitted={() => {}} />
      </TabsContent>

      <TabsContent value="rules" className="mt-4">
        <RulesManager apiKey={apiKey} />
      </TabsContent>

      <TabsContent value="users" className="mt-4">
        <UsersManager apiKey={apiKey} />
      </TabsContent>

      <TabsContent value="pending" className="mt-4">
        <PendingCommands apiKey={apiKey} />
      </TabsContent>

      <TabsContent value="logs" className="mt-4">
        <AuditLogs apiKey={apiKey} />
      </TabsContent>
    </Tabs>
  )
}

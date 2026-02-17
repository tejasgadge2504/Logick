import { Separator } from "@/components/ui/separator"

export default function Sidebar() {
  return (
    <div className="w-64 border-r bg-card p-6">
      <h1 className="text-2xl font-bold tracking-wide mb-6">
        LOGICK
      </h1>

      <Separator className="mb-6" />

      <div className="space-y-3 text-sm">
        <div className="p-2 rounded-md bg-muted font-medium">
          Dashboard
        </div>
        <div className="p-2 rounded-md hover:bg-muted cursor-pointer">
          Logs
        </div>
        <div className="p-2 rounded-md hover:bg-muted cursor-pointer">
          Analytics
        </div>
        <div className="p-2 rounded-md hover:bg-muted cursor-pointer">
          Settings
        </div>
      </div>
    </div>
  )
}

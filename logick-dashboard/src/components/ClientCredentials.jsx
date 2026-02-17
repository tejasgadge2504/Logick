import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Eye, EyeOff, Copy, RefreshCw } from "lucide-react"
import { getTokenFromCookies } from "@/lib/auth"
import Cookies from "js-cookie"

export default function ClientCredentials() {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(true)
  const [showSecret, setShowSecret] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [confirmText, setConfirmText] = useState("")
  const [refreshLoading, setRefreshLoading] = useState(false)

//   const token = getTokenFromCookies()

const token = Cookies.get("auth-token")

  // Fetch Client Details
  const fetchClientDetails = async () => {
    // console.log("token: ",token)
    try {
      const res = await fetch(
        "https://logik-khaki.vercel.app/api/client/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (data.success) {
        setClientId(data.data.clientId)
        setClientSecret(data.data.clientSecret)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientDetails()
  }, [])

  // Copy function
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  // Refresh Secret
  const refreshSecret = async () => {
    if (confirmText !== "CONFIRM") return

    setRefreshLoading(true)

    try {
      const res = await fetch(
        "https://logik-khaki.vercel.app/api/client/refresh-secret",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (data.success) {
        setClientSecret(data.data.newClientSecret)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setRefreshLoading(false)
      setOpenDialog(false)
      setConfirmText("")
    }
  }

  if (loading) return <div>Loading client details...</div>

  return (
    <>
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">

          <div className="flex gap-4 items-center">
            {/* Client ID */}
            <div className="flex items-center gap-2">
            <p className="font-semibold">Client ID</p>
              <Input value={clientId} readOnly className="w-72" />
              <Copy
                className="cursor-pointer"
                size={18}
                onClick={() => copyToClipboard(clientId)}
              />
            </div>

            {/* Client Secret */}
            <div className="flex items-center gap-2">
                <p className="font-semibold">Client Secret</p>
              <Input
                type={showSecret ? "text" : "password"}
                value={clientSecret}
                readOnly
                className="w-72"
              />

              {showSecret ? (
                <EyeOff
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setShowSecret(false)}
                />
              ) : (
                <Eye
                  size={18}
                  className="cursor-pointer"
                  onClick={() => setShowSecret(true)}
                />
              )}

              <Copy
                size={18}
                className="cursor-pointer"
                onClick={() => copyToClipboard(clientSecret)}
              />
            </div>

            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpenDialog(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Secret
            </Button>
          </div>
        </div>
      </Card>

      {/* Confirm Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader className={""}>
            <DialogTitle className={"font-light"}>
              Type <span className="font-bold">"CONFIRM"</span> to refresh client secret
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Type CONFIRM"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          <DialogFooter>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={refreshSecret}
              disabled={refreshLoading}
            >
              {refreshLoading ? "Refreshing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

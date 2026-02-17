import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function StatsCards() {
  const [stats, setStats] = useState({
    maliciousLogsDetected: 0,
    totalLogs: 0,
    maliciousLogsThisWeek: 0,
    safenessPercentage: 0,
  })

  const [loading, setLoading] = useState(true)

  const token = Cookies.get("auth-token")

  const fetchAnalysis = async () => {
    try {
      const res = await axios.get(
        "https://logik-khaki.vercel.app/api/logs/analysis",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.success) {
        setStats(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching analysis")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalysis()
  }, [])

  if (loading) {
    return <div className="text-center py-10">Loading stats...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Malicious Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Malicious Logs Detected
          </CardTitle>
          <Badge variant="destructive">
            Alert
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.maliciousLogsDetected}
          </div>
        </CardContent>
      </Card>

      {/* Total Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Total Logs
          </CardTitle>
          <Badge>
            Info
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.totalLogs}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Malicious */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            This Week Malicious Attacks
          </CardTitle>
          <Badge variant="secondary">
            Weekly
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {stats.maliciousLogsThisWeek}
          </div>
        </CardContent>
      </Card>

      {/* Safeness */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            App Safeness Percentage
          </CardTitle>
          <Badge className="bg-green-600 text-white">
            Secure
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-500">
            {stats.safenessPercentage}%
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

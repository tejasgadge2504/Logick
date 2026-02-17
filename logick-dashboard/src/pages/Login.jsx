import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../lib/axios"
import Loader from "../components/Loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const handleLogin = async () => {
    try {
      setLoading(true)

      const res = await api.post("/auth/login", form)

      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token)
        navigate("/dashboard")
      }
    } catch (err) {
      alert("Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login to LOGICK</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <Loader /> : "Login"}
          </Button>

          <p className="text-sm text-center">
            Don't have account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

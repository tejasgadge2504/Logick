import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../lib/axios"
import Loader from "../components/Loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    mobNo: "",
    password: "",
  })

  const handleRegister = async () => {
    try {
      setLoading(true)

      const res = await api.post("/auth/register", form)

      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token)
        navigate("/dashboard")
      }
    } catch (err) {
      alert("Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create LOGICK Account</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Input
            placeholder="Mobile Number"
            onChange={(e) =>
              setForm({ ...form, mobNo: e.target.value })
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
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <Loader /> : "Register"}
          </Button>

          <p className="text-sm text-center">
            Already have account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

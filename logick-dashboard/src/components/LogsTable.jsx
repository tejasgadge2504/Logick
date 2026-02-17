import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"

export default function LogsTable() {
  const [logs, setLogs] = useState([])
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  const token = Cookies.get("auth-token")

  const fetchLogs = async () => {
    try {
      setLoading(true)

      const res = await axios.get(
        `https://logik-khaki.vercel.app/api/logs?pageNo=${pageNo}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.success) {
        setLogs(res.data.data.logs)
        setTotalPages(res.data.data.pagination.totalPages)
      }
    } catch (err) {
      console.error("Error fetching logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [pageNo, pageSize])

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  const getCategoryColor = (category) => {
    if (category === "safe") return "text-green-500"
    if (category === "suspicious") return "text-yellow-500"
    if (category === "malicious") return "text-red-500"
    return ""
  }

  return (
    <div className="mt-10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Logs</h3>

        {/* Page Size Dropdown */}
        <select
          className="border px-3 py-1 rounded-md"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setPageNo(1)
          }}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Scrollable Rectangular Area */}
      <div className="border rounded-xl h-[300px] overflow-y-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 text-left">Log Text</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Timestamp</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="text-center p-5">
                  Loading...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center p-5">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3 break-all">{log.logText}</td>
                  <td className={`p-3 font-medium ${getCategoryColor(log.category)}`}>
                    {log.category}
                  </td>
                  <td className="p-3">{formatDate(log.timestamp)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={pageNo === 1}
          onClick={() => setPageNo(pageNo - 1)}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span>
          Page {pageNo} of {totalPages}
        </span>

        <button
          disabled={pageNo === totalPages}
          onClick={() => setPageNo(pageNo + 1)}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default function Loader({ size = 20 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "2px solid white",
        borderTop: "2px solid transparent",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
      }}
    />
  )
}

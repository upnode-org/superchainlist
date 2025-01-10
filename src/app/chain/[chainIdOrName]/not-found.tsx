// app/chain/[chainIdOrName]/not-found.tsx

export default function NotFound() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>404 - Chain not found</h1>
        <p>The requested chain does not exist. Please check the URL.</p>
      </div>
    );
  }
import { useEffect, useState } from 'react';

export default function App() {
  const [helloMessage, setHelloMessage] = useState('Loading...');
  const [statusInfo, setStatusInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const helloResponse = await fetch('/api/hello');
        const helloData = await helloResponse.json();

        const statusResponse = await fetch('/api/status');
        const statusData = await statusResponse.json();

        setHelloMessage(helloData.message);
        setStatusInfo(statusData);
      } catch (err) {
        setError('Could not connect to the server. Make sure the backend is running.');
      }
    }

    loadData();
  }, []);

  return (
    <main className="page">
      <div className="card">
        <h1>React + Express Scaffold</h1>
        <p>
          This small project shows how a React frontend can talk to an Express backend.
        </p>

        <section>
          <h2>Message from the backend</h2>
          <p>{helloMessage}</p>
        </section>

        <section>
          <h2>Server status</h2>
          {statusInfo ? (
            <ul>
              <li><strong>Status:</strong> {statusInfo.status}</li>
              <li><strong>Time:</strong> {statusInfo.time}</li>
              <li><strong>Environment:</strong> {statusInfo.environment}</li>
            </ul>
          ) : (
            <p>Loading status...</p>
          )}
        </section>

        {error && <p className="error">{error}</p>}
      </div>
    </main>
  );
}

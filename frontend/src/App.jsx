import CustomersTable from "./components/CustomersTable";
import CallLogs from "./components/CallLogs";

function App() {
  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: "0 auto" }}>
      <h1>AI Calling Agent</h1>
      <CustomersTable />
      <CallLogs />
    </div>
  );
}

export default App;

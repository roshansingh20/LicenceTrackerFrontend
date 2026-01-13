import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { getUserRole } from "../utils/auth";
import AiAssistant from "../components/AiAssistant";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const role = getUserRole();

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await axiosInstance.get("/dashboard");
      setData(res.data);
    } catch (err) {
      console.error("Dashboard error", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!data) return <div className="p-8 text-red-600">Failed to load</div>;

  const { summary, licenseAlerts, softwareAlerts } = data;

  return (
    <div className="p-8 bg-slate-50 min-h-screen text-gray-900">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex items-center gap-4">
          <span className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-semibold shadow">
            {role}
          </span>
        </div>
      </div>

      <AiAssistant />

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
        <Card title="Total Devices" value={summary.totalDevices} color="bg-blue-100 text-blue-800" />
        <Card title="Active Devices" value={summary.activeDevices} color="bg-green-100 text-green-800" />
        <Card title="Decommissioned" value={summary.decommissionedDevices} color="bg-red-100 text-red-800" />
        <Card title="Total Licenses" value={summary.totalLicenses} color="bg-purple-100 text-purple-800" />
        <Card title="Expired Licenses" value={summary.expiredLicenses} color="bg-rose-100 text-rose-800" />
        <Card title="Non-Compliant" value={summary.nonCompliantDevices} color="bg-orange-100 text-orange-800" />
      </div>

      {/* LICENSE ALERTS */}
      <Section title="Licenses Expiring / Expired">
        {licenseAlerts.length === 0 ? <Empty text="No alerts" /> : (
          <table className="w-full text-sm bg-white text-gray-800">
            <thead className="bg-slate-200">
              <tr>
                <Th>Software</Th>
                <Th>Vendor</Th>
                <Th>Devices</Th>
                <Th>Expiry</Th>
                <Th>Status</Th>
                <Th>Days</Th>
              </tr>
            </thead>
            <tbody>
              {licenseAlerts.map((l,i)=>(
                <tr key={i} className="border-t hover:bg-slate-100">
                  <Td>{l.softwareName}</Td>
                  <Td>{l.vendor}</Td>
                  <Td>{l.deviceUsed}</Td>
                  <Td>{l.expiryDate}</Td>
                  <Td><Badge text={l.status} color={l.status==="EXPIRED"?"red":"orange"} /></Td>
                  <Td>{l.daysRemaining}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* SOFTWARE ALERTS */}
      <Section title="Software Lifecycle">
        {softwareAlerts.length === 0 ? <Empty text="All OK" /> : (
          <table className="w-full text-sm bg-white text-gray-800">
            <thead className="bg-slate-200">
              <tr>
                <Th>Device</Th>
                <Th>Software</Th>
                <Th>Installed</Th>
                <Th>Latest</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {softwareAlerts.map((s,i)=>(
                <tr key={i} className="border-t hover:bg-slate-100">
                  <Td>{s.deviceId}</Td>
                  <Td>{s.softwareName}</Td>
                  <Td>{s.installedVersion}</Td>
                  <Td>{s.latestVersion}</Td>
                  <Td><Badge text={s.status} color="yellow" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

    </div>
  );
}

/* ---------- UI COMPONENTS ---------- */

function Card({ title, value, color }) {
  return (
    <div className={`rounded-xl shadow p-6 text-center ${color}`}>
      <p className="text-sm">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded shadow p-6 mb-10">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Th({ children }) {
  return <th className="p-3 text-left font-semibold">{children}</th>;
}

function Td({ children }) {
  return <td className="p-3">{children}</td>;
}

function Badge({ text, color }) {
  const map = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-700"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${map[color]}`}>
      {text}
    </span>
  );
}

function Empty({ text }) {
  return <p className="text-gray-500 text-center">{text}</p>;
}

import { useEffect, useState } from "react";
import { getTrainingChecklist } from "../services/aiService";

export default function TrainingChecklist() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getTrainingChecklist().then(res => setData(res.data));
  }, []);

  if (!data) return <p>Loading AI checklist…</p>;

  return (
    <div className="bg-white p-6 rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-4">{data.title}</h2>

      {data.sections.map((s, i) => (
        <div key={i} className="mb-6">
          <h3 className="font-semibold text-indigo-600 mb-2">{s.title}</h3>
          <ul className="list-disc ml-6 text-gray-700">
            {s.steps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

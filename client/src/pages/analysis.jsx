import { useEffect, useState } from "react";
import axios from "axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Analysis = () => {
  const [aiSummarizedData, setAiSummarizedData] = useState([]);
  const [allKeys, setAllKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");
  const [graphData, setGraphData] = useState([]);

  // Step 1: Fetch Gemini summary data
  const [summary, setSummary] = useState("");
  const [plans, setPlans] = useState({ exercise: [], diet: [] });
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    const fetchAIData = async () => {
      const res = await axios.get("http://localhost:8000/summary/ai");
      setSummary(res.data.summary || "No summary available.");
      setPlans(res.data.plan || { exercise: [], diet: [] });
    };
    fetchAIData();
  }, []);

  const toggleCheck = (type, dayIndex) => {
    const key = `${type}_${dayIndex}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/summary");
        const data = res.data || [];

        setAiSummarizedData(data);

        const keys = data.map((item) => item.parameter);
        setAllKeys(keys);
        if (keys.length > 0) setSelectedKey(keys[0]);
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };

    fetchData();
  }, []);

  // Step 2: When selectedKey changes, filter data for that parameter
  useEffect(() => {
    if (!selectedKey) return;

    const item = aiSummarizedData.find(
      (entry) => entry.parameter === selectedKey
    );
    if (!item || !item.values) {
      setGraphData([]);
      return;
    }

    const cleaned = item.values
      .map((v) => ({
        date: new Date(v.date).toISOString().split("T")[0],
        value:
          parseFloat(
            typeof v.value === "string"
              ? v.value.replace(/[^\d.]/g, "")
              : v.value
          ) || 0,
      }))
      .filter((v) => v.value !== 0)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setGraphData(cleaned);
  }, [selectedKey, aiSummarizedData]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📊 AI-Powered Medical Trends</h2>

      {/* Dropdown */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Select Parameter:{" "}
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
          >
            {allKeys.map((key) => (
              <option key={key} value={key}>
                {key.toUpperCase().replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Chart */}
      {graphData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#28a745"
              name={selectedKey}
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>No data available for this parameter</p>
      )}
      <div style={{ padding: "2rem" }}>
        <h3 style={{ border: "1px solid black", padding: "1rem" }}>
          TEXT SUMMARY IN 100 words about my health
        </h3>
        <p style={{ marginTop: "1rem" }}>{summary}</p>

        <div style={{ background: "#ddd", padding: "2rem", marginTop: "2rem" }}>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "2rem" }}
          >
            <h4>EXERCISE PLAN</h4>
            <h4>DIET PLAN</h4>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div>
              {plans.exercise.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid black",
                    padding: "1rem",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Day {index + 1}: {item}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!completed[`exercise_${index}`]}
                    onChange={() => toggleCheck("exercise", index)}
                  />
                </div>
              ))}
            </div>

            <div>
              {plans.diet.map((item, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid black",
                    padding: "1rem",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>
                    Day {index + 1}: {item}
                  </span>
                  <input
                    type="checkbox"
                    checked={!!completed[`diet_${index}`]}
                    onChange={() => toggleCheck("diet", index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;

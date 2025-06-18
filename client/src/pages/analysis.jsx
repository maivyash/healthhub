// Analysis.js
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Spinner from "../components/spinner";
import "../css/Analysis.css";
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
  const [summary, setSummary] = useState("");
  const [plans, setPlans] = useState({ exercise: [], diet: [] });
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(true);

  const toggleCheck = (type, dayIndex) => {
    const key = `${type}_${dayIndex}`;
    setCompleted((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/summary/ai");
        if (res.status === 500) {
          toast.error(res.data.error || "Server went Upset");
          return;
        }
        setSummary(res.data.summary || "No insights available.");
        setPlans(res.data.plan || { exercise: [], diet: [] });
      } catch (err) {
        console.error("AI summary fetch failed");
      }
    };
    fetchAIData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/summary");
        if (res.status === 500) {
          toast.error(res.data.error || "Server went Upset");
          return;
        }
        const data = res.data || [];
        setAiSummarizedData(data);

        const keys = data.map((item) => item.parameter);
        setAllKeys(keys);
        if (keys.length > 0) setSelectedKey(keys[0]);
      } catch (err) {
        toast.error("Summary data fetch failed");
        console.error("Summary data fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="analysis-container">
      <h2 className="headline">📊 Your Health Trends</h2>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="dropdown-wrapper">
            <label>Select Parameter:</label>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="dropdown"
            >
              {allKeys.map((key) => (
                <option key={key} value={key}>
                  {key.toUpperCase().replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="chart-box">
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
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    name={selectedKey}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="nodata">No data available for this parameter</p>
            )}
          </div>

          <div className="summary-card">
            <h3>🧠 AI Health Insight</h3>
            <p>{summary}</p>
          </div>

          <div className="plan-container">
            <div className="plan-header">
              <h4>🏃‍♂️ Your 7-Day Exercise Plan</h4>
              <h4>🥗 Your 7-Day Diet Plan</h4>
            </div>
            <div className="plan-grid">
              <div>
                {plans.exercise.map((item, index) => (
                  <div className="plan-box" key={index}>
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
                  <div className="plan-box" key={index}>
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
        </>
      )}
    </div>
  );
};

export default Analysis;

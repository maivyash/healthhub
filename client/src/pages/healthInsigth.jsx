import React from "react";
import Navbar from "../components/NavBar";
import "../css/HealthInsights.css";
import { Navigate, useNavigate } from "react-router-dom";

const HealthInsights = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="health-insights-container">
        <h1>Know More</h1>

        {/* Personalized Analysis */}
        <section className="mb-10">
          <h2>Personalized Health Analysis</h2>
          <p>
            HealthHub analyzes your medical history, lifestyle, and preferences
            to provide a personalized health analysis. This includes identifying
            potential health risks, understanding your health trends, and
            offering tailored recommendations for diet and exercise.
          </p>
        </section>

        {/* Visual Charts */}
        <section className="mb-10">
          <h2>Visual Charts of Medical History Trends</h2>
          <p className="mb-6">
            Gain a deeper understanding of your health with visual charts that
            track your medical history trends over time. Monitor key health
            metrics, identify patterns, and make informed decisions about your
            well-being.
          </p>

          <div className="chart-grid">
            {/* Blood Pressure */}
            <div className="chart-card">
              <h3 className="chart-title">Blood Pressure Trends</h3>
              <p className="chart-value">120/80 mmHg</p>
              <p className="chart-subtext">
                Last 12 Months <span className="trend-down">-5%</span>
              </p>

              <div className="chart-line-container">
                {[...Array(7)].map((_, i) => (
                  <div
                    key={i}
                    className="chart-line"
                    style={{ height: `${Math.random() * 50 + 30}px` }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>

            {/* Cholesterol */}
            <div className="chart-card">
              <h3 className="chart-title">Cholesterol Levels</h3>
              <p className="chart-value">200 mg/dL</p>
              <p className="chart-subtext">
                Last 5 Years <span className="trend-up">+2%</span>
              </p>

              <div className="chart-bar-container">
                {[60, 70, 65, 72, 78].map((height, i) => (
                  <div
                    key={i}
                    className="chart-bar"
                    style={{ height: `${height}px` }}
                  />
                ))}
              </div>
              <div className="chart-labels">
                <span>2019</span>
                <span>2020</span>
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
              </div>
            </div>
          </div>
        </section>

        {/* Diet Recommendation */}
        <section className="mb-10">
          <h2>Tailored Diet and Exercise Recommendations</h2>
          <p className="mb-6">
            Receive personalized diet and exercise recommendations based on your
            health analysis. Our experts curate plans that align with your
            specific needs and goals, helping you achieve optimal health and
            well-being.
          </p>

        </section>
      </div>
    </>
  );
};

export default HealthInsights;

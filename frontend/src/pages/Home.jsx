import React from "react";
import "../css/Home.css"; // ✅ Importing CSS file

function Home() {
  return (
    <div className="home-container"> {/* ✅ Added a container class */}
      <header className="home-header">
        <h1>Welcome to Aptex</h1>
        <p>Your go-to platform for mastering aptitude skills!</p>
      </header>

      <section className="home-content">
        <h2>Why Choose Aptex?</h2>
        <p>
          Aptex is an advanced platform designed to enhance your problem-solving
          and logical reasoning skills. Whether you're preparing for competitive
          exams, job placements, or simply want to improve your aptitude, we've got
          you covered!
        </p>
      </section>

      <section className="home-features">
        <h2>Features of Aptex</h2>
        <ul>
          <li>🧠 Logical Reasoning & Quantitative Aptitude</li>
          <li>📊 Real-time Mock Tests & Performance Analysis</li>
          <li>📚 Interactive Study Materials & Video Tutorials</li>
          <li>🏆 Gamified Learning with Leaderboards</li>
          <li>💡 AI-Powered Personalized Learning Paths</li>
        </ul>
      </section>

      <footer className="home-footer">
        <p>Start your learning journey with Aptex today!</p>
      </footer>
    </div>
  );
}

export default Home;

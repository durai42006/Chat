import React, { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import WeeklyContest from "../pages/WeeklyContest"; // ✅ Import Weekly Contest
import "../css/Dashboard.css"; // ✅ Import CSS file
import CommunityChat from "./CommunityChat";
function Dashboard() {
  const { user } = useContext(UserContext);
  console.log("User Context Data:", user);
  if (user) {
    console.log("User Name:", user.name);
  } else {
    console.log("User details are null");
  }

  // Aptitude topics with subtopics
  const aptitudeTopics = [
    { 
      name: "Quantitative Aptitude", 
      subtopics: ["LCM & HCF", "Percentages", "Profit & Loss", "Simple & Compound Interest", "Time & Work", "Time, Speed & Distance"] 
    },
    { 
      name: "Logical Reasoning", 
      subtopics: ["Blood Relations", "Coding-Decoding", "Number Series", "Direction Sense", "Syllogisms", "Puzzles"] 
    },
    { 
      name: "Verbal Ability", 
      subtopics: ["Reading Comprehension", "Sentence Correction", "Synonyms & Antonyms", "Para Jumbles", "Fill in the Blanks"] 
    },
    { 
      name: "Data Interpretation", 
      subtopics: ["Bar Graphs", "Pie Charts", "Line Graphs", "Tables", "Data Sufficiency"] 
    },
    { 
      name: "Probability & Statistics", 
      subtopics: ["Mean, Median, Mode", "Permutations & Combinations", "Probability", "Standard Deviation"] 
    },
    { 
      name: "Algebra & Geometry", 
      subtopics: ["Quadratic Equations", "Polynomials", "Triangles & Circles", "Coordinate Geometry", "Mensuration"] 
    },
  ];

  // State to track expanded topics
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [showContest, setShowContest] = useState(false); // ✅ New state for contest page

  const toggleSubtopics = (index) => {
    setExpandedTopic(expandedTopic === index ? null : index);
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome to AptEx</h1>
      {!!user ? <h2 className="dashboard-username">Hello, {user.name}!</h2> : <p className="dashboard-loading">Loading user...</p>}

      {/* Toggle Button for Weekly Contest */}
      <button className="contest-button" onClick={() => setShowContest(!showContest)}>
        {showContest ? "Back to Dashboard" : "Go to Weekly Contest"}
      </button>

      {showContest ? (
        <WeeklyContest /> // ✅ Show Weekly Contest when button is clicked
      ) : (
        <div className="topics-container">
          {aptitudeTopics.map((topic, index) => (
            <div key={index} className="topic-card" onClick={() => toggleSubtopics(index)}>
              <h3>{topic.name}</h3>
              <div className={`subtopics ${expandedTopic === index ? "show" : ""}`}>
                {topic.subtopics.map((subtopic, subIndex) => (
                  <p key={subIndex} className="subtopic">{subtopic}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

  <CommunityChat />

    </div>
  );
}

export default Dashboard;

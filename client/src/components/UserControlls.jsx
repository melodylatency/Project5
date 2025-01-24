import React, { useState } from "react";

const UserControls = ({ onSubmit }) => {
  const [language, setLanguage] = useState("en");
  const [seed, setSeed] = useState(Math.floor(Math.random() * 10000)); // Random seed
  const [likes, setLikes] = useState(5);
  const [reviews, setReviews] = useState(100);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ language, seed, likes, reviews });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Language/Region:</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en">English (USA)</option>
          <option value="ru">Russian (Russia)</option>
          <option value="de">German (Germany)</option>
        </select>
      </div>
      <div>
        <label>Seed Value:</label>
        <input
          type="number"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
      </div>
      <div>
        <label>Average Likes per Book:</label>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={likes}
          onChange={(e) => setLikes(e.target.value)}
        />
        <span>{likes}</span>
      </div>
      <div>
        <label>Average Reviews per Book:</label>
        <input
          type="number"
          value={reviews}
          onChange={(e) => setReviews(e.target.value)}
        />
      </div>
      <button type="submit">Generate Books</button>
    </form>
  );
};

export default UserControls;

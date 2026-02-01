import { useState } from "react";

const StarRating = ({ rating, onChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            fontSize: "24px",
            cursor: "pointer",
            color: star <= (hover || rating) ? "#ffc107" : "#ccc",
          }}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

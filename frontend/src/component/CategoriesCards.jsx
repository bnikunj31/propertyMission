// CategoriesCards.js
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "../Style/Loader.css";
// import Cards from "./Cards";

const CategoriesCards = ({ categoryId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/api/property/fetch/${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setCards(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="loader-container">
        <div className="custom-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container">
      <div className="row">
        {cards.map((card) => (
          <Cards key={card._id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default CategoriesCards;

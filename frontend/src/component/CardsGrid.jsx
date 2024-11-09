import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

// Cards component
const Cards = ({ card }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/property/${card._id}`);
  };

  return (
    <div className="mb-4 col-lg-3 col-md-4 col-sm-6 px-3">
      <div className="card h-100">
        <a
          href={card.property_images[0]}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="card-img-top img-fluid h-60"
            loading="lazy"
            decoding="async"
            src={card.property_images[0]} // Assuming the first image is the primary one
            alt={card.name}
          />
        </a>
        <div className="card-body">
          <h5 className="card-title">{card.name}</h5>
          <p className="card-text">{card.location}</p>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{ __html: card.description }}
          ></p>
          <p className="card-text">
            <strong>Type:</strong> {card.type}
          </p>
          <p className="card-text">
            <strong>Price:</strong> ₹{card.price}
          </p>
          <div className="d-flex justify-between">
            <p className="card-text">
              <strong>Area:</strong> {card.area}
            </p>
            <button
              className="btn btn-outline-secondary"
              onClick={handleReadMore}
            >
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CardsGrid component with API call to fetch property data
const CardsGrid = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/property/fetch");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setCards(data); // Set the fetched data to state
      } catch (error) {
        setError(error.message); // Set error message if any error occurs
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if any error occurs
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

export default CardsGrid;

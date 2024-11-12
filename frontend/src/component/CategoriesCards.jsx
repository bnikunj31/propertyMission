import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useParams } from "react-router-dom"; // Import useParams
import "../Style/Loader.css";

const CategoriesCards = () => {
  const { categoryId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`/api/property/fetch/${categoryId}`);
        console.log("API Response Data:", response.data);
        setCards(response.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchProperties();
    } else {
      setError("Customer ID is missing.");
      setLoading(false);
    }
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
          <div className="mb-4 col-md-4" key={card._id}>
            <div className="card h-100">
              <img
                src={card.imageUrl || "default-image.jpg"} // Use a default image if none provided
                className="card-img-top"
                alt={card.title}
              />
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text">{card.description}</p>
                <p className="card-price">Price: ${card.price}</p>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesCards;

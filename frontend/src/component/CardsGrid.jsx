import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import "../Style/Loader.css";

// Cards component
const Cards = ({ card }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/property/${card._id}`, { state: { card } });
  };

  const truncateDescription = (htmlString, maxLength) => {
    const plainText = htmlString.replace(/<[^>]+>/g, "");
    return plainText.length > maxLength
      ? plainText.substring(0, maxLength) + "..."
      : plainText;
  };

  return (
    <div className="px-3 mb-4 col-lg-3 col-md-4 col-sm-6">
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
            src={card.property_images[0]}
            alt={card.name}
          />
        </a>
        <div className="card-body">
          <h5 className="card-title">{card.name}</h5>
          <p className="card-text">{card.location}</p>
          <p
            className="card-text"
            dangerouslySetInnerHTML={{
              __html: truncateDescription(card.description, 50),
            }}
          ></p>
          <p className="card-text">
            <strong>Type:</strong> {card.type}
          </p>
          <p className="card-text">
            <strong>Price:</strong> ₹{card.price}
          </p>
          <div className="d-flex justify-content-between">
            <p className="card-text">
              <strong>Area:</strong> {card.area}
            </p>
          </div>
          <button
            className="mt-2 btn w-100 btn-outline-secondary"
            onClick={handleReadMore}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

// CardsGrid component with API call, search filter, and MUI pagination
const CardsGrid = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 20;

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/property/fetch");
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
  }, []);

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentCards = filteredCards.slice(startIndex, startIndex + cardsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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
      {/* Search Input */}
      <div className="row mb-4">
        <div className="col-md-6 offset-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Display */}
      <div className="row">
        {currentCards.length > 0 ? (
          currentCards.map((card) => <Cards key={card._id} card={card} />)
        ) : (
          <div className="col text-center">
            <p>No properties found matching your search.</p>
          </div>
        )}
      </div>

      {/* MUI Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default CardsGrid;

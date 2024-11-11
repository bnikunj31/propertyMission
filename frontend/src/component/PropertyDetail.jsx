import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Style/PropertyDetail.css";
const PropertyDetail = () => {
  const { state } = useLocation(); // Access the state passed by navigate
  const [property, setProperty] = useState(state?.card || null); // Use the passed card data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!property) {
      // If property data is not passed via state, fetch it
      setLoading(true);
      const fetchPropertyData = async () => {
        try {
          const response = await fetch(`/api/property/fetch/${id}`);
          if (response.status === 200) {
            const data = await response.json();
            setProperty(data);
          } else {
            throw new Error("Failed to fetch property details.");
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchPropertyData();
    }
  }, [property]); // Fetch only if no property data passed

  if (loading) {
    return <div>Loading property data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!property) {
    return <div>No property data available.</div>;
  }

  const {
    name,
    location: propertyLocation,
    description,
    property_images,
    price,
    area,
    type,
    status,
    property_map,
    property_video,
  } = property;
  const videoId = property_video.split("v=")[1];
  return (
    <div className="container py-5">
      {/* Property Title and Location */}
      <div className="mb-4 row">
        <div className="col-md-8">
          <h1 className="display-4">{name}</h1>
          <p className="lead text-muted">{propertyLocation}</p>
        </div>
      </div>

      {/* Property Images */}
      <div className="mb-4 row">
        <div className="col-md-8">
          <div
            id="propertyImagesCarousel"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {property_images.map((image, index) => (
                <div
                  key={index}
                  className={`carousel-item ${index === 0 ? "active" : ""}`}
                >
                  <img
                    src={image}
                    className="d-block w-100"
                    alt={`Property image ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#propertyImagesCarousel"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#propertyImagesCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Property Description */}
      <div className="mb-4 row">
        <div className="col-md-8">
          <h3>Description</h3>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mb-4 row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Property Details</h5>
              <ul className="list-unstyled">
                <li>
                  <strong>Price:</strong> ₹{price.toLocaleString()}
                </li>
                <li>
                  <strong>Area:</strong> {area}
                </li>
                <li>
                  <strong>Type:</strong> {type}
                </li>
                <li>
                  <strong>Status:</strong> {status}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Map & Video Section */}
        <div className="col-md-8">
          {/* Property Map */}
          <div className="mb-4">
            <h4>Property Map</h4>
            <div className="row">
              {property_map.map((mapImage, index) => (
                <div key={index} className="mb-3 col-md-4">
                  <img
                    src={mapImage}
                    className="rounded img-fluid"
                    alt={`Map ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Video */}
          {property_video && (
            <div className="mb-4">
              <h4>Property Video</h4>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                width="100%"
                height="400"
                title="Property Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;

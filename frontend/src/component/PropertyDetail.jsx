import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../Style/PropertyDetail.css";

const PropertyDetail = () => {
  const { state } = useLocation();
  const [property, setProperty] = useState(state?.card || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!property) {
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
  }, [property]);

  if (loading) return <div>Loading property data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) return <div>No property data available.</div>;

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

  const extractVideoId = (url) => {
    const regExp =
      /^.*(?:youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  };

  const videoId = extractVideoId(property_video);

  // Carousel configuration for map images
  const mapCarouselResponsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className="container pb-5">
      {/* Property Images (Carousel) */}
      <div
        id="propertyImagesCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
        data-bs-interval="2000"
      >
        <div className="carousel-inner">
          {property_images.map((image, index) => (
            <div
              key={index}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <img
                src={image}
                className="d-block w-100 img-fluid h-[60vh] object-fit-cover"
                alt={`Property image ${index + 1}`}
                onError={(e) => (e.target.src = "path_to_default_image.jpg")}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#propertyImagesCarousel"
          data-bs-slide="prev"
          style={{ opacity: 0 }}
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          style={{ opacity: 0 }}
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

      {/* Property Title and Location */}
      <div className="mb-4 row">
        <div className="col-md-12">
          <h1 className="py-2 fs-1 text-capitalize">{name}</h1>
          <p className="lead text-muted d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="black"
              className="bi bi-geo-alt me-2"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C5.243 0 3 2.243 3 5c0 3.034 2.656 5.987 5.8 9.06a.5.5 0 0 0 .4.17.5.5 0 0 0 .4-.17C10.344 10.987 13 8.034 13 5c0-2.757-2.243-5-5-5zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
            <strong>{propertyLocation}</strong>
          </p>
        </div>
      </div>

      {/* Property Description */}
      <div className="mb-4 row">
        <div className="col-md-8">
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mb-4 row">
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-bordered w-100">
              <tbody>
                <tr>
                  <th scope="row">Price</th>
                  <th scope="row">Area</th>
                  <th scope="row">Type</th>
                  <th scope="row">Status</th>
                </tr>
                <tr>
                  <td>₹{price.toLocaleString()}</td>
                  <td>{area}</td>
                  <td>{type}</td>
                  <td>{status}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Property Map Carousel */}
      {property_map && property_map.length > 0 && (
        <div className="mb-4">
          {/* <h4>Prop  erty Map</h4> */}
          <Carousel
            responsive={mapCarouselResponsive}
            swipeable={true}
            draggable={true}
            showDots={false}
            infinite={true}
            autoPlay={true}
            autoPlaySpeed={3000}
            keyBoardControl={false}
            transitionDuration={500}
            containerClass="carousel-container"
          >
            {property_map.map((mapImage, index) => (
              <div key={index} className="p-2">
                <img style={{aspectRatio:"1" ,height:"400px",width:"500px"}}
                  src={mapImage}
                  className="rounded img-fluid"
                  alt={`Map ${index + 1}`}
                />
              </div>
            ))}
          </Carousel>
        </div>
      )}

      {/* Property Video */}
      {videoId && (
        <div className="mb-4">
          {/* <h4>Property Video</h4> */}
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
  );
};

export default PropertyDetail;

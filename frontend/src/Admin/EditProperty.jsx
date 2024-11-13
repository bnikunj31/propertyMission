import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useLocation, useNavigate } from "react-router-dom";

const EditProperty = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract property data from location state
  const propertyData = location.state?.property || {};

  // Initialize state with property data (if available)
  const [name, setName] = useState(propertyData.name || "");
  const [description, setDescription] = useState(
    propertyData.description || ""
  );
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyMap, setPropertyMap] = useState([]);
  const [propertyLocationMap, setPropertyLocationMap] = useState([]);
  const [propertyVideo, setPropertyVideo] = useState(
    propertyData.property_video || ""
  );
  const [price, setPrice] = useState(propertyData.price || "");
  const [area, setArea] = useState(propertyData.area || "");
  const [propertyLocation, setPropertyLocation] = useState(
    propertyData.location || ""
  );
  const [type, setType] = useState(propertyData.type || "");
  const [status, setStatus] = useState(propertyData.status || "available");
  const [propertyTypes, setPropertyTypes] = useState([]);

  // Styled input for hidden file upload
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  // Quill editor toolbar configuration
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["bold", "italic", "underline"],
      ["link"],
      ["image"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      ["clean"],
    ],
  };

  // Fetch property types from the server on component mount
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/property/propertyTypeAdd"
        );
        setPropertyTypes(response.data.propertyTypes || []);
      } catch (error) {
        toast.error("Failed to fetch property types.");
      }
    };
    fetchPropertyTypes();
  }, []);

  // Validate form fields
  const validateForm = () => {
    if (!name) {
      toast.error("Please enter the property name.");
      return false;
    }
    if (!description) {
      toast.error("Please enter a description.");
      return false;
    }
    if (!price || isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price.");
      return false;
    }
    if (!area) {
      toast.error("Please enter the area.");
      return false;
    }
    if (!propertyLocation) {
      toast.error("Please enter the location.");
      return false;
    }
    if (!type) {
      toast.error("Please select a property type.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("property_video", propertyVideo || "");
      formData.append("price", price);
      formData.append("area", area);
      formData.append("location", propertyLocation);
      formData.append("type", type);
      formData.append("status", status);

      propertyImages.forEach((file) => {
        formData.append("property_images", file);
      });
      propertyMap.forEach((file) => {
        formData.append("property_map", file);
      });
      propertyLocationMap.forEach((file) => {
        formData.append("property_location_map", file);
      });

      try {
        const response = await axios.patch(
          `/api/property/propertyUpdate/${propertyData._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.status === 200) {
          toast.success("Property updated successfully!");
          navigate("/properties");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to update property.");
      }
    }
  };

  // Handle file selection and update state with the files themselves
  const handleFileChange = (setter) => (event) => {
    const files = Array.from(event.target.files);
    setter((prev) => [...prev, ...files]);
  };

  return (
    <div className="flex items-center justify-center w-full min-h-screen px-2 sm:px-5">
      <ToastContainer />
      <Box
        component="form"
        sx={{ width: { xs: "100%", md: "80%", lg: "70%" }, m: 2 }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <p className="text-xl text-center text-gray-600">Edit Property</p>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Property Name"
              variant="standard"
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          <Grid item xs={12}>
            <label htmlFor="description">Description</label>
            <ReactQuill
              modules={modules}
              value={description}
              onChange={setDescription}
              placeholder="Edit your Property"
            />
          </Grid>

          {/* File Upload Buttons */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Property Images
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange(setPropertyImages)}
                    multiple
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Property Map
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange(setPropertyMap)}
                    multiple
                  />
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                >
                  Location Map
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange(setPropertyLocationMap)}
                    multiple
                  />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          {/* Property Video URL */}
          <Grid item xs={12}>
            <TextField
              id="propertyVideo"
              value={propertyVideo}
              onChange={(e) => setPropertyVideo(e.target.value)}
              label="Property Video URL"
              variant="standard"
              fullWidth
              margin="normal"
            />
          </Grid>

          {/* Price, Area, Location Fields */}
          <Grid item xs={12}>
            <TextField
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              label="Price"
              type="number"
              variant="standard"
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              label="Area"
              type="text"
              variant="standard"
              fullWidth
              required
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="location"
              value={propertyLocation}
              onChange={(e) => setPropertyLocation(e.target.value)}
              label="Location"
              variant="standard"
              fullWidth
              required
              margin="normal"
            />
          </Grid>

          {/* Property Type Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="property-type-label">Property Type</InputLabel>
              <Select
                labelId="property-type-label"
                id="property-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Property Type"
              >
                {propertyTypes.map((propertyType) => (
                  <MenuItem
                    key={propertyType._id}
                    value={propertyType.type_name}
                  >
                    {propertyType.type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Status Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="rented">Rented</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Update Property
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EditProperty;

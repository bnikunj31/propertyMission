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

  // Fetching propertyData from location state with optional chaining
  const propertyData = location.state?.property || {};
  console.log(propertyData);

  // State variables for form fields
  const [name, setName] = useState(propertyData.name || "");
  const [description, setDescription] = useState(
    propertyData.description || ""
  );
  const [propertyImages, setPropertyImages] = useState(
    propertyData.property_images || []
  );
  const [propertyMap, setPropertyMap] = useState(
    propertyData.property_map || []
  );
  const [propertyLocationMap, setPropertyLocationMap] = useState(
    propertyData.property_location_map || []
  );
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

  // Fetch property types on component mount
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

  // Update area whenever propertyData changes
  useEffect(() => {
    setArea(propertyData.area || "");
  }, [propertyData]);

  // Form validation
  const validateForm = () => {
    if (!name) {
      toast.error("Please enter the property name.");
      return false;
    }
    if (!description) {
      toast.error("Please enter a description.");
      return false;
    }
    if (propertyImages.length === 0) {
      toast.error("Please upload at least one property image.");
      return false;
    }
    if (propertyMap.length === 0) {
      toast.error("Please upload at least one property map.");
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
      try {
        const response = await axios.put(
          `/api/property/propertyUpdate/${propertyData._id}`,
          {
            name,
            description,
            property_images: propertyImages,
            property_map: propertyMap,
            property_location_map: propertyLocationMap,
            property_video: propertyVideo || "",
            price,
            area,
            location: propertyLocation,
            type,
            status,
          }
        );

        if (response.status === 200) {
          toast.success("Property updated successfully!");
          navigate("/properties"); // Redirect to the properties list or desired page
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to update property.");
      }
    }
  };

  // Handle file changes
  const handleFileChange = (setter) => (event) => {
    const files = Array.from(event.target.files);
    setter((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
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

          {/* Use ReactQuill for the description field */}
          <Grid item xs={12}>
            <label htmlFor="description">Description</label>
            <ReactQuill
              theme="snow"
              value={description}
              onChange={setDescription}
              
            />
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    backgroundColor: "#2c3e50",
                    "&:hover": { backgroundColor: "#2c354f" },
                  }}
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
                  sx={{
                    backgroundColor: "#2c3e50",
                    "&:hover": { backgroundColor: "#2c354f" },
                  }}
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
                  sx={{
                    backgroundColor: "#2c3e50",
                    "&:hover": { backgroundColor: "#2c354f" },
                  }}
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

          <Grid item xs={6}>
            <FormControl variant="standard" fullWidth required>
              <InputLabel id="type-label">Property Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                label="Property Type"
              >
                {propertyTypes.map((propertyType) => (
                  <MenuItem key={propertyType._id} value={propertyType._id}>
                    {propertyType.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl variant="standard" fullWidth required>
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

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 3 }}
            >
              Update Property
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default EditProperty;

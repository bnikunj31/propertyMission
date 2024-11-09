import React, { useState, useEffect } from "react";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // import quill's CSS for the editor

const PropertyForm = () => {
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

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyMap, setPropertyMap] = useState([]);
  const [propertyLocationMap, setPropertyLocationMap] = useState([]);
  const [propertyVideo, setPropertyVideo] = useState("");
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("available");
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get("/api/property/propertyTypeAdd");
        setPropertyTypes(
          Array.isArray(response.data.propertyTypes)
            ? response.data.propertyTypes
            : []
        );
      } catch (error) {
        toast.error("Failed to fetch property types.");
      }
    };
    fetchPropertyTypes();
  }, []);

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
    if (!location) {
      toast.error("Please enter the location.");
      return false;
    }
    if (!type) {
      toast.error("Please select a property type.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("property_video", propertyVideo || "");
      formData.append("price", price);
      formData.append("area", area);
      formData.append("location", location);
      formData.append("type", type);
      formData.append("status", status);

      propertyImages.forEach((file) => {
        formData.append("property_images", file);
      });
      propertyMap.forEach((file) => {
        formData.append("property_map", file);
      });

      if (propertyLocationMap.length > 0) {
        propertyLocationMap.forEach((file) => {
          formData.append("property_location_map", file);
        });
      }

      try {
        const response = await axios.post(
          "/api/property/propertyAdd",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Property added successfully!");
          setName("");
          setDescription("");
          setPropertyImages([]);
          setPropertyMap([]);
          setPropertyLocationMap([]);
          setPropertyVideo("");
          setPrice("");
          setArea("");
          setLocation("");
          setType("");
          setStatus("available");
        }
      } catch (error) {
        toast.error(error.response?.data?.msg || "Failed to add property.");
      }
    }
  };

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
        encType="multipart/form-data"
      >
        <p className="text-xl text-center text-gray-600">Add New Property</p>
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
            <ReactQuill
              value={description}
              onChange={setDescription}
              placeholder="Enter property description"
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
                    inputProps={{ multiple: true }}
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
                    inputProps={{ multiple: true }}
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
                    inputProps={{ multiple: true }}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select property type</em>
                </MenuItem>
                {propertyTypes.map((propertyType) => (
                  <MenuItem key={propertyType._id} value={propertyType._id}>
                    {propertyType.type_name}
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="sold">Sold</MenuItem>
                <MenuItem value="not available">Not Available</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{
                backgroundColor: "#2c3e50",
                "&:hover": { backgroundColor: "#2c354f" },
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default PropertyForm;

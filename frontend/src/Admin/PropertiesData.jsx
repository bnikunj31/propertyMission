import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Pagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PropertiesData = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();

  const headers = [
    "Name",
    "Description",
    "Property Images",
    "Property Map",
    "Property Location Map",
    "Property Video",
    "Price",
    "Area",
    "Location",
    "Type",
    "Status",
    "Action",
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/property/fetch");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const handleEdit = (row) => {
    navigate("/edit/property", { state: { property: row } });
  };

  const handleDeleteDialogOpen = (id) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/property/action/${deleteId}`);
      toast.success(response.data.msg);
      fetchData();
      handleDeleteDialogClose();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
      handleDeleteDialogClose();
    }
  };

  // Utility function to strip HTML tags
  const stripHtmlTags = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");
    return doc.body.textContent || "";
  };

  // Carousel component with fade effect
  const ImageCarousel = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }, [images.length]);

    return (
      <div className="image-carousel">
        {images.length > 0 && (
          <img
            src={images[currentIndex]}
            alt="Property"
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              transition: "opacity 1s ease-in-out",
              opacity: 1,
            }}
          />
        )}
      </div>
    );
  };

  return (
    <Box sx={{ m: { xs: 2, sm: 5 } }}>
      <ToastContainer />
      <TableContainer
        component={Paper}
        sx={{ width: "100%", overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#2c3e50" }}>
              {headers.map((header, index) => (
                <TableCell
                  key={index}
                  style={{ color: "white", minWidth: 120 }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice((page - 1) * rowsPerPage, page * rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.description
                      ? `${stripHtmlTags(row.description).slice(0, 50)}...`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {row.property_images && row.property_images.length > 0 ? (
                      <ImageCarousel images={row.property_images} />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {row.property_map && row.property_map.length > 0 ? (
                      <ImageCarousel images={row.property_map} />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {row.property_location_map &&
                    row.property_location_map.length > 0 ? (
                      <ImageCarousel images={row.property_location_map} />
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {row.property_video ? (
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          window.open(row.property_video, "_blank")
                        }
                      >
                        Watch Video
                      </Button>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>{row.price}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(row)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{
                        color: "red",
                        borderColor: "red",
                        ml: { xs: 0, sm: 1 },
                        width: "fit-content",
                      }}
                      onClick={() => handleDeleteDialogOpen(row._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" my={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
          sx={{ "& .MuiPaginationItem-root": { minWidth: { xs: 24, sm: 32 } } }}
        />
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete this property? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertiesData;

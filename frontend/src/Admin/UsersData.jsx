import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Pagination,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UsersData = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const navigate = useNavigate();

  // Define the table headers dynamically
  const headers = ["Name", "Email", "Phone", "Role", "Action"];

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/users/fetch");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (row) => {
    navigate(`/edit/users`, { state: { user: row } });
  };

  // Open dialog and set selected row for deletion
  const handleDeleteClick = (row) => {
    setSelectedRow(row);
    setOpenDialog(true);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (selectedRow) {
      try {
        const response = await axios.delete(`/api/users/${selectedRow._id}`);

        if (response.status === 200) {
          console.log("User deleted successfully!");

          // Refetch the updated data to refresh the table
          await fetchData();

          // Close the dialog and reset selectedRow
          setOpenDialog(false);
          setSelectedRow(null);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Handle pagination change
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Calculate total pages
  const totalPages = Math.ceil(rows.length / rowsPerPage);

  return (
    <Box sx={{ m: { xs: 2, sm: 5 }, overflowX: "auto" }}>
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
                  <TableCell>{row.username}</TableCell>
                  <TableCell>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${row.phone}`}>{row.phone}</a>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(row)}
                      sx={{ mb: { xs: 1, sm: 0 }, mr: { xs: 0, sm: 1 } }}
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
                      onClick={() => handleDeleteClick(row)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Component */}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} sx={{ color: "red" }} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersData;

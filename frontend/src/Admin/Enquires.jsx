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
} from "@mui/material";
import axios from "axios";

const Enquires = () => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({});

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("/api/enquiry/fetch");
      setRows(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Toggle show all / show less for a specific row
  const toggleDescription = (id) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [id]: !prevExpandedRows[id],
    }));
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
              {[
                "Serial No.",
                "Name",
                "Email",
                "Phone",
                "Description",
                "Date",
              ].map((header, index) => (
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
                <TableRow key={row._id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${row.phone}`}>{row.phone}</a>
                  </TableCell>
                  <TableCell>
                    {expandedRows[row._id] ? (
                      <>
                        {row.message}
                        <span
                          onClick={() => toggleDescription(row._id)}
                          style={{
                            color: "blue",
                            cursor: "pointer",
                            marginLeft: 4,
                          }}
                        >
                          Show Less
                        </span>
                      </>
                    ) : (
                      <>
                        {row.message.slice(0, 50)}
                        {row.message.length > 50 && (
                          <span
                            onClick={() => toggleDescription(row._id)}
                            style={{
                              color: "blue",
                              cursor: "pointer",
                              marginLeft: 4,
                            }}
                          >
                            Show All
                          </span>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(row.date_submitted).toLocaleDateString()}
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
    </Box>
  );
};

export default Enquires;

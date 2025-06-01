import React, { useEffect, useState } from "react";
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, FormGroup, FormControlLabel, Checkbox
} from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../api/config";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (e) {
      setCurrentUser(null);
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/users`);
        setUsers(res.data.data || res.data || []);
      } catch (err) {
        setError(err.message || "Failed to fetch users");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/roles`);
        setRoles(res.data.data || res.data || []);
      } catch (err) {
        setRoles([]);
      }
    };
    fetchRoles();
  }, []);

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setSelectedRoleIds(user.roles.map(r => r.id));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedRoleIds([]);
  };

  const handleRoleCheckbox = (roleId) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !selectedRoleIds.length) return;
    try {
      await axios.patch(`${API_BASE_URL}/users/role`, {
        userId: selectedUser.id,
        roleIds: selectedRoleIds,
      });
      // Refresh users list
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data.data || res.data || []);
      handleCloseDialog();
    } catch (err) {
      alert("Failed to change role");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (currentUser && currentUser.id === userId) {
      alert("You cannot delete yourself.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        Users
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Birthday</strong></TableCell>
              <TableCell><strong>Roles</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, idx) => (
              <TableRow key={user.username || idx}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>{user.birthday}</TableCell>
                <TableCell>{user.roles?.map((role) => role.name).join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenDialog(user)}
                    disabled={currentUser && currentUser.id === user.id}
                    sx={{ mr: 1 }}
                  >
                    Change Role
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={currentUser && currentUser.id === user.id}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormGroup>
              {roles.map((role) => (
                <FormControlLabel
                  key={role.id}
                  control={
                    <Checkbox
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => handleRoleCheckbox(role.id)}
                    />
                  }
                  label={role.name}
                />
              ))}
            </FormGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleChangeRole}
            disabled={!selectedRoleIds.length || (currentUser && selectedUser && currentUser.id === selectedUser.id)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UsersPage;
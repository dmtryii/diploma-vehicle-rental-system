import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, CircularProgress, Tabs, Tab, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { API_BASE_URL } from '../api/config';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = [
  "#1976d2", "#388e3c", "#fbc02d", "#d32f2f", "#7b1fa2", "#0288d1", "#ff9800", "#8bc34a", "#e91e63", "#00bcd4"
];

const chartTabs = [
  { label: "Rentals per Month" },
  { label: "Top 5 Cars" },
  { label: "Status Distribution" },
  { label: "Revenue per Month" },
  { label: "By Body/Color/Transmission" }
];

const AnalyticsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topCars, setTopCars] = useState([]);
  const [loadingTopCars, setLoadingTopCars] = useState(true);
  const [statusData, setStatusData] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [revenueData, setRevenueData] = useState([]);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  // For body type, color, transmission
  const [bodyTypeData, setBodyTypeData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [transmissionData, setTransmissionData] = useState([]);
  const [loadingBodyType, setLoadingBodyType] = useState(true);
  const [loadingColor, setLoadingColor] = useState(true);
  const [loadingTransmission, setLoadingTransmission] = useState(true);

  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);

  const { authState } = useAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        const rentals = res.data.data || [];

        // Group rentals by month
        const monthMap = {};
        rentals.forEach(rental => {
          const date = new Date(rental.startDate);
          const month = date.toLocaleString('en-US', { month: 'short' });
          monthMap[month] = (monthMap[month] || 0) + 1;
        });

        // Sort months in order
        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = monthsOrder.map(month => ({
          month,
          rentals: monthMap[month] || 0,
        }));

        setData(chartData);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [authState.token]);

  useEffect(() => {
    const fetchTopCars = async () => {
      setLoadingTopCars(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        const rentals = res.data.data || [];

        // Count rentals per car (by model and manufacturer)
        const carMap = {};
        rentals.forEach(rental => {
          const carKey = `${rental.vehicle.manufacturer?.name} ${rental.vehicle.name}`;
          carMap[carKey] = (carMap[carKey] || 0) + 1;
        });

        // Convert to array and sort
        const sortedCars = Object.entries(carMap)
          .map(([car, count]) => ({ car, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setTopCars(sortedCars);
      } catch (err) {
        setTopCars([]);
      } finally {
        setLoadingTopCars(false);
      }
    };

    fetchTopCars();
  }, [authState.token]);

  useEffect(() => {
    const fetchStatusDistribution = async () => {
      setLoadingStatus(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        const rentals = res.data.data || [];

        // Count rentals per status
        const statusMap = {};
        rentals.forEach(rental => {
          statusMap[rental.status] = (statusMap[rental.status] || 0) + 1;
        });

        const statusArr = Object.entries(statusMap).map(([status, value]) => ({
          name: status,
          value,
        }));

        setStatusData(statusArr);
      } catch (err) {
        setStatusData([]);
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchStatusDistribution();
  }, [authState.token]);

  useEffect(() => {
    const fetchRevenue = async () => {
      setLoadingRevenue(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        const rentals = res.data.data || [];

        // Group revenue by month
        const revenueMap = {};
        rentals.forEach(rental => {
          const date = new Date(rental.startDate);
          const month = date.toLocaleString('en-US', { month: 'short' });
          revenueMap[month] = (revenueMap[month] || 0) + (rental.total || 0);
        });

        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData = monthsOrder.map(month => ({
          month,
          revenue: revenueMap[month] || 0,
        }));

        setRevenueData(chartData);
      } catch (err) {
        setRevenueData([]);
      } finally {
        setLoadingRevenue(false);
      }
    };

    fetchRevenue();
  }, [authState.token]);

  useEffect(() => {
    const fetchBodyType = async () => {
      setLoadingBodyType(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        const rentals = res.data.data || [];
        const map = {};
        rentals.forEach(rental => {
          const key = rental.vehicle.bodyType || 'Unknown';
          map[key] = (map[key] || 0) + 1;
        });
        setBodyTypeData(Object.entries(map).map(([name, value]) => ({ name, value })));
      } catch {
        setBodyTypeData([]);
      } finally {
        setLoadingBodyType(false);
      }
    };
    fetchBodyType();
  }, [authState.token]);

  useEffect(() => {
    const fetchColor = async () => {
      setLoadingColor(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        const rentals = res.data.data || [];
        const map = {};
        rentals.forEach(rental => {
          const key = rental.vehicle.color || 'Unknown';
          map[key] = (map[key] || 0) + 1;
        });
        setColorData(Object.entries(map).map(([name, value]) => ({ name, value })));
      } catch {
        setColorData([]);
      } finally {
        setLoadingColor(false);
      }
    };
    fetchColor();
  }, [authState.token]);

  useEffect(() => {
    const fetchTransmission = async () => {
      setLoadingTransmission(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/rentals`, {
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        const rentals = res.data.data || [];
        const map = {};
        rentals.forEach(rental => {
          const key = rental.vehicle.transmissionType || 'Unknown';
          map[key] = (map[key] || 0) + 1;
        });
        setTransmissionData(Object.entries(map).map(([name, value]) => ({ name, value })));
      } catch {
        setTransmissionData([]);
      } finally {
        setLoadingTransmission(false);
      }
    };
    fetchTransmission();
  }, [authState.token]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rental Analytics
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Tabs value={mainTab} onChange={(_, v) => setMainTab(v)} variant="scrollable" scrollButtons="auto">
          {chartTabs.map((tab, idx) => (
            <Tab key={tab.label} label={tab.label} />
          ))}
        </Tabs>
      </Paper>
      {mainTab === 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Number of Rentals per Month
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rentals" stroke="#1976d2" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </Paper>
      )}
      {mainTab === 1 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Top 5 Most Popular Cars
          </Typography>
          {loadingTopCars ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topCars}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="car" type="category" width={180} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1976d2" name="Rentals" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Paper>
      )}
      {mainTab === 2 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Rental Status Distribution
          </Typography>
          {loadingStatus ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {statusData.map((entry, idx) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>
      )}
      {mainTab === 3 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Revenue per Month
          </Typography>
          {loadingRevenue ? (
            <CircularProgress />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={value => `$${value}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#388e3c" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Paper>
      )}
      {mainTab === 4 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Rentals by Body Type / Color / Transmission
          </Typography>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={subTab} onChange={(_, v) => setSubTab(v)}>
              <Tab label="Body Type" />
              <Tab label="Color" />
              <Tab label="Transmission" />
            </Tabs>
          </Box>
          {subTab === 0 && (
            loadingBodyType ? <CircularProgress /> :
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bodyTypeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {bodyTypeData.map((entry, idx) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          {subTab === 1 && (
            loadingColor ? <CircularProgress /> :
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={colorData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {colorData.map((entry, idx) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
          {subTab === 2 && (
            loadingTransmission ? <CircularProgress /> :
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={transmissionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {transmissionData.map((entry, idx) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default AnalyticsPage;
import React, { useEffect, useRef, useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../api/config';

const LOGS_API_URL = `${API_BASE_URL}/logs/stream`;

const LogPage = () => {
  const { authState } = useAuth();
  const [logs, setLogs] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    const eventSource = new EventSource(LOGS_API_URL, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        System Logs
      </Typography>
      <Paper sx={{ p: 2, height: 500, overflow: 'auto', background: '#111', color: '#0f0', fontFamily: 'monospace' }}>
        {logs.map((log, idx) => (
          <Box key={idx} component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap' }}>
            {log}
          </Box>
        ))}
        <div ref={logsEndRef} />
      </Paper>
    </Container>
  );
};

export default LogPage;
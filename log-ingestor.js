const express = require('express');
const bodyParser = require('body-parser');
const NodeCache = require('node-cache');

const app = express();
const nodeCache = new NodeCache();
const port = process.env.PORT || 3000;

// Sample in-memory store for logs
const logs = [
  {
    "level": "error",
    "message": "Server crash",
    "resourceId": "server-4444",
    "timestamp": "2023-09-15T10:00:00Z",
    "traceId": "aaa-bbb-444",
    "spanId": "span-555",
    "commit": "7e89d2a",
    "metadata": {
      "parentResourceId": "server-6666"
    }
  },
  {
    "level": "warning",
    "message": "Database corruption",
    "resourceId": "server-8888",
    "timestamp": "2023-09-15T10:05:00Z",
    "traceId": "ccc-ddd-888",
    "spanId": "span-999",
    "commit": "2a32c8f",
    "metadata": {
      "parentResourceId": "server-1111"
    }
  },
  {
    "level": "info",
    "message": "User registration",
    "resourceId": "server-2222",
    "timestamp": "2023-09-15T10:10:00Z",
    "traceId": "eee-fff-222",
    "spanId": "span-111",
    "commit": "9b67a1d",
    "metadata": {
      "parentResourceId": "server-3333"
    }
  },
  {
    "level": "error",
    "message": "Network congestion",
    "resourceId": "server-6666",
    "timestamp": "2023-09-15T10:15:00Z",
    "traceId": "ggg-hhh-666",
    "spanId": "span-777",
    "commit": "3c45e8b",
    "metadata": {
      "parentResourceId": "server-9999"
    }
  },
  {
    "level": "warning",
    "message": "Memory leak",
    "resourceId": "server-0000",
    "timestamp": "2023-09-15T10:20:00Z",
    "traceId": "iii-jjj-000",
    "spanId": "span-111",
    "commit": "5f21g6t",
    "metadata": {
      "parentResourceId": "server-2222"
    }
  },
  {
    "level": "info",
    "message": "Task in progress",
    "resourceId": "server-3333",
    "timestamp": "2023-09-15T10:25:00Z",
    "traceId": "kkk-lll-333",
    "spanId": "span-444",
    "commit": "8d92h4v",
    "metadata": {
      "parentResourceId": "server-4444"
    }
  },
  {
    "level": "error",
    "message": "Invalid request",
    "resourceId": "server-5555",
    "timestamp": "2023-09-15T10:30:00Z",
    "traceId": "mmm-nnn-555",
    "spanId": "span-666",
    "commit": "1a23b6e",
    "metadata": {
      "parentResourceId": "server-7777"
    }
  },
  {
    "level": "warning",
    "message": "Data loss detected",
    "resourceId": "server-7777",
    "timestamp": "2023-09-15T10:35:00Z",
    "traceId": "ooo-ppp-777",
    "spanId": "span-888",
    "commit": "6g56t2z",
    "metadata": {
      "parentResourceId": "server-1111"
    }
  },
  {
    "level": "info",
    "message": "API call successful",
    "resourceId": "server-9999",
    "timestamp": "2023-09-15T10:40:00Z",
    "traceId": "qqq-rrr-999",
    "spanId": "span-000",
    "commit": "2d23h5v",
    "metadata": {
      "parentResourceId": "server-3333"
    }
  },
  {
    "level": "error",
    "message": "Connection timeout",
    "resourceId": "server-1111",
    "timestamp": "2023-09-15T09:00:00Z",
    "traceId": "aaa-bbb-111",
    "spanId": "span-222",
    "commit": "7e89d2a",
    "metadata": {
      "parentResourceId": "server-3333"
    }
  },
  {
    "level": "warning",
    "message": "Invalid input",
    "resourceId": "server-4444",
    "timestamp": "2023-09-15T09:05:00Z",
    "traceId": "ccc-ddd-444",
    "spanId": "span-555",
    "commit": "2a32c8f",
    "metadata": {
      "parentResourceId": "server-5555"
    }
  },
  {
    "level": "info",
    "message": "Data processing completed",
    "resourceId": "server-6666",
    "timestamp": "2023-09-15T09:10:00Z",
    "traceId": "eee-fff-666",
    "spanId": "span-777",
    "commit": "9b67a1d",
    "metadata": {
      "parentResourceId": "server-7777"
    }
  },
  {
    "level": "error",
    "message": "Authentication failed",
    "resourceId": "server-8888",
    "timestamp": "2023-09-15T09:15:00Z",
    "traceId": "ggg-hhh-888",
    "spanId": "span-999",
    "commit": "3c45e8b",
    "metadata": {
      "parentResourceId": "server-9999"
    }
  },
  {
    "level": "warning",
    "message": "Server overload",
    "resourceId": "server-0000",
    "timestamp": "2023-09-15T09:20:00Z",
    "traceId": "iii-jjj-000",
    "spanId": "span-111",
    "commit": "5f21g6t",
    "metadata": {
      "parentResourceId": "server-1111"
    }
  },
  {
    "level": "info",
    "message": "Task completed successfully",
    "resourceId": "server-2222",
    "timestamp": "2023-09-15T09:25:00Z",
    "traceId": "kkk-lll-222",
    "spanId": "span-333",
    "commit": "8d92h4v",
    "metadata": {
      "parentResourceId": "server-3333"
    }
  },
  {
    "level": "error",
    "message": "File not found",
    "resourceId": "server-3333",
    "timestamp": "2023-09-15T09:30:00Z",
    "traceId": "mmm-nnn-333",
    "spanId": "span-444",
    "commit": "1a23b6e",
    "metadata": {
      "parentResourceId": "server-4444"
    }
  },
  {
    "level": "warning",
    "message": "Unexpected error",
    "resourceId": "server-5555",
    "timestamp": "2023-09-15T09:35:00Z",
    "traceId": "ooo-ppp-555",
    "spanId": "span-666",
    "commit": "6g56t2z",
    "metadata": {
      "parentResourceId": "server-6666"
    }
  },
  {
    "level": "info",
    "message": "Data backup completed",
    "resourceId": "server-7777",
    "timestamp": "2023-09-15T09:40:00Z",
    "traceId": "qqq-rrr-777",
    "spanId": "span-888",
    "commit": "2d23h5v",
    "metadata": {
      "parentResourceId": "server-8888"
    }
  },
  {
    "level": "error",
    "message": "Invalid credentials",
    "resourceId": "server-9999",
    "timestamp": "2023-09-15T09:45:00Z",
    "traceId": "sss-ttt-999",
    "spanId": "span-000",
    "commit": "4yf8t1e",
    "metadata": {
      "parentResourceId": "server-0000"
    }
  },
  {
    "level": "warning",
    "message": "Security breach detected",
    "resourceId": "server-1111",
    "timestamp": "2023-09-15T09:50:00Z",
    "traceId": "uuu-vvv-111",
    "spanId": "span-222",
    "commit": "1b45c7f",
    "metadata": {
      "parentResourceId": "server-2222"
    }
  }, {
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  },
  {
    "level": "warning",
    "message": "Network timeout",
    "resourceId": "server-5678",
    "timestamp": "2023-09-15T08:05:00Z",
    "traceId": "def-uvw-456",
    "spanId": "span-789",
    "commit": "7a82e1c",
    "metadata": {
      "parentResourceId": "server-5432"
    }
  },
  {
    "level": "info",
    "message": "Request received",
    "resourceId": "server-9012",
    "timestamp": "2023-09-15T08:10:00Z",
    "traceId": "ghi-rst-789",
    "spanId": "span-012",
    "commit": "3b91a7d",
    "metadata": {
      "parentResourceId": "server-3456"
    }
  },
  {
    "level": "error",
    "message": "Database query failed",
    "resourceId": "server-3456",
    "timestamp": "2023-09-15T08:15:00Z",
    "traceId": "jkl-mno-012",
    "spanId": "span-345",
    "commit": "9c24b6e",
    "metadata": {
      "parentResourceId": "server-7890"
    }
  },
  {
    "level": "warning",
    "message": "Insufficient memory",
    "resourceId": "server-7890",
    "timestamp": "2023-09-15T08:20:00Z",
    "traceId": "pqr-stu-345",
    "spanId": "span-678",
    "commit": "1f34d8a",
    "metadata": {
      "parentResourceId": "server-1234"
    }
  },
  {
    "level": "info",
    "message": "User login successful",
    "resourceId": "server-2345",
    "timestamp": "2023-09-15T08:25:00Z",
    "traceId": "vwx-yza-678",
    "spanId": "span-901",
    "commit": "6g56t2z",
    "metadata": {
      "parentResourceId": "server-9012"
    }
  },
  {
    "level": "error",
    "message": "Critical system error",
    "resourceId": "server-6789",
    "timestamp": "2023-09-15T08:30:00Z",
    "traceId": "bcd-efg-901",
    "spanId": "span-234",
    "commit": "2d23h5v",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  },
  {
    "level": "warning",
    "message": "Disk space running low",
    "resourceId": "server-0123",
    "timestamp": "2023-09-15T08:35:00Z",
    "traceId": "xyz-abc-234",
    "spanId": "span-567",
    "commit": "8e67f1k",
    "metadata": {
      "parentResourceId": "server-2345"
    }
  },
  {
    "level": "info",
    "message": "File upload completed",
    "resourceId": "server-4567",
    "timestamp": "2023-09-15T08:40:00Z",
    "traceId": "lmn-opq-567",
    "spanId": "span-890",
    "commit": "4yf8t1e",
    "metadata": {
      "parentResourceId": "server-6789"
    }
  },
  {
    "level": "error",
    "message": "Service unavailable",
    "resourceId": "server-8901",
    "timestamp": "2023-09-15T08:45:00Z",
    "traceId": "rst-uvw-890",
    "spanId": "span-234",
    "commit": "1b45c7f",
    "metadata": {
      "parentResourceId": "server-0123"
    }
  }, {
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
      "parentResourceId": "server-0987"
    }
  },
  {
    "level": "info",
    "message": "Request processed successfully",
    "resourceId": "server-5678",
    "timestamp": "2023-09-15T09:00:00Z",
    "traceId": "def-uvw-456",
    "spanId": "span-789",
    "commit": "7a8321b",
    "metadata": {
      "parentResourceId": "server-6543"
    }
  },
  {
    "level": "warning",
    "message": "High CPU usage detected",
    "resourceId": "server-9012",
    "timestamp": "2023-09-15T10:00:00Z",
    "traceId": "ghi-pqr-789",
    "spanId": "span-012",
    "commit": "3c4512d",
    "metadata": {
      "parentResourceId": "server-3456"
    }
  },
  {
    "level": "error",
    "message": "File not found",
    "resourceId": "server-3456",
    "timestamp": "2023-09-15T11:00:00Z",
    "traceId": "jkl-mno-012",
    "spanId": "span-345",
    "commit": "9f8765a",
    "metadata": {
      "parentResourceId": "server-7890"
    }
  },
  {
    "level": "info",
    "message": "User logged in",
    "resourceId": "server-7890",
    "timestamp": "2023-09-15T12:00:00Z",
    "traceId": "pqs-rst-345",
    "spanId": "span-678",
    "commit": "1b2345c",
    "metadata": {
      "parentResourceId": "server-9012"
    }
  },
  {
    "level": "warning",
    "message": "Database connection timeout",
    "resourceId": "server-6543",
    "timestamp": "2023-09-15T13:00:00Z",
    "traceId": "uvw-xyz-678",
    "spanId": "span-901",
    "commit": "8d7654e",
    "metadata": {
      "parentResourceId": "server-5678"
    }
  },
  {
    "level": "error",
    "message": "Invalid request format",
    "resourceId": "server-0987",
    "timestamp": "2023-09-15T14:00:00Z",
    "traceId": "xyz-abc-901",
    "spanId": "span-234",
    "commit": "2a3456b",
    "metadata": {
      "parentResourceId": "server-1234"
    }
  },
  {
    "level": "info",
    "message": "Data processing completed",
    "resourceId": "server-4321",
    "timestamp": "2023-09-15T15:00:00Z",
    "traceId": "bcd-def-234",
    "spanId": "span-567",
    "commit": "6c7890d",
    "metadata": {
      "parentResourceId": "server-4321"
    }
  },
  {
    "level": "warning",
    "message": "Memory usage exceeded threshold",
    "resourceId": "server-7654",
    "timestamp": "2023-09-15T16:00:00Z",
    "traceId": "efg-hij-567",
    "spanId": "span-890",
    "commit": "4e5678f",
    "metadata": {
      "parentResourceId": "server-7654"
    }
  },
  {
    "level": "error",
    "message": "Network connection lost",
    "resourceId": "server-2345",
    "timestamp": "2023-09-15T17:00:00Z",
    "traceId": "hij-klm-890",
    "spanId": "span-123",
    "commit": "0a9876b",
    "metadata": {
      "parentResourceId": "server-2345"
    }
  }
]; // (your logs array remains unchanged)

// Cache logs
nodeCache.set('logs', logs);

app.use(bodyParser.json());

// Enable CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/', (req, res) => {
  res.send(`<h1>Welcome to our API</h1>`);
})

// GET endpoint to retrieve all logs
app.get('/logs', (req, res) => {
  try {
    const cachedLogs = nodeCache.get('logs');

    if (!cachedLogs || cachedLogs.length === 0) {
      return res.status(404).json({ error: 'Logs not found' });
    }

    res.status(200).json(cachedLogs);
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Log ingestion endpoint
app.post('/ingest', (req, res) => {
  const logData = req.body;

  // Update cached logs
  const cachedLogs = nodeCache.get('logs') || [];
  cachedLogs.push(logData);
  nodeCache.set('logs', cachedLogs);

  console.log('Logs after ingestion:', cachedLogs);
  res.status(200).send('Log ingested successfully');
});

// Search endpoint
app.post('/search', (req, res) => {
  const query = req.body.query;

  // Retrieve logs from cache
  const cachedLogs = nodeCache.get('logs') || [];

  // Perform a simple case-insensitive search on all fields
  const searchResults = cachedLogs.filter((log) =>
    Object.values(log).some(
      (value) =>
        typeof value === 'string' && value.toLowerCase().includes(query.toLowerCase())
    )
  );

  console.log('Search results:', searchResults);
  res.status(200).json(searchResults);
});

app.listen(port, () => {
  console.log(`Log Ingestor listening at http://localhost:${port}`);
});

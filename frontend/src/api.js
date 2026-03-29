import axios from 'axios';

const API_BASE = 'http://localhost:5000';

export async function generateTests(url, method, body) {
  let parsedBody = undefined;
  if (body) {
    try {
      if(typeof body === 'string') parsedBody = JSON.parse(body);
      else parsedBody = body;
    } catch (e) {
      // If not valid JSON, send as string
      parsedBody = body;
    }
  }

  const response = await axios.post(`${API_BASE}/generate-tests`, { url, method, body: parsedBody });
  return response.data;
}

export async function runTests(url, method, testCases) {
  const response = await axios.post(`${API_BASE}/run-tests`, { url, method, testCases });
  return response.data;
}

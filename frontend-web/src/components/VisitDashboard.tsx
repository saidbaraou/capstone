import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface Visit {
  id: string; // UUID backend UUID
  visitor_full_name: string;
  visitor_email: string;
  visitor_company: string;
  host: number;
  host_name: string;
  host_email: string;
  planned_arrival: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'PENDING' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED';
  purpose_of_visit: string;
  safety_instructions_signed: boolean;
  nda_accepted: boolean;
}

const VisitsDashboard: React.FC = () => {
  // On type nos states avec l'interface Visit
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Define the API base URL using the environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL + 'visits/';


  useEffect(() => {
    const fetchVisits = async (): Promise<void> => {
      try {
        const response = await axios.get<Visit[]>(API_BASE_URL);
        setVisits(response.data); 
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.message || "Failed to fetch visits.";
  setError(`${errorMessage} Please try again later.`);
      }finally {
        setLoading(false);
      }
    }

    fetchVisits();
  }, []);

  const handleCheckIn = async (visitId: string): Promise<void> => {
    try {

      const response = await axios.post(`${API_BASE_URL}${visitId}/check-in/`);

      setVisits(prevVisits => 
        prevVisits.map(v => v.id === visitId ? response.data : v)
      );
    } catch (err: any) {
      alert("Error during check-in: " + (err.response?.data?.detail || "Unknown error"));
    }
  };

  const handleCheckOut = async (visitId: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}${visitId}/check-out/`);
    setVisits(prevVisits => 
      prevVisits.map(v => v.id === visitId ? response.data : v)
    );
  } catch (err: any) {
    alert("Error during check-out: " + (err.response?.data?.detail || "Unknown error"));
  }   
};

  if (loading) return <p>Loading visitors...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Visitor Management Dashboard</h2>
      <table border={1} cellPadding={10} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>Visitor Name</th>
            <th>Company</th>
            <th>Host (Employee)</th>
            <th>Status</th>
            <th>Planned Arrival</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visits.map((visit) => (
            <tr key={visit.id}>
              <td><strong>{visit.visitor_full_name}</strong></td>
              <td>{visit.visitor_company || 'N/A'}</td>
              <td>{visit.host_name}</td>
              <td>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  backgroundColor: visit.status === 'CHECKED_IN' ? '#d4edda' : '#fff3cd',
                  color: visit.status === 'CHECKED_IN' ? '#155724' : '#856404'
                }}>
                  {visit.status}
                </span>
              </td>
              <td>{new Date(visit.planned_arrival).toLocaleString()}</td>
              <td>
                {visit.status === 'PENDING' && (
                  <button onClick={() => handleCheckIn(visit.id)}>
                    Check In
                  </button>
                )}
                {visit.status === 'CHECKED_IN' && <span>On site</span>}
                <button onClick={() => handleCheckOut(visit.id)}
                style={{ color: 'red', cursor: 'pointer' }}>
                    Check Out
                  </button>
                {visit.status === 'CHECKED_OUT' && <span style={{ color: '#6c757d' }}>Left</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};




export default VisitsDashboard;

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

  // States to show/hide the form and manage its data
  const [showForm, setShowForm] = useState<boolean>(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [purpose, setPurpose] = useState('');

  // Define the API base URL using the environment variable
  const API_BASE_URL = 'http://localhost:8000/api/visits/';


  useEffect(() => {
    const fetchVisits = async (): Promise<void> => {
      try {
        const response = await axios.get<Visit[]>(API_BASE_URL);
        setVisits(response.data); 
       
        console.log("API received data :", response.data);
      } catch (err: unknown) {
        let errorMessage = "Failed to fetch visits.";
        if(axios.isAxiosError(err)){
          errorMessage = err.response?.data?.detail || err.message || errorMessage;
        } else if ( err instanceof Error) {
          errorMessage = err.message;
        }
      setError(`${errorMessage} Please try again later.`);
          }finally {
            setLoading(false);
          }
        }
    fetchVisits();
  }, [API_BASE_URL]);

  const handleCheckIn = async (visitId: string): Promise<void> => {
    try {

      const response = await axios.post(`${API_BASE_URL}${visitId}/check-in/`);

      setVisits(prevVisits => 
        prevVisits.map(v => v.id === visitId ? response.data : v)
      );
    } catch (err: unknown) {
      const apiMessage = axios.isAxiosError(err) ? err.response?.data?.detail || "Unknown error" : "An unexpected error occured.";
      alert("Error during check-in: " + (apiMessage));
    }
  };

  const handleCheckOut = async (visitId: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}${visitId}/check-out/`);
    setVisits(prevVisits => 
      prevVisits.map(v => v.id === visitId ? response.data : v)
    );
  } catch (err: unknown) {
    const apiMessage = axios.isAxiosError(err) 
        ? err.response?.data?.detail || "Unknown error" 
        : "An unexpected error occurred";
      alert("Error during check-out: " + apiMessage);
  }   
};

const handleCreateVisit = async (e: React.FormEvent): Promise<void> => {
  e.preventDefault();
  try {
    const newVisitData = {
      visitor_first_name: firstName,
      visitor_last_name: lastName,
      visitor_email: email,
      visitor_company: company,
      purpose_of_visit: purpose,
      host: 1, // Assuming the host ID is 1 for this example. Adjust as necessary.
      planned_arrival: new Date().toISOString(),
    };
    const response = await axios.post(API_BASE_URL, newVisitData);

    setVisits(prevVisits => [response.data, ...prevVisits]);

    // Reset form fields
    setFirstName('');
    setLastName('');
    setEmail('');
    setCompany('');
    setPurpose('');
    setShowForm(false);
  } catch (err: unknown) {
      const apiMessage = axios.isAxiosError(err) ? err.response?.data?.detail || "Failed to create visit" : "An error occurred";
      alert(apiMessage);
    }
}

  if (loading) return <p>Loading visitors...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Visitor Management Dashboard</h2>
        <button 
          onClick={() => setShowForm(!showForm)} 
          style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {showForm ? '✖ Close Form' : '➕ Add New Visitor'}
        </button>
      </div>

      {/* conditional form */}
      {showForm && (
        <form onSubmit={handleCreateVisit} style={{ margin: '0 auto 30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', backgroundColor: '#f9f9f9', maxWidth: '500px' }}>
          <h3>New Visitor Registration</h3>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Company (Optional):</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Purpose of Visit:</label>
            <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Register & Save
          </button>
        </form>
      )}

      {/* Visits table */}
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
                  backgroundColor: visit.status === 'CHECKED_IN' ? '#d4edda' : visit.status === 'CHECKED_OUT' ? '#e2e3e5' : '#fff3cd',
                  color: visit.status === 'CHECKED_IN' ? '#155724' : visit.status === 'CHECKED_OUT' ? '#383d41' : '#856404'
                }}>
                  {visit.status}
                </span>
              </td>
              <td>{new Date(visit.planned_arrival).toLocaleString()}</td>
              <td>
                {visit.status === 'PENDING' && (
                  <button onClick={() => handleCheckIn(visit.id)}>Check In</button>
                )}
                {visit.status === 'CHECKED_IN' && (
                  <button onClick={() => handleCheckOut(visit.id)} style={{ color: 'red', cursor: 'pointer' }}>Check Out</button>
                )}
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

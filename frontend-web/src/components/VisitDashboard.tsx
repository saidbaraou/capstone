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
          {showForm ? '✖ Close Form' : 'Add New Visitor'}
        </button>
      </div>

      {/* conditional form */}
      {showForm && (
  <form 
    onSubmit={handleCreateVisit} 
    className="w-[80%] mx-auto mb-9 p-[30px] bg-white rounded-2xl shadow-sm border border-gray-200 box-border"
  >
    <h3 className="text-center mt-0 mb-6 text-slate-800 text-xl font-semibold">
      New Visitor Registration
    </h3>

    {/* First Name */}
    <div className="flex flex-col items-start mb-4 w-full">
      <label htmlFor="firstName" className="text-sm font-semibold text-slate-600 mb-1.5 text-left">
        First Name
      </label>
      <input
        id="firstName"
        type="text"
        className="w-full px-4 py-2.5 text-base border-1.5 border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        required
      />
    </div>

    {/* Last Name */}
    <div className="flex flex-col items-start mb-4 w-full">
      <label htmlFor="lastName" className="text-sm font-semibold text-slate-600 mb-1.5 text-left">
        Last Name
      </label>
      <input
        id="lastName"
        type="text"
        className="w-full px-4 py-2.5 text-base border-1.5 border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        required
      />
    </div>

    {/* Email Address */}
    <div className="flex flex-col items-start mb-4 w-full">
      <label htmlFor="email" className="text-sm font-semibold text-slate-600 mb-1.5 text-left">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        className="w-full px-4 py-2.5 text-base border-1.5 border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
    </div>

    {/* Company */}
    <div className="flex flex-col items-start mb-4 w-full">
      <label htmlFor="company" className="text-sm font-semibold text-slate-600 mb-1.5 text-left">
        Company (Optional)
      </label>
      <input
        id="company"
        type="text"
        className="w-full px-4 py-2.5 text-base border-1.5 border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
        value={company}
        onChange={e => setCompany(e.target.value)}
      />
    </div>

    {/* Purpose of Visit */}
    <div className="flex flex-col items-start mb-4 w-full">
      <label htmlFor="purpose" className="text-sm font-semibold text-slate-600 mb-1.5 text-left">
        Purpose of Visit
      </label>
      <input
        id="purpose"
        type="text"
        className="w-full px-4 py-2.5 text-base border-1.5 border-slate-200 rounded-xl bg-slate-50 text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 box-border"
        value={purpose}
        onChange={e => setPurpose(e.target.value)}
        required
      />
    </div>

    {/* Submit Button */}
    <div className="flex justify-center mt-6 w-full">
      <button 
        type="submit" 
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-base cursor-pointer transition-all duration-150 border-none"
      >
        Register & Save
      </button>
    </div>
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

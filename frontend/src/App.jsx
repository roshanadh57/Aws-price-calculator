import { useState } from 'react';
import './App.css'; // Import the external CSS

function App() {
  const [formData, setFormData] = useState({
    project_name: '',
    usage_type: 'BoxUsage:t3.medium',
    amount: 730
  });
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update this with your actual diagram generator URL
  const diagramAppUrl = "https://your-diagram-generator-link.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setLink('');

    try {
      const response = await fetch('http://127.0.0.1:8000/generate-estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setLink(data.url);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Backend not responding. Is the Python server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2 className="header">AWS Pricing Calculator</h2>

        <form onSubmit={handleSubmit} className="form">
          <label>Project Name:</label>
          <input 
            className="input-field"
            type="text" 
            placeholder="e.g. My Website Project" 
            onChange={e => setFormData({...formData, project_name: e.target.value})} 
            required 
          />

          <label>EC2 Instance Type:</label>
          <input 
            className="input-field"
            type="text" 
            value={formData.usage_type}
            onChange={e => setFormData({...formData, usage_type: e.target.value})} 
          />

          <label>Monthly Hours:</label>
          <input 
            className="input-field"
            type="number" 
            value={formData.amount} 
            onChange={e => setFormData({...formData, amount: e.target.value})} 
          />

          <button disabled={loading} className="btn-generate">
            {loading ? "Creating Estimate..." : "Generate AWS Estimate Link"}
          </button>
        </form>

        {error && <div className="error-msg">{error}</div>}

        {link && (
          <div className="result-box">
            <p className="success-text">✅ Estimate Created Successfully!</p>
            <a href={link} target="_blank" rel="noreferrer" className="console-link">
              Open AWS Cost Console
            </a>
            
            <div className="divider"></div>
            
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    project_name: '',
    usage_type: 'BoxUsage:t3.medium',
    amount: 730
  });
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const diagramAppUrl = "https://your-diagram-generator-link.com"; // <-- PUT YOUR OTHER APP LINK HERE

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
      if (data.success) setLink(data.url);
      else setError(data.error);
    } catch (err) {
      setError("Backend not responding. Is the Python server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>AWS Pricing Calculator</h2>
      

      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Project Name (Auto-cleaned for AWS):</label>
        <input 
          style={styles.input}
          type="text" 
          placeholder="e.g. My Demo Project" 
          onChange={e => setFormData({...formData, project_name: e.target.value})} 
          required 
        />

        <label>EC2 Instance Type (Usage Type):</label>
        <input 
          style={styles.input}
          type="text" 
          value={formData.usage_type}
          onChange={e => setFormData({...formData, usage_type: e.target.value})} 
        />

        <label>Monthly Hours:</label>
        <input 
          style={styles.input}
          type="number" 
          value={formData.amount} 
          onChange={e => setFormData({...formData, amount: e.target.value})} 
        />

        <button disabled={loading} style={styles.button}>
          {loading ? "Creating..." : "Generate AWS Estimate Link"}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      {link && (
        <div style={styles.resultBox}>
          <p style={styles.successText}>✅ Estimate Created Successfully!</p>
          <a href={link} target="_blank" rel="noreferrer" style={styles.link}>
            Open AWS Cost Console
          </a>
          
          <div style={styles.divider}></div>
          
          {/* <p style={{fontSize: '14px', marginBottom: '10px'}}>Ready to visualize this architecture?</p>
          <a href={diagramAppUrl} target="_blank" rel="noreferrer" style={styles.secondaryButton}>
             Go to Architecture Diagram Generator →
          </a> */}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: '500px', margin: '40px auto', fontFamily: 'Segoe UI, sans-serif', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backgroundColor: '#fff' },
  header: { color: '#FF9900', textAlign: 'center', marginBottom: '5px' },
  subtext: { textAlign: 'center', color: '#666', fontSize: '14px', marginBottom: '25px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '12px', background: '#FF9900', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  error: { color: 'red', fontSize: '12px', marginTop: '10px', background: '#fff5f5', padding: '10px', borderRadius: '5px' },
  resultBox: { marginTop: '20px', padding: '20px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' },
  successText: { color: '#0369a1', fontWeight: 'bold', marginBottom: '10px' },
  link: { color: '#0284c7', textDecoration: 'underline', wordBreak: 'break-all' },
  divider: { height: '1px', background: '#bae6fd', margin: '20px 0' },
  secondaryButton: { display: 'block', textAlign: 'center', background: '#0284c7', color: 'white', padding: '10px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }
};

export default App;
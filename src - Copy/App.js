import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function ContractCard({ contract }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2 style={{ margin: '0 0 0.25rem 0' }}>{contract.vendor}</h2>

      <p style={{ margin: '0.25rem 0' }}>
        <strong>Contract #:</strong> {contract.contract_number}
      </p>
      <p style={{ margin: '0.25rem 0' }}>
        <strong>Term:</strong> {contract.term} ({contract.start_year}–{contract.end_year})
      </p>
      <p style={{ margin: '0.25rem 0' }}>
        <strong>Amount:</strong> ${contract.total_value_clean?.toLocaleString()}
      </p>
      <p style={{ margin: '0.25rem 0' }}>
        <strong>Category:</strong> {contract.contract_category}
      </p>
      <p style={{ margin: '0.25rem 0' }}>
        <strong>Red Flags:</strong>{' '}
        {contract.red_flags && contract.red_flags.length > 0
          ? contract.red_flags.join(', ')
          : 'None'}
      </p>

      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          marginTop: '0.75rem',
          background: '#0066cc',
          color: '#fff',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {expanded ? 'Hide Details' : 'Show More'}
      </button>

      {expanded && (
        <div style={{ marginTop: '1rem' }}>
          <p>
            <strong>Purpose:</strong><br />
            <span style={{ fontSize: '0.95rem', color: '#444' }}>{contract.purpose}</span>
          </p>
          <p>
            <strong>Accountability Questions:</strong><br />
            <span style={{ fontSize: '0.95rem', color: '#444' }}>{contract.accountability_questions || '—'}</span>
          </p>
          <p>
            <strong>Amendments Summary:</strong><br />
            <span style={{ fontSize: '0.95rem', color: '#444' }}>{contract.amendments_summary || '—'}</span>
          </p>
          <p>
            <strong>Equity / Trauma Notes:</strong><br />
            <span style={{ fontSize: '0.95rem', color: '#444' }}>{contract.trauma_equity_notes || '—'}</span>
          </p>
          <p>
            <strong>Funding Source:</strong><br />
            <span style={{ fontSize: '0.95rem', color: '#444' }}>{contract.funding_source || '—'}</span>
          </p>
          {contract.testimony_link && (
            <p style={{ marginTop: '0.75rem' }}>
              <a href={contract.testimony_link} target="_blank" rel="noopener noreferrer">
                🔗 View Related Testimony
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [contracts, setContracts] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [selectedFlag, setSelectedFlag] = useState('All');
  
  const [sortAscending, setSortAscending] = useState(false); // false = highest first

  useEffect(() => {
    async function fetchContracts() {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('total_value_clean', { ascending: false });

      if (error) {
        console.error('Error fetching contracts:', error);
      } else {
        setContracts(data);
      }
    }

    fetchContracts();
  }, []);

	const filteredContracts = contracts
  .filter((contract) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      contract.vendor?.toLowerCase().includes(term) ||
      contract.purpose?.toLowerCase().includes(term) ||
      contract.contract_category?.toLowerCase().includes(term) ||
      contract.accountability_questions?.toLowerCase().includes(term) ||
      contract.amendments_summary?.toLowerCase().includes(term) ||
      contract.equity_trauma_notes?.toLowerCase().includes(term) ||
      contract.funding_source?.toLowerCase().includes(term) ||
      (contract.red_flags || []).join(', ').toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === 'All' || contract.contract_category === selectedCategory;

    const matchesFlag =
      selectedFlag === 'All' ||
      (contract.red_flags || []).includes(selectedFlag);

    return matchesSearch && matchesCategory && matchesFlag;
  })
  .sort((a, b) => {
    const aVal = a.total_value_clean || 0;
    const bVal = b.total_value_clean || 0;
    return sortAscending ? aVal - bVal : bVal - aVal;
  });


  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ marginBottom: '2rem' }}>🧾 OPHS Contract Explorer</h1>
	  
	<div style={{ marginBottom: '2rem' }}>
	  <button
		onClick={() => setSortAscending(!sortAscending)}
		style={{
		  padding: '0.5rem 1rem',
		  fontSize: '1rem',
		  borderRadius: '5px',
		  border: '1px solid #ccc',
		  backgroundColor: '#fff',
		  cursor: 'pointer',
		}}
	  >
		Sort by Amount: {sortAscending ? 'Low → High' : 'High → Low'}
	  </button>
	</div>

	<input
	  type="text"
	  placeholder="Search contracts..."
	  value={searchTerm}
	  onChange={(e) => setSearchTerm(e.target.value)}
	  style={{
		padding: '0.5rem',
		fontSize: '1rem',
		marginBottom: '2rem',
		width: '100%',
		maxWidth: '600px',
		borderRadius: '5px',
		border: '1px solid #ccc',
	  }}
	/>
	
    <div style={{ marginBottom: '2rem' }}>
	  <label htmlFor="categoryFilter" style={{ marginRight: '1rem', fontWeight: 'bold' }}>
		Filter by Category:
	  </label>
	  <select
		id="categoryFilter"
		value={selectedCategory}
		onChange={(e) => setSelectedCategory(e.target.value)}
		style={{
		  padding: '0.5rem',
		  fontSize: '1rem',
		  borderRadius: '5px',
		  border: '1px solid #ccc',
		}}
	  >
		<option value="All">All</option>
		<option value="Housing">Housing</option>
		<option value="Legal Aid">Legal Aid</option>
		<option value="Mental Health">Mental Health</option>
		<option value="Violence Prevention">Violence Prevention</option>
		<option value="Training">Training</option>
		<option value="Other">Other</option>
	  </select>
	</div>
	<div style={{ marginBottom: '2rem' }}>
	  <label htmlFor="flagFilter" style={{ marginRight: '1rem', fontWeight: 'bold' }}>
		Filter by Red Flag:
	  </label>
	  <select
		id="flagFilter"
		value={selectedFlag}
		onChange={(e) => setSelectedFlag(e.target.value)}
		style={{
		  padding: '0.5rem',
		  fontSize: '1rem',
		  borderRadius: '5px',
		  border: '1px solid #ccc',
		}}
	  >
		<option value="All">All</option>
		<option value="Conditional Care">Conditional Care</option>
		<option value="Trauma-Indifferent">Trauma-Indifferent</option>
		<option value="No Oversight">No Oversight</option>
		<option value="No Community Input">No Community Input</option>
	  </select>
	</div>


			{filteredContracts.map((contract) => (
			  <ContractCard key={contract.contract_number} contract={contract} />
			))}
			  </div>
		  );
		}


export default App;

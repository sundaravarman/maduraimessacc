import React, { useState } from 'react';

// --- STYLES ---
const styles = {
  container: { padding: '20px 40px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f9', minHeight: '100vh' },
  header: { color: '#333', textAlign: 'center', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px' },
  // UPDATED: Adjusted summary box for more items
  summaryBox: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allow items to wrap on smaller screens
    gap: '30px', // Adjusted gap
    marginBottom: '25px',
    padding: '15px 20px',
    backgroundColor: '#e9ecef',
    borderRadius: '8px',
    maxWidth: '960px', // Increased width
    margin: '0 auto 25px auto',
  },
  summaryItem: { textAlign: 'center', fontSize: '18px' },
  summaryLabel: { display: 'block', color: '#6c757d', fontSize: '14px', marginBottom: '5px', textTransform: 'uppercase' },
  summaryValue: { fontWeight: 'bold' },
  profit: { color: '#28a745' },
  loss: { color: '#dc3545' },
  tableContainer: { maxHeight: '60vh', overflowY: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' },
  table: { width: '100%', maxWidth: '960px', margin: '0 auto', borderCollapse: 'collapse' },
  th: { position: 'sticky', top: 0, backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', padding: '12px 15px', textAlign: 'left', textTransform: 'uppercase', zIndex: 10, verticalAlign: 'top' },
  searchInput: { width: '95%', padding: '6px 8px', marginTop: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' },
  tdStatic: { padding: '12px 15px', color: '#333', borderBottom: '1px solid #ddd' },
  tdEditable: { padding: '8px 15px', textAlign: 'right', borderBottom: '1px solid #ddd' },
  tdStaticNumber: { padding: '12px 15px', borderBottom: '1px solid #ddd' },
  input: { width: '100px', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', textAlign: 'right', fontFamily: 'monospace' },
  select: { width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px', backgroundColor: 'white' },
  trEven: { backgroundColor: '#ffffff' },
  trOdd: { backgroundColor: '#f9f9f9' },
};

// --- DATA & OPTIONS ---
const paymentModes = ['Cash', 'Online'];
const initialData = [
  { id: 1, description: 'Cash Carry Forward', sales: '0', expense: '0', paymentMode: 'Cash' },
  { id: 2, description: 'Online Cash Carry Forward', sales: '0', expense: '0', paymentMode: 'Online' },
  { id: 3, description: 'Online Sales', sales: '0', expense: '0', paymentMode: 'Online' },
  { id: 4, description: 'Cash Sales', sales: '0', expense: '0', paymentMode: 'Cash' },
  { id: 5, description: 'Royal Mart', sales: '0', expense: '1250', paymentMode: 'Online' },
  { id: 6, description: 'Gas Cylinder', sales: '0', expense: '950', paymentMode: 'Online' },
  { id: 7, description: 'Non Veg shop', sales: '0', expense: '560', paymentMode: 'Cash' },
  { id: 8, description: 'Vegetable shop', sales: '0', expense: '340', paymentMode: 'Cash' },
  { id: 9, description: 'Water', sales: '0', expense: '150', paymentMode: 'Cash' },
  { id: 10, description: 'Cover', sales: '0', expense: '20', paymentMode: 'Cash' },
  { id: 11, description: 'Curd', sales: '0', expense: '45', paymentMode: 'Cash' },
  { id: 12, description: 'Tea', sales: '0', expense: '80', paymentMode: 'Cash' },
  { id: 13, description: 'Lemon', sales: '0', expense: '30', paymentMode: 'Cash' },
  { id: 14, description: 'Idiyapam', sales: '0', expense: '60', paymentMode: 'Cash' },
  { id: 15, description: 'Coconut', sales: '0', expense: '55', paymentMode: 'Cash' },
  { id: 16, description: 'Egg', sales: '0', expense: '72', paymentMode: 'Online' },
  { id: 17, description: 'Leaf', sales: '0', expense: '15', paymentMode: 'Cash' },
];

// --- REACT COMPONENT ---
function App() {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (id, field, value) => {
    if (field === 'sales' || field === 'expense') {
      const validNumberRegex = /^[0-9]*\.?[0-9]*$/;
      if (!validNumberRegex.test(value)) { return; }
    }
    const updatedData = data.map(item => item.id === id ? { ...item, [field]: value } : item );
    setData(updatedData);
  };
  
  const formatCurrency = (number) => {
    return number.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 });
  };
  
  // Filtered data for table display
  const filteredData = data.filter(item => 
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Totals for the filtered view (what's visible in the table)
  const totalSales = filteredData.reduce((sum, item) => sum + parseFloat(item.sales || '0'), 0);
  const totalExpense = filteredData.reduce((sum, item) => sum + parseFloat(item.expense || '0'), 0);
  const difference = totalSales - totalExpense;

  // --- NEW: DETAILED BALANCE CALCULATIONS (from the full dataset) ---

  // Helper to safely get a value from a specific row by its ID
  const getValueById = (id, field) => {
    const item = data.find(row => row.id === id);
    return parseFloat(item?.[field] || '0');
  };

  // Online Balance Calculation
  const onlineSales = getValueById(3, 'sales');
  const onlineCarryForward = getValueById(2, 'sales');
  const onlineExpenses = data
    .filter(item => item.paymentMode === 'Online')
    .reduce((sum, item) => sum + parseFloat(item.expense || '0'), 0);
  const onlineBalance = onlineSales + onlineCarryForward - onlineExpenses;

  // Cash Balance Calculation
  const cashSales = getValueById(4, 'sales');
  const cashCarryForward = getValueById(1, 'sales');
  const cashExpenses = data
    .filter(item => item.paymentMode === 'Cash')
    .reduce((sum, item) => sum + parseFloat(item.expense || '0'), 0);
  const cashBalance = cashSales + cashCarryForward - cashExpenses;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Madurai Mess Daily Sheet</h1>

      <div style={styles.summaryBox}>
        {/* The two new balance displays */}
        <div style={styles.summaryItem}><span style={styles.summaryLabel}>Online Cash Balance</span><span style={{...styles.summaryValue, ...(onlineBalance >= 0 ? styles.profit : styles.loss)}}>{formatCurrency(onlineBalance)}</span></div>
        <div style={styles.summaryItem}><span style={styles.summaryLabel}>Cash Balance</span><span style={{...styles.summaryValue, ...(cashBalance >= 0 ? styles.profit : styles.loss)}}>{formatCurrency(cashBalance)}</span></div>
        
        {/* The original totals based on the filtered table view */}
        <div style={styles.summaryItem}><span style={styles.summaryLabel}>Total Sales (Visible)</span><span style={styles.summaryValue}>{formatCurrency(totalSales)}</span></div>
        <div style={styles.summaryItem}><span style={styles.summaryLabel}>Total Expense (Visible)</span><span style={styles.summaryValue}>{formatCurrency(totalExpense)}</span></div>
        <div style={styles.summaryItem}><span style={styles.summaryLabel}>Net (Visible)</span><span style={{ ...styles.summaryValue, ...(difference >= 0 ? styles.profit : styles.loss) }}>{formatCurrency(difference)}</span></div>
      </div>
      
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>S.NO</th>
              <th style={styles.th}><div>Description</div><input type="text" style={styles.searchInput} placeholder="Search descriptions..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onClick={(e) => e.stopPropagation()} /></th>
              <th style={{...styles.th, textAlign: 'right'}}>Sales</th>
              <th style={{...styles.th, textAlign: 'right'}}>Expense</th>
              <th style={styles.th}>Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id} style={index % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={styles.tdStatic}>{item.id}</td>
                <td style={styles.tdStatic}>{item.description}</td>
                {item.id <= 4 ? (<td style={styles.tdEditable}><input type="text" style={styles.input} value={item.sales} onChange={(e) => handleInputChange(item.id, 'sales', e.target.value)} /></td>) : (<td style={styles.tdStaticNumber}></td>)}
                {item.id <= 4 ? (<td style={styles.tdStaticNumber}></td>) : (<td style={styles.tdEditable}><input type="text" style={styles.input} value={item.expense} onChange={(e) => handleInputChange(item.id, 'expense', e.target.value)} /></td>)}
                <td style={{...styles.tdEditable, textAlign: 'left'}}>
                  <select style={styles.select} value={item.paymentMode} onChange={(e) => handleInputChange(item.id, 'paymentMode', e.target.value)}>
                    {paymentModes.map(mode => (<option key={mode} value={mode}>{mode}</option>))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
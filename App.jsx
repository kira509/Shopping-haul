import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('items');
    return saved ? JSON.parse(saved) : [];
  });
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : 5000; // Default budget KSh 5,000
  });
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('budget', JSON.stringify(budget));
  }, [items, budget]);

  const spent = items.filter(i => i.done).reduce((sum, i) => sum + i.price, 0);
  const remaining = budget - spent;

  const add = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    setItems([...items, { id: Date.now(), name, price: parseFloat(price), done: false }]);
    setName(''); setPrice('');
  };

  const toggleItem = (id) => {
    setItems(items.map(i => i.id === id ? {...i, done: !i.done} : i));
  };

  return (
    <div className="container">
      <header>
        <h1 className="logo">SHOP<span>FAST</span></h1>
        <div className="budget-card">
          <div className="flex-row">
            <span>SET TOTAL BUDGET</span>
            <div className="budget-edit-wrapper">
              <span>KSh</span>
              <input 
                type="number" 
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))} 
                className="b-input" 
              />
            </div>
          </div>
          <div className="remaining-section">
            <span className="label">REMAINING</span>
            <h2 className={remaining < 0 ? 'red' : ''}>
              KSh {remaining.toLocaleString()}
            </h2>
          </div>
          <div className="bar">
            <div className="fill" style={{width: `${Math.min((spent/budget)*100, 100)}%`}}></div>
          </div>
        </div>
      </header>

      <form onSubmit={add} className="input-group">
        <input placeholder="Item name..." value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="KSh" value={price} onChange={e => setPrice(e.target.value)} />
        <button type="submit">ADD</button>
      </form>

      <div className="list-container">
        {items.map(item => (
          <div key={item.id} className={`item ${item.done ? 'done' : ''}`} onClick={() => toggleItem(item.id)}>
            <div className="item-left">
              <div className="check-circle"></div>
              <span>{item.name}</span>
            </div>
            <span className="item-price">KSh {item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <button className="clear-btn" onClick={() => window.confirm("Clear list?") && setItems([])}>
          Clear All
        </button>
      )}
    </div>
  );
}
export default App;

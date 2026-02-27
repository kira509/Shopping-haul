import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('items');
    return saved ? JSON.parse(saved) : [];
  });
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? JSON.parse(saved) : 100;
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

  return (
    <div className="container">
      <h1 className="logo">SHOP<span>FAST</span></h1>
      <div className="budget-card">
        <div className="flex-row">
          <span>REMAINING</span>
          <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="b-input" />
        </div>
        <h2 className={remaining < 0 ? 'red' : ''}>${remaining.toFixed(2)}</h2>
        <div className="bar"><div className="fill" style={{width: `${Math.min((spent/budget)*100, 100)}%`}}></div></div>
      </div>

      <form onSubmit={add} className="input-group">
        <input placeholder="Item..." value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="$" value={price} onChange={e => setPrice(e.target.value)} />
        <button type="submit">+</button>
      </form>

      {items.map(item => (
        <div key={item.id} className={`item ${item.done ? 'done' : ''}`} onClick={() => {
          setItems(items.map(i => i.id === item.id ? {...i, done: !i.done} : i))
        }}>
          <span>{item.name}</span>
          <span>${item.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
export default App;

import React, { useState } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [totalBudget, setTotalBudget] = useState(100);

  // LOGIC: Calculate current spending
  const spent = items
    .filter(item => item.completed)
    .reduce((sum, item) => sum + Number(item.price), 0);

  const remaining = totalBudget - spent;

  const addItem = (e) => {
    e.preventDefault();
    if (!itemName || !itemPrice) return;
    
    const newItem = {
      id: Date.now(),
      name: itemName,
      price: parseFloat(itemPrice),
      completed: false
    };
    
    setItems([...items, newItem]);
    setItemName('');
    setItemPrice('');
  };

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="app-container">
      <header>
        <h1 className="logo">SHOP<span>FAST</span></h1>
        <div className="budget-card">
          <div className="budget-info">
            <span>REMAINING</span>
            <h2 className={remaining < 0 ? 'over-budget' : ''}>
              ${remaining.toFixed(2)}
            </h2>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${Math.min((spent / totalBudget) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </header>

      <form onSubmit={addItem} className="input-group">
        <input 
          type="text" placeholder="Item name..." 
          value={itemName} onChange={(e) => setItemName(e.target.value)} 
        />
        <input 
          type="number" placeholder="$" 
          value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} 
        />
        <button type="submit">+</button>
      </form>

      <ul className="shopping-list">
        {items.map(item => (
          <li key={item.id} className={item.completed ? 'item checked' : 'item'}>
            <div className="item-info" onClick={() => toggleItem(item.id)}>
              <span className="checkbox"></span>
              <span className="name">{item.name}</span>
            </div>
            <span className="price">${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
            

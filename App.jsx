import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy } from "firebase/firestore";

function App() {
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(5000);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  // Sync Items from Database
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    return () => unsub();
  }, []);

  // Sync Budget from Database
  useEffect(() => {
    const fetchBudget = async () => {
      const docSnap = await getDoc(doc(db, "config", "budget"));
      if (docSnap.exists()) setBudget(docSnap.data().value);
    };
    fetchBudget();
  }, []);

  const updateBudget = async (val) => {
    setBudget(val);
    await setDoc(doc(db, "config", "budget"), { value: val });
  };

  const addItem = async (e) => {
    e.preventDefault();
    if (!name || !price) return;
    await addDoc(collection(db, "items"), { 
      name, 
      price: parseFloat(price), 
      done: false,
      createdAt: Date.now() 
    });
    setName(''); setPrice('');
  };

  const toggleItem = async (item) => {
    await updateDoc(doc(db, "items", item.id), { done: !item.done });
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(db, "items", id));
  };

  const spent = items.filter(i => i.done).reduce((sum, i) => sum + i.price, 0);
  const remaining = budget - spent;

  return (
    <div className="container">
      <header>
        <h1 className="logo">SHOP<span>FAST</span></h1>
        <div className="budget-card">
          <div className="flex-row">
            <span>SET TOTAL BUDGET</span>
            <div className="budget-edit-wrapper">
              <span>KSh</span>
              <input type="number" value={budget} onChange={(e) => updateBudget(Number(e.target.value))} className="b-input" />
            </div>
          </div>
          <h2 className={remaining < 0 ? 'red' : ''}>KSh {remaining.toLocaleString()}</h2>
          <div className="bar"><div className="fill" style={{width: `${Math.min((spent/budget)*100, 100)}%`}}></div></div>
        </div>
      </header>

      <form onSubmit={addItem} className="input-group">
        <input placeholder="Item..." value={name} onChange={e => setName(e.target.value)} />
        <input type="number" placeholder="KSh" value={price} onChange={e => setPrice(e.target.value)} />
        <button type="submit">ADD</button>
      </form>

      <div className="list-container">
        {items.map(item => (
          <div key={item.id} className={`item ${item.done ? 'done' : ''}`} onClick={() => toggleItem(item)}>
            <div className="item-left">
              <span>{item.name}</span>
            </div>
            <div className="item-right">
              <span className="item-price">KSh {item.price.toLocaleString()}</span>
              {item.done && <button className="del-btn" onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}>×</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default App;

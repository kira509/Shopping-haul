import React, { useState, useEffect } from 'react';
import { db } from './firebase'; 
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy, writeBatch } from "firebase/firestore";

function App() {
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(5000);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map(d => ({ ...d.data(), id: d.id })));
    });
    return () => unsub();
  }, []);

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
      qty: parseInt(qty) || 1,
      done: false,
      createdAt: Date.now() 
    });
    setName(''); setPrice(''); setQty(1);
  };

  const updateQty = async (item, delta) => {
    const newQty = Math.max(1, (item.qty || 1) + delta);
    await updateDoc(doc(db, "items", item.id), { qty: newQty });
  };

  const toggleItem = async (item) => {
    await updateDoc(doc(db, "items", item.id), { done: !item.done });
  };

  const deleteItem = async (id) => {
    if(window.confirm("Remove this item?")) {
      await deleteDoc(doc(db, "items", id));
    }
  };

  const clearAll = async () => {
    if(window.confirm("Delete everything?")) {
      items.forEach(async (item) => {
        await deleteDoc(doc(db, "items", item.id));
      });
    }
  };

  const spent = items.filter(i => i.done).reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
  const remaining = budget - spent;

  return (
    <div className="container">
      <header>
        <h1 className="logo">BEBES<span>SHOPPING HAUL</span></h1>
        <div className="budget-card">
          <div className="flex-row">
            <span>TOTAL BUDGET</span>
            <div className="budget-edit-wrapper">
              <span>KSh</span>
              <input type="number" value={budget} onChange={(e) => updateBudget(Number(e.target.value))} className="b-input" />
            </div>
          </div>
          <h2 className={remaining < 0 ? 'red' : ''}>KSh {remaining.toLocaleString()}</h2>
          <div className="bar"><div className="fill" style={{width: `${Math.min((spent/budget)*100, 100)}%`}}></div></div>
        </div>
      </header>

      <form onSubmit={addItem} className="input-group-vertical">
        <div className="row">
          <input placeholder="Item..." value={name} onChange={e => setName(e.target.value)} style={{flex: 2}} />
          <input type="number" placeholder="Qty" value={qty} onChange={e => setQty(e.target.value)} style={{flex: 0.7}} />
        </div>
        <div className="row">
          <input type="number" placeholder="KSh Price Each" value={price} onChange={e => setPrice(e.target.value)} />
          <button type="submit">ADD</button>
        </div>
      </form>

      <div className="list-container">
        {items.map(item => (
          <div key={item.id} className={`item ${item.done ? 'done' : ''}`}>
            <div className="item-main" onClick={() => toggleItem(item)}>
               <div className="item-info">
                  <span className="name">{item.name}</span>
                  <span className="sub">KSh {item.price} x {item.qty || 1}</span>
               </div>
               <span className="total-price">KSh {(item.price * (item.qty || 1)).toLocaleString()}</span>
            </div>
            <div className="item-actions">
              <button onClick={() => updateQty(item, -1)}>-</button>
              <button onClick={() => updateQty(item, 1)}>+</button>
              <button className="del-btn" onClick={() => deleteItem(item.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && <button className="clear-btn" onClick={clearAll}>Clear All</button>}
    </div>
  );
}
export default App;

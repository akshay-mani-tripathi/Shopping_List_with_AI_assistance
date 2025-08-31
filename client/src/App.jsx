import React, { useState, useEffect } from 'react';
import { VoiceInput , ItemList } from './components';
import './App.css';

import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  deleteDoc
} from 'firebase/firestore';

function App() {
  // -----------------------------
  // State variables
  // -----------------------------
  const [shoppingList, setShoppingList] = useState([]); // Live shopping list
  const [recommendations, setRecommendations] = useState([]); // AI recommendations
  const [alert, setAlert] = useState(null); // Alert messages
  const [searchResults, setSearchResults] = useState([]); // Search results
  const [searched, setSearched] = useState(false); // Toggle search view

  // -----------------------------
  // Fetch recommendations based on shopping history
  // -----------------------------
  const fetchRecommendations = async () => {
    try {
      const historySnapshot = await getDocs(collection(db, 'shopping_history'));
      const historyItems = [];
      historySnapshot.forEach(doc => historyItems.push(doc.data()));

      const res = await fetch('https://shopping-list-with-ai-assistance.onrender.com/voice-command/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: historyItems })
      });

      const recData = await res.json();
      if (recData?.recommendations) {
        setRecommendations(recData.recommendations);
      }
    } catch (err) {
      console.error('❌ Failed to fetch recommendations:', err);
    }
  };

  // -----------------------------
  // Initial fetch of shopping list and recommendations
  // -----------------------------
  useEffect(() => {
    const fetchList = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'live_shopping_list'));
        const items = [];
        querySnapshot.forEach(doc => items.push(doc.data()));
        setShoppingList(items);
        await fetchRecommendations();
      } catch (err) {
        console.error('🔥 Failed to fetch shopping list:', err);
      }
    };

    fetchList();
  }, []);

  // -----------------------------
  // Main update function triggered by voice input
  // -----------------------------
  const updateList = (data) => {
    // Handle invalid commands
    if (!data || data === 'Not a shopping command.') {
      showAlert('⚠️ Not a shopping command.');
      return;
    }

    // Handle search intent
    if (data.intent === 'search_item') {
      handleSearch(data.search_term);
      return;
    }

    // Reset search view
    setSearchResults([]);
    setSearched(false);

    // Update shopping list based on add/remove intents
    setShoppingList(prev => handleAddOrRemove(prev, data));
  };

  // -----------------------------
  // Helper: Display alert
  // -----------------------------
  const showAlert = (message, duration = 3000) => {
    setAlert(message);
    setTimeout(() => setAlert(null), duration);
  };

  // -----------------------------
  // Handle search command
  // -----------------------------
  const handleSearch = (term) => {
    const filtered = shoppingList.filter(item =>
      item.item.toLowerCase().includes(term.toLowerCase()) ||
      item.category?.toLowerCase().includes(term.toLowerCase()) ||
      item.brand?.toLowerCase().includes(term.toLowerCase())
    );

    setSearched(true);

    if (filtered.length === 0) {
      setSearchResults([]);
      showAlert('🔍 No matching items found.');
    } else {
      setSearchResults(filtered);
      showAlert(`✅ Found ${filtered.length} item(s) matching "${term}"`);
    }
  };

  // -----------------------------
  // Handle add or remove intent
  // -----------------------------
  const handleAddOrRemove = (prevList, data) => {
    const existing = prevList.find(entry => entry.item.toLowerCase() === data.item?.toLowerCase());

    // Add item
    if (data.intent === 'add_to_list') {
      return addItem(prevList, existing, data);
    }

    // Remove item
    if (data.intent === 'remove_from_list' && existing) {
      return removeItem(prevList, existing, data);
    }

    return prevList;
  };

  // -----------------------------
  // Add new item or update existing
  // -----------------------------
  const addItem = (prev, existing, data) => {
    const newItem = {
      item: data.item,
      quantity: data.quantity || 1,
      category: data.category || 'Uncategorized',
      price: (data.price || 0) * (data.quantity || 1),
      brand: data.brand || 'any',
      size: data.size || 'any'
    };

    // Save to Firestore
    const saveToFirebase = async () => {
      try {
        await setDoc(doc(db, 'live_shopping_list', newItem.item), newItem);
        await addDoc(collection(db, 'shopping_history'), { ...newItem, timestamp: new Date() });
        await fetchRecommendations();
      } catch (err) {
        console.error('🔥 Firestore write error:', err);
      }
    };
    saveToFirebase();

    showAlert(`✅ Added ${newItem.quantity} ${newItem.item}(s)`);

    // Merge with existing item
    if (existing) {
      return prev.map(entry =>
        entry.item.toLowerCase() === data.item.toLowerCase()
          ? {
              ...entry,
              quantity: entry.quantity + newItem.quantity,
              price: (newItem.price !== 0
                ? (entry.quantity + newItem.quantity) * (newItem.price / newItem.quantity)
                : entry.price),
              category: newItem.category !== 'Uncategorized' ? newItem.category : entry.category,
              brand: newItem.brand !== 'any' ? newItem.brand : entry.brand,
              size: newItem.size !== 'any' ? newItem.size : entry.size
            }
          : entry
      );
    } else {
      return [...prev, newItem];
    }
  };

  // -----------------------------
  // Remove item or decrease quantity
  // -----------------------------
  const removeItem = (prev, existing, data) => {
    const updatedList = existing.quantity > data.quantity
      ? prev.map(entry =>
          entry.item.toLowerCase() === data.item.toLowerCase()
            ? { ...entry, quantity: entry.quantity - data.quantity }
            : entry
        )
      : prev.filter(entry => entry.item.toLowerCase() !== data.item.toLowerCase());

    const removeFromFirebase = async () => {
      try {
        if (existing.quantity <= data.quantity) {
          await deleteDoc(doc(db, 'live_shopping_list', existing.item));
        } else {
          await setDoc(doc(db, 'live_shopping_list', existing.item), {
            ...existing,
            quantity: existing.quantity - data.quantity
          });
        }
        await fetchRecommendations();
      } catch (err) {
        console.error('🔥 Failed to update Firestore on remove:', err);
      }
    };
    removeFromFirebase();

    showAlert(`❌ Removed ${data.quantity} ${data.item}(s)`);
    return updatedList;
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="container">
      {/* Header with Voice Input */}
      <div className="header">
        <h2>🛒 Voice Shopping Assistant</h2>
        <VoiceInput onResult={updateList} />
      </div>

      {/* Alert messages */}
      {alert && <div className="alert">{alert}</div>}

      {/* Main content: Shopping list and recommendations */}
      <div className="main-content">
        {/* Shopping List */}
        <div className="list-section">
          {searched ? (
            <>
              <h3>🔍 Search Results</h3>
              <ItemList items={searchResults} />
            </>
          ) : (
            <ItemList items={shoppingList} />
          )}
        </div>

        {/* Recommendations */}
        <div className="recommendation-section">
          <h3>✨ Recommendations</h3>
          {recommendations.length === 0 ? (
            <p>No suggestions yet.</p>
          ) : (
            <ul>
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

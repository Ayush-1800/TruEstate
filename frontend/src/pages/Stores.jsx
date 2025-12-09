import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function Stores() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    let mounted = true;
    api.getStores().then((list) => { if (mounted) setItems(list || []); }).catch(()=>{});
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Stores</h1>
      <div className="card">
        {items.length === 0 ? <div>No stores found</div> :
          <ul className="list-disc pl-6">
            {items.map((p, i) => <li key={i}>{p}</li>)}
          </ul>}
      </div>
    </div>
  );
}

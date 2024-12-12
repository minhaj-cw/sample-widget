import React, { useState, useEffect } from 'react';

function Widget({ businessId }) {
  const [businessData, setBusinessData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/businesses/${businessId}`);
        const data = await response.json();
        console.log(data);
        setBusinessData(data);
      } catch (error) {
        setError('Failed to fetch business data');
      }
    };

    fetchBusinessData();
  }, [businessId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!businessData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{businessData.name}</h2>
      <p>{businessData.description}</p>
      {/* ... other business details */}
    </div>
  );
}

export default Widget;
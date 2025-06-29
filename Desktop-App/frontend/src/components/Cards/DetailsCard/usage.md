# How to use DetailsCard component

```tsx
import React from "react";
import DetailsCard from "./components/DetailsCard/DetailsCard";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <DetailsCard 
        category="Semáforos" 
        severity="Alta" 
        occurrences={5} 
        status="Pendente" 
        icon={
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
            <path 
              d="M17.0308 22.5189L17.0241 16.8523M17.0173 11.1856L17.0319 11.1856M31.6075 16.8636C31.6168 24.6876 25.0951 31.0251 17.041 31.0188C8.98677 31.0126 2.45001 24.6649 2.4407 16.8409C2.43138 9.01692 8.95304 2.67939 17.0072 2.68566C25.0614 2.69192 31.5982 9.0396 31.6075 16.8636Z" 
              stroke="#1E1E1E" 
              strokeWidth="4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        }
        borderColor="#283FB1" 
      />
    </div>
  );
};

export default App;
```

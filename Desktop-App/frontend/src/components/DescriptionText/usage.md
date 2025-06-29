# How to use DescriptionText component

```tsx
import React from "react";
import DescriptionText from "./DescriptionText";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <DescriptionText 
        title="Descrição" 
        description="Buraco na estrada. Perigo iminente para os veículos." 
      />
    </div>
  );
};

export default App;
```

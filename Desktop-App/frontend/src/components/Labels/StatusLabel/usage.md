# How to use StatusLabel component

```tsx
import React from "react";
import StatusLabel from "./components/StatusLabel/StatusLabel";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <StatusLabel text="Ocorrência" number={1} color1="#283FB1" color2="#F1F5F9" />
    </div>
  );
};

export default App;
```

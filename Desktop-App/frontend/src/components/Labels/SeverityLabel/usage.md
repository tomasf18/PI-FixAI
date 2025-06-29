## How to use Severity/Status Label

```tsx
import React from "react";
import SeverityLabel from "./components/SeverityLabel/SeverityLabel";

const App: React.FC = () => {
  return (
    <div>
        <SeverityLabel text="Pendente" textColor="text-yellow-950" bgColor="bg-amber-100"/>
    </div>
  );
};

export default App;
```
# How to use the ReportFastComponent 

See the example below:

```tsx
import React from "react";
import ReportFastComponent from "./ReportFastComponent";
import { FaClock } from "react-icons/fa";

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <ReportFastComponent
        icon={
          <div className="w-12 h-12 flex justify-center items-center rounded-full bg-gradient-to-r from-blue-700 to-orange-500">
            <FaClock className="text-white text-2xl" />
          </div>
        }
        mainText="Reportar em"
        subText="Menos de 5 segundos"
      />
    </div>
  );
};

export default App;

```

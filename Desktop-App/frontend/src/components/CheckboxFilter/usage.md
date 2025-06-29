# How to use CheckboxFilter component

```tsx
import React from "react";
import CheckboxFilter from "./components/CheckboxFilter/CheckboxFilter";

const categories = [
  "Pavimento",
  "Semáforos",
  "Sinais de Trânsito",
  "Iluminação",
  "Infraestrutura",
  "Drenagem Urbana",
  "Outros"
];

const descriptions = {
  "Semáforos": "Falhas ou configurações incorretas.",
  "Drenagem Urbana": "Acúmulo de água nas vias ou falhas no escoamento.",
  "Pavimento": "Buracos e superfícies irregulares.",
  "Sinais de Trânsito": "Sinais ausentes, danificados ou obstruídos.",
  "Infraestrutura": "Bancos, lixeiras ou abrigos de autocarros danificados.",
  "Iluminação": "Postes apagados ou com funcionamento irregular.",
  "Outros": "Qualquer outro problema urbano."
};

const App: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <CheckboxFilter categories={categories} descriptions={descriptions} />
    </div>
  );
};

export default App;
```

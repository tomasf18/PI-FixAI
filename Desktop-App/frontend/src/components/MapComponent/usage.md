# How to use MapComponent

See the example below in order to understand how to use the MapComponent component in a page.

```tsx
import React from "react";
import CheckboxFilter from "../components/CheckboxFilter/CheckboxFilter";
import MapComponent from "../components/MapComponent/MapComponent";

// Examples for CheckboxFilter
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

// Examples of problems for MapComponent markers
const markers = [
  {
    latlng: { 
      latitude: 40.6236, 
      longitude: -8.6575 
    },
    title: "Semáforo Quebrado",
    image: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
    location: "Rua do Cascao Avenida Principal, 123",
    callable: () => alert("Detalhes do Semáforo Quebrado")
  },
  {
    latlng: { 
      latitude: 40.6589,
      longitude: -8.6456 
    },
    title: "Buraco na Rua",
    image: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
    location: "Rua Secundária, 456",
    callable: () => alert("Detalhes do Buraco na Rua")
  },
  {
    latlng: { 
      latitude: 40.6269,
      longitude: -8.6436 
    },
    title: "Buraco na Rua",
    image: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
    location: "Rua Secundária, 456",
    callable: () => alert("Detalhes do Buraco na Rua")
  },
  {
    latlng: { 
      latitude: 40.6169,
      longitude: -8.6416 
    },
    title: "Buraco na Rua",
    image: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
    location: "Rua Secundária, 456",
    callable: () => alert("Detalhes do Buraco na Rua")
  },
  {
    latlng: { 
      latitude: 40.6069,
      longitude: -8.6016 
    },
    title: "Buraco na Rua",
    image: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
    location: "Rua Secundária, 456",
    callable: () => alert("Detalhes do Buraco na Rua")
  },
];

const startPosition = {
  latitude: 40.623605,
  longitude: -8.657361,
  latitudeDelta: 0.0, 
  longitudeDelta: 0.0
};


const MapPage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 p-4 gap-4">
      <CheckboxFilter categories={categories} descriptions={descriptions} />
      <div className="flex-grow bg-white shadow-md rounded-lg p-4">
        <MapComponent markers={markers} startPosition={startPosition} />
      </div>
    </div>
  );
};

export default MapPage;
```
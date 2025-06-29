# How to use PersonalizedCarrousel component

```tsx
import React from "react";
import PersonalizedCarrousel from "./components/PersonalizedCarrousel/PersonalizedCarrousel";

const App: React.FC = () => {
  const carouselItems = [
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description: "Buraco na estrada. Perigo iminente para os veículos. O buraco está localizado no meio da faixa e representa um risco.",
      submissionDate: "17-03-2024",
      referenceNumber: "NJ-FRE-7F23",
    },
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description:  "Grande buraco na rua principal. O buraco tem aproximadamente um metro de diâmetro e já causou prejuízos a diversos motoristas. Durante períodos de chuva, ele fica ainda mais perigoso, pois a água esconde sua profundidade real. Pode ser perigoso se uma pessoa se aventurar. Por isso tenham muito cuidado para não se aleijarem por favor.",
      submissionDate: "17-03-2024",
      referenceNumber: "NJ-FRE-7F23",
    },
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description: "Buraco na estrada. Perigo iminente para os veículos.",
      submissionDate: "17-03-2024",
      referenceNumber: "NJ-FRE-7F23",
    },
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description: "Grande buraco na rua principal.",
      submissionDate: "05-03-2024",
      referenceNumber: "ZX-CVB-3T5Y",
    },
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description: "Arvore caida na estrada",
      submissionDate: "01-01-2021",
      referenceNumber: "REF-1234",
    },
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description: "aqui vai a descrição do item",
      submissionDate: "2022-12-31",
      referenceNumber: "123456",
    },
    {
      photo: "https://media.discordapp.net/attachments/1279880264159461460/1340653774326468639/image.jpg?ex=67b3249f&is=67b1d31f&hm=870549292a45537a22dd4003d71aed7ab03c29061c14d6fcd4c84643b0ff2a08&=&format=webp&width=928&height=1238",
      description: "Buraco na estrada. Perigo iminente para os veículos.",
      submissionDate: "17-03-2024",
      referenceNumber: "NJ-FRE-7F23",
    },
    {
      photo: "https://media.istockphoto.com/id/95658927/pt/foto/estrada-danos.jpg?s=612x612&w=0&k=20&c=MUg9ULfotqHVm5kNzVEfNnOmiYiK3_n5GLXWeUwbfRs=",
      description: "Calçada em péssimas condições.",
      submissionDate: "15-03-2024",
      referenceNumber: "TR-AFS-92D4",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },
    {
      photo: "https://imagens.publico.pt/imagens.aspx/1075556?tp=UH&db=IMAGENS&type=JPG",
      description: "Semáforo avariado há 3 dias.",
      submissionDate: "10-03-2024",
      referenceNumber: "QW-POI-1A2B",
    },


  ];

  // criar função para obter um item específico do array de items
  const getItem = (index: number) => {
    return carouselItems[index];
  };

  // passar a função getItem para o componente PersonalizedCarrousel
  // passar o número de items para o componente PersonalizedCarrousel
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <PersonalizedCarrousel getItem={getItem} numberOfItems={carouselItems.length} />
    </div>
  );

};

export default App;
´´´

## How to use SimpleTable

```tsx
import SimpleTable from "./components/Tables/SimpleTable/SimpleTable";
import { IoDocumentOutline } from "react-icons/io5";

const App: React.FC = () => {

  const widthClass = "w-3/4";
  const heightClass = "h-full";
  
  const columns: CollumnDefinition[] = [
    { name: "Categoria", sortable: true },
    { name: "Gravidade", sortable: true },
    { name: "Estado", sortable: true },
    { name: "Data de Submissão", sortable: true, initialSortDirection: "desc" },
    { name: "Ocorrências", sortable: true },
    { name: "Detalhes", sortable: false },
  ];

  const rows = [
    ["Semáforo", "Alta", "Pendente", "10-03-2024", "3", <IoDocumentOutline />],
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <SimpleTable 
        widthClass={widthClass}
        heightClass={heightClass}
        colums={columnsName}
        rows={rows}
        currentPage={1}
        totalPages={1}
        onPageChange={() => {}}
        onSort={handleSort}
        />
    </div>
  );
};

export default App;
```
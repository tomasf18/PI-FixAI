## How to use the FilterStateButton

```tsx
import FilterStateButton from "./components/Buttons/FilterStateButton/FilterStateButton"

export default function App() {
    return (
        <>
            <div className="flex">
                {/* default color blue when active and gray for inactive */}
                <FilterStateButton text="Pendente" active={true} onClick={}/>

                {/* but it is customizable, activeBgColor, inactiveBgColor, activeTextColor, inactiveTextColor*/}
                <FilterStateButton text="Em Progresso" activeBgColor="bg-red-100" inactiveBgColor="bg-green-300"/>
            </div>
        </>
    )
}
```
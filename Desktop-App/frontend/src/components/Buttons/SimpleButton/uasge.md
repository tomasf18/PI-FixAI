## How to use the SimpleButton

```tsx
import SimpleButton from "./components/Buttons/SimpleButton/SimpleButton"

export default function App() {
    return (
        <>
            <div className="flex">
                {/* default color blue*/}
                <SimpleButton text="Sign out" onClick={}/>
                {/* but you can change it*/}
                <SimpleButton text="Sign out" bgColor="bg-red-100" textColor="text-black"/>
            </div>
        </>
    )
}
```

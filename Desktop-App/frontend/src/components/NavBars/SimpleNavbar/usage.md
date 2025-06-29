## How to use SimpleNavbar

```tsx
import React from "react";
import SimpleNavbar from "../../NavBars/SimpleNavbar/SimpleNavbar";
import SimpleButton from "../../Buttons/SimpleButton/SimpleButton";

const App: React.FC = () => {

    function handleSignout() {
        console.log('Sign out')
    }

    const signoutButton = <SimpleButton text="Sign out" onClick={handleSignout}/>
    const entityLogoSrc = "/src/assets/logos/entityLogo.png"

    return (
        <div className="flex flex-col min-h-screen">
            <SimpleNavbar buttonElement={signoutButton} entityLogo={entityLogoSrc} entityLogoAlt="Aveiro Câmara Municipal" bgColor="bg-red-100" />
        </div>
    );
};

export default App;
```
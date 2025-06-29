import { useLanguage } from "../../contexts/LanguageContext";

const LanguageSelect = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "pt")}
            className="px-3 py-2 border rounded-md shadow-md bg-white text-gray-700 cursor-pointer"
        >
            <option value="pt">🇵🇹 PT</option>
            <option value="en">🇬🇧 EN</option>
        </select>
    );};

export default LanguageSelect;
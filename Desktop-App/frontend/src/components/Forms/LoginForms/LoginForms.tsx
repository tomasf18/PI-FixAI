import { useState } from "react";
import { Checkbox, Label, TextInput } from "flowbite-react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useAuth } from "../../../contexts/AuthContext";

export default function LoginForms() {
  const { traduction } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  // const [error, setError] = useState<string | null>(null);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await login({
        username: input.email,
        password: input.password,
      });
    }
    catch (error: any) {
      console.log('Error Login In:', error);    }
  };

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-4 mx-auto"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h1 className="text-3xl font-semibold text-center text-gray-600 mb-6">
        {traduction("login_title")}
      </h1>

      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value={traduction("email")} />
        </div>
        <TextInput
          id="email"
          name="email"
          type="text"
          value={input.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="relative">
        <div className="mb-2 block">
          <Label htmlFor="password" value={traduction("password")} />
        </div>
        <TextInput
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={input.password}
          onChange={handleChange}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-11 text-gray-700 hover:text-gray-900"
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="remember" className="text-gray-800 focus:ring-gray-600" />
        <Label htmlFor="remember">{traduction("remember_me")}</Label>
      </div>
      {/* {error && (
        <div className="text-red-500 font-bold text-center">{error}</div>
      )} */}
      <button
        type="submit"
        className="bg-gray-600 w-full h-full text-white py-2 px-4 rounded-lg hover:bg-gray-500"
      >
        {traduction("login_button")}
      </button>
      <hr className="my-6 border-2 border-gray-300" />
			<div className="items-center mt-4 text-center mb-2 text-2xl text-gray-700">
      {traduction("citizen_message_text_1")} <b>{traduction("citizen_message_text_2")}</b> {traduction("citizen_message_text_3")} <br />
      {traduction("citizen_message_text_4")} <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{traduction("citizen_message_text_5")}</a>
			</div>
    </form>
  );
}

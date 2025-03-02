import React, { useState } from "react";
import Registration from "./Registration";
import Login from "./Login";

const LoginOrRegistration = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full max-w-lg p-7 rounded-lg space-y-6 shadow-lg bg-white border border-gray-300 mx-auto">
      <nav className="flex flex-col md:flex-row justify-between items-center px-4 md:px-24">
        <button
          className={`pb-2 text-2xl font-semibold transition-colors transition-transform duration-500 ${
            isLogin
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-400 border-b-2 border-transparent"
          } hover:text-[#0d9488] hover:border-[#0d9488]`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={` pb-2 text-2xl font-semibold transition-colors transition-transform duration-500 ${
            !isLogin
              ? "text-teal-600 border-b-2 border-teal-600"
              : "text-gray-400 border-b-2 border-transparent"
          } hover:text-[#0d9488] hover:border-[#0d9488]`}
          onClick={() => setIsLogin(false)}
        >
          Registration
        </button>
      </nav>

      {isLogin ? <Login /> : <Registration setIsLogin={setIsLogin} />}
    </div>
  );
};

export default LoginOrRegistration;

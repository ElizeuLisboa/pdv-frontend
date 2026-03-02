import React, { useState } from "react";

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Senha",
  name = "password",
  title,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        title={title}
        required={required}
        className="w-full border p-2 rounded pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-2 text-gray-500"
      >
        {showPassword ? "👁️" : "🙈"}
      </button>
    </div>
  );
}

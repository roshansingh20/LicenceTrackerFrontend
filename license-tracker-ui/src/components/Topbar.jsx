import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between">
      <span className="font-semibold text-gray-700">
        Telecom Compliance Platform
      </span>

    </header>
  );t
}

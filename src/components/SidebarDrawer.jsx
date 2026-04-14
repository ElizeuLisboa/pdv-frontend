import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function SidebarDrawer({ aberta, onClose }) {
  const { usuario } = useAuth();

  // Ajuste da altura do header (nível 1 + nav nível 2)
  const HEADER_HEIGHT = 96; // ajuste conforme sua altura total do header (px)

  const opcoesAdmin = [
    { to: "/clientes", label: "Listar Clientes" },
    { to: "/cadastrar-cliente", label: "Cadastrar Cliente" },
    { to: "/cadastrar-produto", label: "Cadastrar Produto" },
    { to: "/cadastrar-transportadora", label: "Cadastrar Transportadora" },
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <Transition show={aberta} as={Fragment}>
      <Dialog as="div" className="relative z-40 md:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex z-40">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <aside
              className={`h-full bg-gray-900 text-white p-4 w-64 transform transition-transform duration-300 
               ${"translate-x-0"} `}
            >
              {/* <aside
              className="fixed top-[96px] left-0 h-[calc(100%-96px)] w-64 bg-amber-600 text-white p-4 transform transition-transform duration-300 z-30"
            > */}
              <div className="flex flex-col space-y-3">
                <Link
                  to="/produtos"
                  onClick={onClose}
                  className="hover:bg-gray-900 px-2 py-1 rounded"
                >
                  Produtos
                </Link>
                <Link
                  to="/carrinho"
                  onClick={onClose}
                  className="hover:bg-gray-900 px-2 py-1 rounded"
                >
                  Carrinho
                </Link>

                {(usuario?.role === "ADMIN" || usuario?.role === "SUPERUSER") &&
                  opcoesAdmin.map(({ to, label }) => (
                    <Link
                      to={to}
                      key={label}
                      onClick={onClose}
                      className="hover:bg-gray-900 px-2 py-1 rounded"
                    >
                      {label}
                    </Link>
                  ))}
              </div>
            </aside>
          </Transition.Child>

          {/* Área clicável para fechar o sidebar */}
          <div className="flex-shrink-0 w-full" onClick={onClose}></div>
        </div>
      </Dialog>
    </Transition>
  );
}

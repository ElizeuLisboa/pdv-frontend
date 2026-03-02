import { useEffect, useState } from 'react';
import api from '../api'; // ajuste o caminho se estiver em outro lugar

const Perfil = () => {
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    api.get('/auth/perfil')
      .then((res) => setPerfil(res.data.perfil))
      .catch((err) => {
        console.error('Erro ao buscar perfil:', err);
        setErro('Erro ao carregar o perfil. Faça login novamente.');
      });
  }, []);

  if (erro) return <p>{erro}</p>;
  if (!perfil) return <p>Carregando perfil...</p>;

  return (
    <div>
      <h1>Bem-vindo, {perfil.nome}</h1>
      <p><strong>Email:</strong> {perfil.email}</p>
      <p><strong>Função:</strong> {perfil.role}</p>
    </div>
  );
};

export default Perfil;

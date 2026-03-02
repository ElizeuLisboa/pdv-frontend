const autenticarAdmin = async () => {
    try {
      const res = await api.post("/auth/validar-admin", {
        email: adminUsuario,
        password: adminSenha,
      });
      console.log("ADMIN VALIDADO:", res.data);
      return res.data; // { id, nome, role }
    } catch (err) {
      console.error("Erro ao validar admin:", err);
      toast.error("Usuário admin inválido ou senha incorreta.");
      return null;
    }
  };

  const handleAutorizar = async () => {
    if (!valor) {
      toast.error("Informe o valor da sangria");
      return;
    }

    setLoading(true);

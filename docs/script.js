const form = document.getElementById('formulario');
    const lista = document.getElementById('usuarios');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const dados = {
        nome: form.nome.value,
        email: form.email.value,
        senha: form.senha.value
      };

      const res = await fetch('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });

      alert(await res.text());
      form.reset();
      carregarUsuarios();
    });

    async function carregarUsuarios() {
      const res = await fetch('/usuarios');
      const usuarios = await res.json();
      lista.innerHTML = '';

      usuarios.forEach((u, i) => {
        const item = document.createElement('li');
        item.innerHTML = `
          <strong>${u.nome}</strong> (${u.email})
          <button onclick="remover(${i})">Remover</button>
        `;
        lista.appendChild(item);
      });
    }

    async function remover(id) {
      await fetch(`/usuarios/${id}`, { method: 'DELETE' });
      carregarUsuarios();
    }

    carregarUsuarios();
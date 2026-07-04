import { useState, useEffect } from 'react';
import api from './api';

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: number;
  pessoaId: number;
  nomePessoa: string;
}

interface Totais {
  porPessoa: {
    pessoaId: number;
    nome: string;
    idade: number;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
  }[];
  geral: {
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
  };
}

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [totais, setTotais] = useState<Totais | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [modoEscuro, setModoEscuro] = useState(() => {
    const salvo = localStorage.getItem('modoEscuro');
    return salvo ? JSON.parse(salvo) : false;
  });

  const [novaPessoa, setNovaPessoa] = useState({ nome: '', idade: '' });
  const [novaTransacao, setNovaTransacao] = useState({
    descricao: '',
    valor: '',
    tipo: 1,
    pessoaId: '',
  });

  useEffect(() => {
    localStorage.setItem('modoEscuro', JSON.stringify(modoEscuro));
  }, [modoEscuro]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const resPessoas = await api.get<Pessoa[]>('/Pessoas');
      setPessoas(resPessoas.data);

      const resTransacoes = await api.get<Transacao[]>('/Transacoes');
      setTransacoes(resTransacoes.data);

      const resTotais = await api.get<Totais>('/Transacoes/totais');
      setTotais(resTotais.data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      alert('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const cadastrarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaPessoa.nome.trim() || !novaPessoa.idade) return;

    setCarregando(true);
    try {
      await api.post('/Pessoas', {
        nome: novaPessoa.nome.trim(),
        idade: Number(novaPessoa.idade),
      });
      setNovaPessoa({ nome: '', idade: '' });
      await carregarDados();
      alert('Pessoa cadastrada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao cadastrar pessoa:', err.response?.data);
      const mensagem = err.response?.data?.title || err.response?.data || 'Erro ao cadastrar pessoa.';
      alert(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const cadastrarTransacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaTransacao.descricao.trim() || !novaTransacao.valor || !novaTransacao.pessoaId) return;

    const valorNumerico = Number(novaTransacao.valor.replace(',', '.'));
    if (valorNumerico <= 0) {
      alert('Informe um valor maior que zero.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/Transacoes', {
        descricao: novaTransacao.descricao.trim(),
        valor: valorNumerico,
        tipo: novaTransacao.tipo,
        pessoaId: Number(novaTransacao.pessoaId),
      });
      setNovaTransacao({ descricao: '', valor: '', tipo: 1, pessoaId: '' });
      await carregarDados();
      alert('Transação cadastrada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao cadastrar transação:', err.response?.data);
      const mensagem = err.response?.data || 'Erro ao cadastrar transação.';
      alert(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  const excluirPessoa = async (id: number) => {
    if (!window.confirm('Deseja excluir? Todas as transações dessa pessoa serão apagadas.')) return;

    setCarregando(true);
    try {
      await api.delete(`/Pessoas/${id}`);
      await carregarDados();
      alert('Pessoa excluída com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir pessoa.');
    } finally {
      setCarregando(false);
    }
  };

  // 🎨 Estilos responsivos e alinhados
  const estilos = {
    container: {
      maxWidth: '1000px',
      width: '100%',
      margin: '0 auto',
      padding: '16px',
      boxSizing: 'border-box' as const,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: modoEscuro ? '#181a1b' : '#f3f4f6',
      color: modoEscuro ? '#e8e6e3' : '#2d3748',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    },
    cabecalho: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      flexWrap: 'wrap' as const,
      gap: '12px'
    },
    titulo: {
      color: modoEscuro ? '#f0f0f0' : '#2b3a55',
      margin: 0,
      fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
      lineHeight: '1.3'
    },
    botaoTema: {
      padding: '8px 14px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      backgroundColor: modoEscuro ? '#3a3e42' : '#e2e8f0',
      color: modoEscuro ? '#f8f9fa' : '#2d3748',
      fontWeight: 500,
      fontSize: '0.95rem',
      whiteSpace: 'nowrap' as const
    },
    cartao: {
      backgroundColor: modoEscuro ? '#242729' : '#ffffff',
      padding: '18px',
      borderRadius: '10px',
      marginBottom: '22px',
      border: modoEscuro ? '1px solid #383c3f' : '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      width: '100%',
      boxSizing: 'border-box' as const
    },
    formulario: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: '12px',
      alignItems: 'center' as const
    },
    input: {
      flex: '1 1 180px',
      minWidth: '160px',
      padding: '10px 12px',
      border: `1px solid ${modoEscuro ? '#4a4e51' : '#d1d5db'}`,
      borderRadius: '6px',
      backgroundColor: modoEscuro ? '#2d3032' : '#ffffff',
      color: modoEscuro ? '#e8e6e3' : '#2d3748',
      fontSize: '0.95rem',
      boxSizing: 'border-box' as const
    },
    botao: {
      padding: '10px 16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.95rem',
      fontWeight: 500,
      whiteSpace: 'nowrap' as const
    },
    tabelaContainer: {
      overflowX: 'auto' as const,
      width: '100%',
      borderRadius: '6px',
      border: `1px solid ${modoEscuro ? '#383c3f' : '#e5e7eb'}`
    },
    tabela: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      minWidth: '500px'
    },
    celula: {
      border: `1px solid ${modoEscuro ? '#383c3f' : '#e5e7eb'}`,
      padding: '10px 12px',
      textAlign: 'left' as const
    },
    cabecalhoTabela: {
      backgroundColor: modoEscuro ? '#2d3032' : '#f9fafb',
      fontWeight: 600
    },
    itemLista: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 0',
      borderBottom: `1px solid ${modoEscuro ? '#383c3f' : '#e5e7eb'}`,
      flexWrap: 'wrap' as const,
      gap: '8px'
    },
    mensagemCarregando: {
      padding: '10px',
      backgroundColor: modoEscuro ? '#3a3426' : '#fffbeb',
      border: `1px solid ${modoEscuro ? '#5a4f36' : '#fde68a'}`,
      borderRadius: '6px',
      marginBottom: '18px',
      textAlign: 'center' as const
    }
  };

  return (
    <div style={estilos.container}>
      <div style={estilos.cabecalho}>
        <h1 style={estilos.titulo}>Controle de Gastos Residenciais</h1>
        <button
          style={estilos.botaoTema}
          onClick={() => setModoEscuro(!modoEscuro)}
        >
          {modoEscuro ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      {carregando && (
        <div style={estilos.mensagemCarregando}>
          ⏳ Processando...
        </div>
      )}

      {/* Cadastro de Pessoa */}
      <div style={estilos.cartao}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>Cadastrar Pessoa</h3>
        <form onSubmit={cadastrarPessoa} style={estilos.formulario}>
          <input
            type="text"
            placeholder="Nome completo"
            value={novaPessoa.nome}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, nome: e.target.value })}
            style={estilos.input}
            required
            disabled={carregando}
          />
          <input
            type="number"
            placeholder="Idade"
            min="1"
            max="120"
            value={novaPessoa.idade}
            onChange={(e) => setNovaPessoa({ ...novaPessoa, idade: e.target.value })}
            style={{ ...estilos.input, maxWidth: '120px' }}
            required
            disabled={carregando}
          />
          <button
            type="submit"
            disabled={carregando}
            style={{ ...estilos.botao, backgroundColor: '#22c55e', color: 'white' }}
          >
            Cadastrar
          </button>
        </form>
      </div>

      {/* Cadastro de Transação */}
      <div style={estilos.cartao}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>Cadastrar Transação</h3>
        <form onSubmit={cadastrarTransacao} style={estilos.formulario}>
          <input
            type="text"
            placeholder="Descrição"
            value={novaTransacao.descricao}
            onChange={(e) => setNovaTransacao({ ...novaTransacao, descricao: e.target.value })}
            style={{ ...estilos.input, flex: '2 1 220px' }}
            required
            disabled={carregando}
          />
          <input
            type="text"
            placeholder="Valor (ex: 120.50)"
            value={novaTransacao.valor}
            onChange={(e) => setNovaTransacao({ ...novaTransacao, valor: e.target.value })}
            style={{ ...estilos.input, maxWidth: '140px' }}
            required
            disabled={carregando}
          />
          <select
            value={novaTransacao.tipo}
            onChange={(e) => setNovaTransacao({ ...novaTransacao, tipo: Number(e.target.value) })}
            style={{ ...estilos.input, maxWidth: '130px' }}
            disabled={carregando}
          >
            <option value={1}>Despesa</option>
            <option value={0}>Receita</option>
          </select>
          <select
            value={novaTransacao.pessoaId}
            onChange={(e) => setNovaTransacao({ ...novaTransacao, pessoaId: e.target.value })}
            style={{ ...estilos.input, flex: '1 1 160px' }}
            required
            disabled={carregando}
          >
            <option value="">Selecione a pessoa</option>
            {pessoas.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={carregando}
            style={{ ...estilos.botao, backgroundColor: '#3b82f6', color: 'white' }}
          >
            Adicionar
          </button>
        </form>
      </div>

      {/* Resumo Geral */}
      {totais && (
        <div style={{ ...estilos.cartao, backgroundColor: modoEscuro ? '#202b33' : '#eff6ff' }}>
          <h3 style={{ marginTop: 0, marginBottom: '14px', fontSize: '1.1rem' }}>Resumo Geral</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ margin: 0 }}><strong>Total de Receitas:</strong> R$ {totais.geral.totalReceitas.toFixed(2)}</p>
            <p style={{ margin: 0 }}><strong>Total de Despesas:</strong> R$ {totais.geral.totalDespesas.toFixed(2)}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', marginTop: '6px', margin: 0 }}>
              Saldo Líquido: R$ {totais.geral.saldoLiquido.toFixed(2)}
            </p>
          </div>
        </div>
      )}

      {/* Lista de Pessoas */}
      <div style={estilos.cartao}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>Pessoas Cadastradas</h3>
        {pessoas.length === 0 ? (
          <p style={{ margin: 0 }}>Nenhuma pessoa cadastrada ainda.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {pessoas.map(p => (
              <li key={p.id} style={estilos.itemLista}>
                <span>{p.nome} ({p.idade} anos)</span>
                <button
                  onClick={() => excluirPessoa(p.id)}
                  disabled={carregando}
                  style={{ ...estilos.botao, backgroundColor: '#ef4444', color: 'white', padding: '6px 10px', fontSize: '0.9rem' }}
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lista de Transações */}
      <div style={estilos.cartao}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.1rem' }}>Transações</h3>
        {transacoes.length === 0 ? (
          <p style={{ margin: 0 }}>Nenhuma transação cadastrada ainda.</p>
        ) : (
          <div style={estilos.tabelaContainer}>
            <table style={estilos.tabela}>
              <thead>
                <tr style={estilos.cabecalhoTabela}>
                  <th style={estilos.celula}>Descrição</th>
                  <th style={estilos.celula}>Valor</th>
                  <th style={estilos.celula}>Tipo</th>
                  <th style={estilos.celula}>Pessoa</th>
                </tr>
              </thead>
              <tbody>
                {transacoes.map(t => (
                  <tr key={t.id}>
                    <td style={estilos.celula}>{t.descricao}</td>
                    <td style={estilos.celula}>R$ {t.valor.toFixed(2)}</td>
                    <td style={{ ...estilos.celula, color: t.tipo === 0 ? '#22c55e' : '#ef4444', fontWeight: 500 }}>
                      {t.tipo === 0 ? 'Receita' : 'Despesa'}
                    </td>
                    <td style={estilos.celula}>{t.nomePessoa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
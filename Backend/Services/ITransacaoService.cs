using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services;

public interface ITransacaoService
{
    Task<List<Transacao>> ListarTodasAsync();
    Task<Transacao?> ObterPorIdAsync(int id);
    Task<Transacao> CriarAsync(Transacao transacao);
    Task<bool> ExcluirAsync(int id);
}
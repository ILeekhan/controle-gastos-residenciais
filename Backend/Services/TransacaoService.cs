using Backend.Models;
using Backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Services;

public class TransacaoService : ITransacaoService
{
    private readonly AppDbContext _context;

    public TransacaoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Transacao>> ListarTodasAsync()
    {
        // Inclui os dados da pessoa na consulta
        return await _context.Transacoes
            .Include(t => t.Pessoa)
            .ToListAsync();
    }

    public async Task<Transacao?> ObterPorIdAsync(int id)
    {
        return await _context.Transacoes
            .Include(t => t.Pessoa)
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Transacao> CriarAsync(Transacao transacao)
    {
        _context.Transacoes.Add(transacao);
        await _context.SaveChangesAsync();
        return transacao;
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var transacao = await _context.Transacoes.FindAsync(id);
        if (transacao == null)
            return false;

        _context.Transacoes.Remove(transacao);
        await _context.SaveChangesAsync();
        return true;
    }
}
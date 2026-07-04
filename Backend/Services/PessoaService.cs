using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public interface IPessoaService
{
    Task<Pessoa> CriarAsync(Pessoa pessoa);
    Task<List<Pessoa>> ListarTodasAsync();
    Task<Pessoa?> ObterPorIdAsync(int id);
    Task<bool> ExcluirAsync(int id);
}

public class PessoaService : IPessoaService
{
    private readonly AppDbContext _db;

    public PessoaService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<Pessoa> CriarAsync(Pessoa pessoa)
    {
        _db.Pessoas.Add(pessoa);
        await _db.SaveChangesAsync();
        return pessoa;
    }

    public async Task<List<Pessoa>> ListarTodasAsync()
    {
        return await _db.Pessoas.OrderBy(p => p.Nome).ToListAsync();
    }

    public async Task<Pessoa?> ObterPorIdAsync(int id)
    {
        return await _db.Pessoas.FindAsync(id);
    }

    public async Task<bool> ExcluirAsync(int id)
    {
        var pessoa = await _db.Pessoas.FindAsync(id);
        if (pessoa == null) return false;

        _db.Pessoas.Remove(pessoa);
        await _db.SaveChangesAsync();
        return true;
    }
}
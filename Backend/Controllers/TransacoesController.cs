using Backend.Services;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransacoesController : ControllerBase
{
    private readonly ITransacaoService _service;

    public TransacoesController(ITransacaoService service)
    {
        _service = service;
    }

    // Rota de totais no formato exato que o Frontend espera
    [HttpGet("totais")]
    public async Task<IActionResult> ObterTotais()
    {
        var lista = await _service.ListarTodasAsync();

        // 0 = Receita, 1 = Despesa
        var totalReceitas = lista.Where(t => t.Tipo == 0).Sum(t => t.Valor);
        var totalDespesas = lista.Where(t => t.Tipo == 1).Sum(t => t.Valor);
        var saldoLiquido = totalReceitas - totalDespesas;

        var porPessoa = lista
            .Where(t => t.Pessoa != null)
            .GroupBy(t => new
            {
                Id = t.Pessoa!.Id,
                Nome = t.Pessoa!.Nome,
                Idade = t.Pessoa!.Idade
            })
            .Select(g => new
            {
                pessoaId = g.Key.Id,
                nome = g.Key.Nome,
                idade = g.Key.Idade,
                totalReceitas = g.Where(t => t.Tipo == 0).Sum(t => t.Valor),
                totalDespesas = g.Where(t => t.Tipo == 1).Sum(t => t.Valor),
                saldo = g.Where(t => t.Tipo == 0).Sum(t => t.Valor)
                      - g.Where(t => t.Tipo == 1).Sum(t => t.Valor)
            })
            .ToList();

        return Ok(new
        {
            porPessoa = porPessoa,
            geral = new
            {
                totalReceitas = totalReceitas,
                totalDespesas = totalDespesas,
                saldoLiquido = saldoLiquido
            }
        });
    }

    // Lista todas as transações com dados formatados para o Frontend
    [HttpGet]
    public async Task<IActionResult> ListarTodas()
    {
        var lista = await _service.ListarTodasAsync();

        var resultado = lista.Select(t => new
        {
            id = t.Id,
            descricao = t.Descricao,
            valor = t.Valor,
            tipo = t.Tipo,
            pessoaId = t.PessoaId,
            nomePessoa = t.Pessoa?.Nome ?? string.Empty
        }).ToList();

        return Ok(resultado);
    }

    // Cadastra nova transação
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] Transacao transacao)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var nova = await _service.CriarAsync(transacao);
        return CreatedAtAction(nameof(ObterPorId), new { id = nova.Id }, nova);
    }

    // Busca uma transação por ID
    [HttpGet("{id}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var t = await _service.ObterPorIdAsync(id);
        if (t == null)
            return NotFound();

        return Ok(new
        {
            id = t.Id,
            descricao = t.Descricao,
            valor = t.Valor,
            tipo = t.Tipo,
            pessoaId = t.PessoaId,
            nomePessoa = t.Pessoa?.Nome ?? string.Empty
        });
    }

    // Exclui uma transação
    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var ok = await _service.ExcluirAsync(id);
        return ok ? NoContent() : NotFound();
    }
}
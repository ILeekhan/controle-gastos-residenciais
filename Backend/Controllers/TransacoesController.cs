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
    private readonly IPessoaService _pessoaService; // ✅ Adicionado para verificar dados da pessoa

    // ✅ Construtor com injeção de dependência
    public TransacoesController(ITransacaoService service, IPessoaService pessoaService)
    {
        _service = service;
        _pessoaService = pessoaService;
    }

    /// <summary>
    /// Retorna o resumo financeiro: totais por pessoa e total geral
    /// </summary>
    [HttpGet("totais")]
    public async Task<IActionResult> ObterTotais()
    {
        var lista = await _service.ListarTodasAsync();

        // Cálculo dos valores gerais
        var totalReceitas = lista.Where(t => t.Tipo == 0).Sum(t => t.Valor);
        var totalDespesas = lista.Where(t => t.Tipo == 1).Sum(t => t.Valor);
        var saldoLiquido = totalReceitas - totalDespesas;

        // Cálculo dos valores por pessoa
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

    /// <summary>
    /// Lista todas as transações cadastradas
    /// </summary>
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

    /// <summary>
    /// Cadastra uma nova transação com todas as validações e regras de negócio
    /// Regra: Pessoas menores de 18 anos só podem registrar despesas
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] Transacao transacao)
    {
        // Validação básica dos dados recebidos
        if (!ModelState.IsValid)
        {
            var erros = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage);

            return BadRequest(new { Mensagem = "Dados inválidos", Erros = erros });
        }

        // Validação: valor deve ser maior que zero
        if (transacao.Valor <= 0)
            return BadRequest(new { Mensagem = "O valor da transação deve ser maior que zero." });

        // Validação: tipo deve ser 0 (Receita) ou 1 (Despesa)
        if (transacao.Tipo != 0 && transacao.Tipo != 1)
            return BadRequest(new { Mensagem = "Tipo inválido. Use 0 para Receita ou 1 para Despesa." });

        // Validação: pessoa informada existe no cadastro
        var pessoa = await _pessoaService.ObterPorIdAsync(transacao.PessoaId);
        if (pessoa == null)
            return BadRequest(new { Mensagem = "Pessoa não encontrada. Informe um ID de pessoa válido." });

        // ✅ REGRA DE NEGÓCIO OBRIGATÓRIA PARA O DESAFIO
        if (pessoa.Idade < 18 && transacao.Tipo == 0)
        {
            return BadRequest(new
            {
                Mensagem = "Regra de negócio: Pessoas menores de 18 anos não podem cadastrar receitas, apenas despesas."
            });
        }

        // Se passou por todas as validações, salva a transação
        var novaTransacao = await _service.CriarAsync(transacao);
        return CreatedAtAction(nameof(ObterPorId), new { id = novaTransacao.Id }, novaTransacao);
    }

    /// <summary>
    /// Busca uma transação pelo seu ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> ObterPorId(int id)
    {
        var transacao = await _service.ObterPorIdAsync(id);
        if (transacao == null)
            return NotFound(new { Mensagem = "Transação não encontrada." });

        return Ok(new
        {
            id = transacao.Id,
            descricao = transacao.Descricao,
            valor = transacao.Valor,
            tipo = transacao.Tipo,
            pessoaId = transacao.PessoaId,
            nomePessoa = transacao.Pessoa?.Nome ?? string.Empty
        });
    }

    /// <summary>
    /// Exclui uma transação pelo seu ID
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var excluido = await _service.ExcluirAsync(id);
        return excluido ? NoContent() : NotFound(new { Mensagem = "Transação não encontrada." });
    }
}
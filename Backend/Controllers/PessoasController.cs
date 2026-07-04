using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PessoasController : ControllerBase
{
    private readonly IPessoaService _service;

    public PessoasController(IPessoaService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<ActionResult<Pessoa>> Criar([FromBody] Pessoa pessoa)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var novaPessoa = await _service.CriarAsync(pessoa);
        return CreatedAtAction(nameof(ObterPorId), new { id = novaPessoa.Id }, novaPessoa);
    }

    [HttpGet]
    public async Task<ActionResult<List<Pessoa>>> ListarTodas()
    {
        var pessoas = await _service.ListarTodasAsync();
        return Ok(pessoas);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Pessoa>> ObterPorId(int id)
    {
        var pessoa = await _service.ObterPorIdAsync(id);
        if (pessoa == null)
            return NotFound();

        return Ok(pessoa);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        var excluido = await _service.ExcluirAsync(id);
        if (!excluido)
            return NotFound();

        return NoContent();
    }
}
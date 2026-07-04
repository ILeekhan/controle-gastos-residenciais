using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Transacao
{
    [Key]
    public int Id { get; set; }

    // 0 = Receita | 1 = Despesa (igual ao Frontend)
    public int Tipo { get; set; }

    public decimal Valor { get; set; }

    public string? Descricao { get; set; }
    public DateTime DataHora { get; set; } = DateTime.UtcNow;

    public int PessoaId { get; set; }
    public Pessoa? Pessoa { get; set; }
}
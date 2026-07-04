using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class Pessoa
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O nome é obrigatório")]
    [StringLength(80, MinimumLength = 2, ErrorMessage = "O nome deve ter entre 2 e 80 caracteres")]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "A idade é obrigatória")]
    [Range(1, 120, ErrorMessage = "Informe uma idade válida entre 1 e 120 anos")]
    public int Idade { get; set; }

    [JsonIgnore]
    public List<Transacao> Transacoes { get; set; } = new();
}
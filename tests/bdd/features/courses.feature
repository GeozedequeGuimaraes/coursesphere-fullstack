Feature: Gestao de cursos
  Como usuario autenticado
  Quero criar e remover cursos
  Para manter minha biblioteca organizada

  Scenario: Criar e excluir um curso
    Given que estou autenticado
    When crio um curso com dados validos
    Then devo ver o curso criado na area de trabalho
    When excluo o curso criado
    Then o curso nao deve aparecer na listagem

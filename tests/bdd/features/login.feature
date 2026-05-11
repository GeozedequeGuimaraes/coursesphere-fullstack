Feature: Login na plataforma
  Como instrutor cadastrado
  Quero acessar minha area de cursos
  Para continuar organizando meus conteudos

  Scenario: Entrar com usuario de teste
    Given que estou na tela de login
    When preencho o login com o usuario de teste
    And envio o formulario de login
    Then devo acessar a area de trabalho

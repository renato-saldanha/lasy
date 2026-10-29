-- Dados ficticios para a conta de demonstracao.
-- 1) Crie o usuario em Authentication > Users > Add user (marque "Auto Confirm User").
-- 2) Se usar outro e-mail, troque o valor abaixo.
-- 3) Rode este script no SQL Editor. Ele pode ser executado de novo: refaz os dados do usuario.

DO $$
DECLARE
  demo_user UUID;
  demo_email TEXT := 'demo@demo.example';
BEGIN
  SELECT id INTO demo_user FROM auth.users WHERE email = demo_email;

  IF demo_user IS NULL THEN
    RAISE EXCEPTION 'Usuario % nao encontrado. Crie-o em Authentication > Users.', demo_email;
  END IF;

  DELETE FROM leads WHERE user_id = demo_user;

  INSERT INTO leads (nome, email, telefone, empresa, observacoes, status, origem, user_id) VALUES
    ('Ana Souza', 'ana.souza@exemplo.test', '(65) 90000-0001', 'Loja Horizonte', 'Pediu orcamento do plano anual.', 'novo', 'Site', demo_user),
    ('Bruno Lima', 'bruno.lima@exemplo.test', '(65) 90000-0002', 'Mercado Central', 'Conheceu a empresa em uma feira.', 'novo', 'Evento', demo_user),
    ('Carla Menezes', 'carla.menezes@exemplo.test', '(65) 90000-0003', 'Clinica Vida', 'Quer uma demonstracao do produto.', 'contato', 'Indicacao', demo_user),
    ('Diego Ramos', 'diego.ramos@exemplo.test', '(65) 90000-0004', 'Ramos Contabilidade', 'Retornar na proxima semana.', 'contato', 'Site', demo_user),
    ('Elisa Prado', 'elisa.prado@exemplo.test', '(65) 90000-0005', 'Padaria Sabor', 'Tem interesse, falta aprovar o orcamento.', 'qualificado', 'Redes sociais', demo_user),
    ('Fabio Nogueira', 'fabio.nogueira@exemplo.test', '(65) 90000-0006', 'Oficina FN', 'Ja usa outra ferramenta e quer comparar.', 'qualificado', 'Site', demo_user),
    ('Gabriela Torres', 'gabriela.torres@exemplo.test', '(65) 90000-0007', 'Studio GT', 'Proposta enviada, aguardando resposta.', 'proposta', 'Indicacao', demo_user),
    ('Heitor Campos', 'heitor.campos@exemplo.test', '(65) 90000-0008', 'Campos Engenharia', 'Negociando condicoes de pagamento.', 'proposta', 'Evento', demo_user),
    ('Isabela Freitas', 'isabela.freitas@exemplo.test', '(65) 90000-0009', 'Freitas Odontologia', 'Contrato assinado.', 'fechado', 'Indicacao', demo_user),
    ('Joao Pereira', 'joao.pereira@exemplo.test', '(65) 90000-0010', 'Pereira Transportes', 'Fechou o plano mensal.', 'fechado', 'Site', demo_user),
    ('Karina Alves', 'karina.alves@exemplo.test', '(65) 90000-0011', 'Alves Moda', 'Escolheu outro fornecedor.', 'perdido', 'Redes sociais', demo_user),
    ('Lucas Barros', 'lucas.barros@exemplo.test', '(65) 90000-0012', 'Barros Informatica', 'Sem orcamento no momento.', 'perdido', 'Site', demo_user);

  INSERT INTO interactions (lead_id, tipo, descricao, user_id)
  SELECT id, 'telefone', 'Primeiro contato por telefone, apresentou a solucao.', demo_user
  FROM leads WHERE user_id = demo_user AND status IN ('contato', 'qualificado', 'proposta', 'fechado');

  INSERT INTO interactions (lead_id, tipo, descricao, user_id)
  SELECT id, 'email', 'Enviou material com precos e condicoes.', demo_user
  FROM leads WHERE user_id = demo_user AND status IN ('qualificado', 'proposta', 'fechado');

  INSERT INTO interactions (lead_id, tipo, descricao, user_id)
  SELECT id, 'reuniao', 'Reuniao de apresentacao realizada.', demo_user
  FROM leads WHERE user_id = demo_user AND status IN ('proposta', 'fechado');
END $$;

import { getErrorMessage } from '@/lib/errors';

describe('getErrorMessage', () => {
  it('usa a mensagem de um Error', () => {
    expect(getErrorMessage(new Error('falhou'), 'padrao')).toBe('falhou');
  });

  it('usa a mensagem de um objeto de erro simples (como o do Supabase)', () => {
    expect(
      getErrorMessage({ code: 'PGRST205', message: "Could not find the table 'public.leads'" }, 'padrao')
    ).toBe("Could not find the table 'public.leads'");
  });

  it('usa o texto padrao quando nao ha mensagem', () => {
    expect(getErrorMessage({}, 'padrao')).toBe('padrao');
    expect(getErrorMessage(null, 'padrao')).toBe('padrao');
  });
});

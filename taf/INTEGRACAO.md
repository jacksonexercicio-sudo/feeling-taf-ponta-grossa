# Feeling TAF — nova landing page

## Estado
- Nova landing criada na pasta `/taf/`, sem substituir `/index.html` anterior.
- Google Sheet privado: https://docs.google.com/spreadsheets/d/1Ug_7UtxbkNC40a8tXL_aZIrIuC-tS2ICRPHHXwmCjI8/edit
- Apps Script de integração: `/taf/apps-script/Code.gs`.
- **Ainda não está integrada ao endpoint real.** O botão é intencionalmente desativado até o deploy e o teste.

## Ativação final (Google Apps Script)
1. Abrir [Google Apps Script](https://script.google.com/home) na conta que detém o Google Sheet.
2. Criar projeto ou abrir o projeto Feeling TAF.
3. Substituir o arquivo `Código.gs` pelo [código completo](https://raw.githubusercontent.com/jacksonexercicio-sudo/feeling-taf-ponta-grossa/main/taf/apps-script/Code.gs). Salvar.
4. Implantar > Nova implantação > Aplicativo da Web: Executar como **Eu**; Quem tem acesso: **Qualquer pessoa**. Autorizar as permissões de envio de e-mail e planilha exigidas pelo Google. **Não tornar pública a planilha de leads.**
5. Copiar a URL exata terminada em `/exec`. No arquivo `/taf/index.html`, substituir o literal `__APPS_SCRIPT_URL__` **nas duas ocorrências de string da mesma constante (mantendo o teste condicional coerente)**. Melhor: trocar `const scriptUrl = "__APPS_SCRIPT_URL__";` por URL real e retirar a condicional de formulário desativado:
   - Remover o bloco `if(scriptUrl==="__APPS_SCRIPT_URL__"){btn.disabled=true;status.textContent=msg;status.classList.add("show");}`
   - Remover o bloco condicional no submit com o mesmo teste.
   - Fixar `form.action=scriptUrl;` após os validadores.
6. Confirmar publicação GitHub Pages e acessar `/taf/`.
7. Fazer uma inscrição com e-mail real de teste, sem aceite de marketing; conferir registro na aba `Leads TAF`, coluna S = ENVIADO, recebimento de mensagem e abertura do guia. Fazer outro teste com aceite de marketing; conferir coluna P = SIM.
8. Conferir formulário no Android e em desktop; somente depois divulgar amplamente.

## Fluxo
GitHub Pages -> Google Apps Script (POST) -> Google Sheets (registro privado) -> MailApp (guia enviado) -> Página de agradecimento.

## Limitações e cuidados
- Não afirmar que o envio automático está funcionando sem testes reais ponta a ponta.
- Para captação em escala, adicionar proteção anti-spam/cotas, política de retenção formal e revisão de LGPD.
- O guia geral é educativo; não deve ser confundido com plano individualizado nem com índices oficiais de um concurso específico.

# Feeling TAF — nova landing page

## Estado
- Nova landing criada na pasta `/taf/`, sem substituir `/index.html` anterior.
- Google Sheet privado: https://docs.google.com/spreadsheets/d/1Ug_7UtxbkNC40a8tXL_aZIrIuC-tS2ICRPHHXwmCjI8/edit
- Apps Script de integração: `/taf/apps-script/Code.gs`.
- **STATUS EM 26/10/2026: INTEGRAÇÃO BLOQUEADA.** A landing page já está publicada, mas o botão de cadastro foi mantido intencionalmente desativado. O projeto Google Apps Script foi criado, porém o arquivo Código.gs permanece vazio apesar das tentativas de preenchimento via automação web. Um endereço /exec foi gerado, mas retorna `Script function not found: doGet`; não usá-lo até corrigir e validar.

## Ativação final (Google Apps Script)
1. Abrir [projeto existente Feeling TAF](https://script.google.com/home/projects/1FyDqXrWqmN7i8H3ZnQBm-4Cz-bLaHy8xNFZBvDTAECdL57Zg70x0TYQy/edit) na conta que detém o Google Sheet.
2. Selecionar arquivo `Código.gs`, clicar dentro da área de código e confirmar que está vazia; o editor automatizado não conseguiu inserir o conteúdo.
3. Substituir o arquivo `Código.gs` pelo [código completo](https://raw.githubusercontent.com/jacksonexercicio-sudo/feeling-taf-ponta-grossa/main/taf/apps-script/Code.gs). Salvar.
4. Conferir após **recarregar a página** que há `function doGet()` e `function doPost(e)`; se estiver vazio, repetir colagem manual. Em seguida: Implantar > Nova implantação > Aplicativo da Web: Executar como **Eu**; Quem tem acesso: **Qualquer pessoa**. Autorizar as permissões de envio de e-mail e planilha exigidas pelo Google. **Não tornar pública a planilha de leads.**
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

## Verificação negativa já realizada
- URL de implantação antiga: `https://script.google.com/macros/s/AKfycbxy-mWZ9_4SZBheJMKvG_n7QhoVYX7qIFwP2QovGvLvPO2bh7EQqmYvbeAlT6dF2_4Pog/exec`.
- Resultado real: `Script function not found: doGet`.
- A automação do navegador não conseguiu inserir conteúdo no editor Monaco; mais tentativas idênticas não comprovam funcionamento.
- **Não habilitar o formulário** até uma URL `/exec` funcional, teste de cadastro com opt-in desmarcado, confirmação de recebimento no e-mail e leitura do status ENVIADO no Sheets.

/**
 * Feeling TAF — Google Apps Script backend
 * Implantar como Web App: executar como proprietário; acesso: qualquer pessoa.
 * A URL /exec resultante deve substituir __APPS_SCRIPT_URL__ em taf/index.html.
 * Planilha proprietária restrita; NÃO incorporar token, chave ou ID de cliente no front-end.
 */
const CONFIG = Object.freeze({
 SHEET_ID:'1Ug_7UtxbkNC40a8tXL_aZIrIuC-tS2ICRPHHXwmCjI8',
 LEADS_TAB:'Leads TAF',
 EBOOK_URL:'https://jacksonexercicio-sudo.github.io/feeling-taf-ponta-grossa/taf/guia.html',
 SUCCESS_URL:'https://jacksonexercicio-sudo.github.io/feeling-taf-ponta-grossa/taf/obrigado.html',
 POLICY_VERSION:'2026-10-26',
 ADMIN_EMAIL:'jacksonexercicio@gmail.com',
});
function clean_(v, n){return String(v===undefined?'':v).trim().slice(0,n||200);}
function enc_(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function respond_(msg,ok){ const safe=enc_(msg);return HtmlService.createHtmlOutput('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Feeling TAF</title><body style="font-family:Arial;padding:40px;max-width:680px;margin:auto"><h1>'+ (ok?'Inscrição recebida':'Não foi possível concluir')+'</h1><p>'+safe+'</p><a href="https://jacksonexercicio-sudo.github.io/feeling-taf-ponta-grossa/taf/">Voltar ao formulário</a></body></html>');}
function doGet(){return respond_('Página de recebimento de inscrições Feeling TAF. Para receber o guia, utilize o formulário da Feeling.',true);}
function doPost(e) {
 const p=e&&e.parameter?e.parameter:{};
 if(p.website) return respond_('Recebemos sua solicitação.',true);
 const nome=clean_(p.nome,90), email=clean_(p.email,120).toLowerCase(), telefone=clean_(p.whatsapp,30).replace(/\D/g,''),
 cidade='', concurso=clean_(p.concurso,100), etapa='', modalidade='';
 if(nome.length<3||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!/^[1-9][0-9]{9,10}$/.test(telefone)||!concurso || p.ciencia_privacidade!=='SIM'){
  return respond_('Confira os dados obrigatórios e confirme a ciência da política de privacidade.',false);
 }
 const optin=p.consentimento_comercial==='SIM'?'SIM':'NÃO';
 const tz='America/Sao_Paulo', now=new Date(), stamp=Utilities.formatDate(now,tz,'yyyy-MM-dd HH:mm:ss');
 const id=Utilities.getUuid();
 const ss=SpreadsheetApp.openById(CONFIG.SHEET_ID), sheet=ss.getSheetByName(CONFIG.LEADS_TAB);
 if(!sheet) throw new Error('Aba de inscrições indisponível');
 const row=[id,stamp,nome,email,telefone,cidade,concurso,'',etapa,'',modalidade,clean_(p.pagina_origem,300),clean_(p.utm_source,100),clean_(p.utm_medium,100),clean_(p.utm_campaign,100),optin,CONFIG.POLICY_VERSION,'Guia Geral Feeling TAF','PENDENTE','','Novo','','','', 'Google Apps Script',id];
 const lock=LockService.getScriptLock();
 try {lock.waitLock(10000);sheet.appendRow(row);} finally {lock.releaseLock();}
 const rowIndex=sheet.getLastRow();
 let sent=false,error='';
 try {
  const subject='Seu Guia Feeling TAF gratuito está aqui';
  const text='Olá, '+nome+'!\n\nSeu Guia Geral de Preparação para o TAF está disponível: '+CONFIG.EBOOK_URL+'\n\nÉ um material informativo, não substitui o edital nem constitui prescrição individualizada.\n\nQuer conhecer a prescrição individualizada e o Método Feeling TAF? Responda a este e-mail.\n\nO que a Feeling FAZ, faz PENSANDO em VOCÊ!\nAcademia Feeling\n\nPrivacidade: '+CONFIG.SUCCESS_URL.replace('obrigado.html','privacidade.html');
  const html='<p>Olá, <strong>'+enc_(nome)+'</strong>!</p><p>Seu <strong>Guia Geral Feeling TAF</strong> está disponível.</p><p><a href="'+CONFIG.EBOOK_URL+'" style="background:#EBAD18;color:#1E1E1C;padding:14px 20px;text-decoration:none;border-radius:9px;font-weight:bold">ABRIR MEU GUIA GRATUITO</a></p><p>Material informativo; confira sempre o edital do seu concurso.</p><p>Quer um treinamento específico? Conheça nossa <strong>prescrição individualizada e o Método Feeling TAF</strong>.</p><p>O que a Feeling FAZ, faz PENSANDO em VOCÊ!</p>';
  MailApp.sendEmail({to:email,subject,body:text,htmlBody:html,name:'Academia Feeling',replyTo:CONFIG.ADMIN_EMAIL});
  sent=true;
 }catch(err){error=String(err).slice(0,200); console.error('E-book email failed',id,error);}
 try {
  // Procurar pelo ID garante a atualização correta mesmo com cadastros concorrentes.
  const finder=sheet.getRange(2,1,Math.max(1,sheet.getLastRow()-1),1).createTextFinder(id).matchEntireCell(true).findNext();
  const ix=finder?finder.getRow():rowIndex;
  sheet.getRange(ix,19,1,2).setValues([[sent?'ENVIADO':'FALHA',sent?Utilities.formatDate(new Date(),tz,'yyyy-MM-dd HH:mm:ss'):'']]);
 }catch(err){console.error('Unable to update send status',id,err);}
 if(!sent){try{MailApp.sendEmail(CONFIG.ADMIN_EMAIL,'Atenção: falha na entrega do guia Feeling TAF','Lead: '+id+'\nVerifique o registro e reenvie manualmente o guia.');}catch(ignore){}return respond_('Seu cadastro foi registrado, mas a entrega automática falhou. Nossa equipe verificará o envio. Não é necessário preencher novamente.',false);}
 if(optin==='SIM'){try{MailApp.sendEmail(CONFIG.ADMIN_EMAIL,'Novo lead Feeling TAF (opt-in): '+concurso,'Nome: '+nome+'\nContato: '+telefone+'\nE-mail: '+email+'\nConcurso: '+concurso+'\nEtapa: '+etapa+'\nID: '+id);}catch(err){console.warn(err);}}
 return HtmlService.createHtmlOutput('<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url='+CONFIG.SUCCESS_URL+'"><title>Enviado</title><p>Guia enviado! <a href="'+CONFIG.SUCCESS_URL+'">Continuar</a></p></html>');
}

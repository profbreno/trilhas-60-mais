import { getMissionById } from './curriculum'
import type { CommunicationDefinition } from '../domain/missions/types'

const commonFeedback = {
  'previous-step': 'Você voltou para rever a preparação. Confira novamente a prévia antes de simular o envio.',
  'practice-resumed': 'A prática foi retomada com suas escolhas preservadas nesta página.',
  'recipient-selected': 'Destinatário selecionado. Confira também o conteúdo antes de abrir a prévia.',
  'content-selected': 'O recado atende ao pedido. Você ainda pode revisar suas escolhas.',
  'phrase-selected': 'Frase selecionada. A composição continua disponível para revisão.',
  'complete-message': 'Escolha uma saudação, uma frase de confirmação e um fechamento. Não é necessário digitar informações pessoais.',
  'format-selected': 'O formato mudou somente nesta simulação. Áudio e texto são alternativas; não há gravação nem acesso ao microfone.',
  'review-audio-first': 'Confira a transcrição do áudio de exemplo antes de abrir a prévia. Você também pode escolher texto.',
  'audio-reviewed': 'Transcrição conferida. Esse áudio é uma representação fictícia; não foi gravado por você e nenhum som é reproduzido.',
  'file-selected': 'Anexo selecionado, mas ainda não compartilhado. Confira seu conteúdo antes de continuar.',
  'file-purpose': 'Esse arquivo não é o programa solicitado. Revise o nome e a descrição. Nenhum material saiu desta simulação.',
  'private-file': 'Essa imagem contém informação pessoal fictícia desnecessária para o pedido. Não a compartilhe. Remova o anexo e escolha o programa da oficina. Nada foi enviado.',
  'inspect-first': 'Abra “Conferir arquivo selecionado” para conhecer o conteúdo do anexo antes da prévia.',
  'file-inspected': 'Conteúdo do arquivo aberto. Compare-o com o pedido; conferir não significa enviar.',
  'attachment-removed': 'Anexo removido somente desta composição. Você pode escolher outro arquivo sem penalização.',
  'preview-ready': 'Esta é a prévia. Confira destinatário e conteúdo; você pode voltar para corrigir antes de simular o envio.',
  'draft-editable': 'A preparação está editável, com suas escolhas preservadas. Abra e confira uma nova prévia depois das alterações.',
  'review-confirmed': 'Revisão confirmada para esta prévia. Agora você pode simular o envio.',
  'review-cleared': 'A confirmação de revisão foi desmarcada. Confira a prévia antes do envio simulado.',
  'review-first': 'Primeiro confira o destinatário e o conteúdo e marque a confirmação de revisão. A simples visualização não envia nem conclui a prática.',
  'use-current-step': 'Use os controles da etapa atual. A ajuda explica como preparar, revisar ou corrigir as escolhas.',
}

function definition(id: 'M03' | 'M04', mode: 'message' | 'file'): CommunicationDefinition {
  const approved = getMissionById(id)!
  const message = mode === 'message'
  return {
    id, unitId: 'U02', routeId: id.toLowerCase(), version: '0.1.0-u02.1', kind: 'communication', mode,
    criteria: [
      { id: 'prepared', label: message ? 'Preparar confirmação e destinatário pertinentes' : 'Conferir arquivo, destinatário e recado de contexto' },
      { id: 'reviewed', label: 'Conferir destinatário e conteúdo na prévia' },
      { id: 'sent', label: message ? 'Confirmar envio simulado' : 'Confirmar compartilhamento simulado' },
    ],
    rules: message ? { recipientId: 'grupo-leitura', acceptedContentIds: ['confirmo', 'estarei'] } : { recipientId: 'equipe-leitura', acceptedContentIds: ['segue-programa', 'programacao'], fileId: 'programa' },
    content: {
      title: approved.title, objective: approved.objective, introduction: approved.scenario,
      request: message ? 'Confirme sua participação no encontro do Grupo de leitura.' : 'A pessoa da equipe de leitura pediu o programa da oficina. Envie apenas esse material para ela.',
      instructions: message ? [
        'Escolha Grupo de leitura e monte o recado com saudação, confirmação e fechamento.',
        'Texto e representação de áudio com transcrição são caminhos equivalentes. Não há gravação real.',
        'Abra a prévia, confira destinatário e conteúdo e confirme o envio simulado.',
      ] : [
        'Escolha o programa da oficina na coleção de exemplo e confira seu conteúdo.',
        'Selecione a pessoa da equipe de leitura e uma frase que identifique o conteúdo.',
        'Revise a prévia e confirme o compartilhamento simulado. Você pode remover anexos ou corrigir escolhas.',
      ],
      help: 'Tudo ocorre nesta página, com dados inventados. Não abra seus contatos, arquivos ou aplicativos reais. Use os controles nomeados; pedir ajuda não retira objetivos praticados.',
      recognition: message ? 'Você preparou uma confirmação, conferiu o grupo e revisou antes de simular o envio. Pode praticar novamente com outras frases.' : 'Você escolheu o programa, conferiu seu conteúdo e destinatário e revisou antes de simular o compartilhamento.',
      steps: {
        prepare: {
          title: message ? 'Prepare a confirmação para o grupo' : 'Prepare o material solicitado',
          instruction: message ? 'Escolha o destinatário e as frases do recado.' : 'Escolha e confira o programa; indique destinatário e recado.',
          help: message ? 'O pedido é confirmar participação para o Grupo de leitura. Escolha uma frase de cada grupo. Se optar por áudio, confira a transcrição de exemplo; ninguém está gravando sua voz.' : 'Compare nome, tipo, descrição e conteúdo com o pedido. O documento pessoal sintético não é necessário. Remova-o se o tiver anexado; escolha a pessoa indicada, não o grupo público.',
        },
        preview: { title: 'Confira antes de simular o envio', instruction: 'Revise destinatário e conteúdo. Confirme a revisão ou volte para corrigir.', help: 'A prévia ainda não é um envio. Se precisar mudar qualquer escolha, use “Corrigir escolhas”. Depois de conferir, marque a revisão e use o botão de simulação.' },
        done: { title: 'Comunicação praticada', instruction: 'O envio foi somente simulado nesta página.', help: 'Você pode repetir ou voltar ao percurso. Não houve mensagem enviada, arquivo compartilhado ou progresso salvo fora desta página.' },
      },
      feedback: {
        ...commonFeedback,
        'recipient-purpose': message ? 'Esse destino não é o grupo pedido. Escolha Grupo de leitura; sua composição será preservada.' : 'O pedido veio da pessoa da equipe de leitura, não de um grupo público. Revise o destinatário antes de compartilhar.',
        'content-purpose': message ? 'Esse recado fala de outro assunto. Escolha uma frase que confirme a participação no encontro. As demais escolhas continuam disponíveis.' : 'O recado precisa identificar o programa enviado. Escolha uma frase que explique esse conteúdo.',
        'communication-done': message ? 'Seu recado confirma a participação e foi dirigido ao grupo certo. A revisão ajudou a conferir a mensagem. Envio apenas simulado.' : 'Você selecionou o programa e conferiu quem vai recebê-lo. O recado explica o conteúdo. Compartilhamento apenas simulado.',
      },
      recipients: message ? [
        { id: 'grupo-leitura', label: 'Grupo de leitura' }, { id: 'jardinagem', label: 'Grupo de jardinagem' }, { id: 'pessoa-oficina', label: 'Pessoa da oficina — contato fictício' },
      ] : [
        { id: 'equipe-leitura', label: 'Pessoa da equipe de leitura — contato fictício' }, { id: 'grupo-publico', label: 'Grupo público do bairro — fictício' },
      ],
      phrases: message ? [
        { id: 'confirmo', label: 'Confirmo minha participação no encontro de leitura.' }, { id: 'estarei', label: 'Estarei no encontro do grupo de leitura.' }, { id: 'outro-assunto', label: 'Gostaria de saber sobre a oficina de jardinagem.' },
      ] : [
        { id: 'segue-programa', label: 'Segue o programa da oficina de leitura.' }, { id: 'programacao', label: 'Aqui está a programação solicitada para a oficina.' }, { id: 'imagem', label: 'Veja esta imagem que encontrei.' },
      ],
      ...(message ? {
        greetings: [{ id: 'ola', label: 'Olá, grupo!' }, { id: 'bom-dia', label: 'Bom dia, pessoal!' }],
        closings: [{ id: 'obrigado', label: 'Agradeço pelo convite.' }, { id: 'ate', label: 'Até o encontro!' }],
      } : {
        files: [
          { id: 'programa', label: 'Programa da oficina de leitura', type: 'Texto de exemplo', description: 'Programação solicitada pela pessoa da equipe.', body: 'Programa fictício: acolhida, leitura compartilhada e conversa sobre o livro. Material público da oficina, sem dados pessoais.' },
          { id: 'cartaz', label: 'Cartaz ilustrado da oficina', type: 'Imagem de exemplo', description: 'Convite ilustrado; não contém o programa solicitado.', body: 'Cartaz público fictício de convite à oficina. É outro material, não a programação pedida.', image: { src: '/simulations/cartaz-oficina.svg', alt: 'Cartaz ilustrado fictício convidando para uma oficina de leitura.' } },
          { id: 'documento', label: 'Documento pessoal sintético', type: 'Imagem de exemplo', description: 'Exemplo com informação pessoal inventada, desnecessária para o pedido. Sem validade.', body: 'EXEMPLO FICTÍCIO, SEM VALIDADE. Nome: Pessoa Fictícia. Contato: CONTATO INVENTADO. Esses campos não pertencem a pessoas reais. Não é programa de oficina e não deve ser compartilhado neste pedido.', privateExample: true, image: { src: '/simulations/documento-ficticio.svg', alt: 'Ilustração de documento inventado, marcada sem validade e com campos de nome e contato fictícios; não é o programa solicitado.' } },
        ],
      }),
    },
  }
}

export const messageMission = definition('M03', 'message')
export const sharingMission = definition('M04', 'file')

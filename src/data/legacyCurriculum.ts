import type { UnitId } from '../domain/curriculum'

export interface LegacyCurriculumRoute {
  path: string
  oldId: string
  title: string
  level: 'unit' | 'mission'
  relatedUnitIds: readonly UnitId[]
}

// Relações temáticas revisadas por conteúdo: não são aliases nem redirecionamentos.
export const legacyCurriculumRoutes: readonly LegacyCurriculumRoute[] = [
  {
    "path": "/trilhas/primeiros-passos/unidades/conhecendo-o-celular",
    "oldId": "conhecendo-o-celular",
    "title": "Conhecendo o celular",
    "level": "unit",
    "relatedUnitIds": [
      "U01"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/conhecendo-o-celular/missoes/conhecendo-o-celular-1",
    "oldId": "conhecendo-o-celular-1",
    "title": "Reconhecer os botões e a tela",
    "level": "mission",
    "relatedUnitIds": [
      "U01"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/conhecendo-o-celular/missoes/conhecendo-o-celular-2",
    "oldId": "conhecendo-o-celular-2",
    "title": "Experimentar toques e gestos",
    "level": "mission",
    "relatedUnitIds": [
      "U01"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/conexoes-e-ajustes",
    "oldId": "conexoes-e-ajustes",
    "title": "Conexões e ajustes",
    "level": "unit",
    "relatedUnitIds": [
      "U01"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/conexoes-e-ajustes/missoes/conexoes-e-ajustes-1",
    "oldId": "conexoes-e-ajustes-1",
    "title": "Conhecer a conexão Wi-Fi",
    "level": "mission",
    "relatedUnitIds": [
      "U01"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/conexoes-e-ajustes/missoes/conexoes-e-ajustes-2",
    "oldId": "conexoes-e-ajustes-2",
    "title": "Ajustar texto e volume",
    "level": "mission",
    "relatedUnitIds": [
      "U01"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/comunicacao",
    "oldId": "comunicacao",
    "title": "Comunicação no dia a dia",
    "level": "unit",
    "relatedUnitIds": [
      "U02",
      "U03"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/comunicacao/missoes/comunicacao-1",
    "oldId": "comunicacao-1",
    "title": "Conhecer as mensagens",
    "level": "mission",
    "relatedUnitIds": [
      "U02"
    ]
  },
  {
    "path": "/trilhas/primeiros-passos/unidades/comunicacao/missoes/comunicacao-2",
    "oldId": "comunicacao-2",
    "title": "Explorar uma busca",
    "level": "mission",
    "relatedUnitIds": [
      "U03"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/senhas",
    "oldId": "senhas",
    "title": "Senhas e proteção",
    "level": "unit",
    "relatedUnitIds": [
      "U05"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/senhas/missoes/senhas-1",
    "oldId": "senhas-1",
    "title": "Reconhecer uma senha forte",
    "level": "mission",
    "relatedUnitIds": [
      "U05"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/senhas/missoes/senhas-2",
    "oldId": "senhas-2",
    "title": "Conhecer a proteção em duas etapas",
    "level": "mission",
    "relatedUnitIds": [
      "U05"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/golpes",
    "oldId": "golpes",
    "title": "Atenção aos golpes",
    "level": "unit",
    "relatedUnitIds": [
      "U06"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/golpes/missoes/golpes-1",
    "oldId": "golpes-1",
    "title": "Observar uma mensagem suspeita",
    "level": "mission",
    "relatedUnitIds": [
      "U06"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/golpes/missoes/golpes-2",
    "oldId": "golpes-2",
    "title": "Conferir antes de agir",
    "level": "mission",
    "relatedUnitIds": [
      "U06"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/informacoes",
    "oldId": "informacoes",
    "title": "Informações com cuidado",
    "level": "unit",
    "relatedUnitIds": [
      "U04"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/informacoes/missoes/informacoes-1",
    "oldId": "informacoes-1",
    "title": "Investigar a origem",
    "level": "mission",
    "relatedUnitIds": [
      "U04"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/informacoes/missoes/informacoes-2",
    "oldId": "informacoes-2",
    "title": "Comparar informações",
    "level": "mission",
    "relatedUnitIds": [
      "U04"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/privacidade",
    "oldId": "privacidade",
    "title": "Privacidade no cotidiano",
    "level": "unit",
    "relatedUnitIds": [
      "U05",
      "U09"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/privacidade/missoes/privacidade-1",
    "oldId": "privacidade-1",
    "title": "Reconhecer dados pessoais",
    "level": "mission",
    "relatedUnitIds": [
      "U05"
    ]
  },
  {
    "path": "/trilhas/seguranca/unidades/privacidade/missoes/privacidade-2",
    "oldId": "privacidade-2",
    "title": "Conhecer permissões de aplicativos",
    "level": "mission",
    "relatedUnitIds": [
      "U09"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/servicos",
    "oldId": "servicos",
    "title": "Serviços digitais",
    "level": "unit",
    "relatedUnitIds": [
      "U08"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/servicos/missoes/servicos-1",
    "oldId": "servicos-1",
    "title": "Reconhecer um serviço oficial",
    "level": "mission",
    "relatedUnitIds": [
      "U08"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/servicos/missoes/servicos-2",
    "oldId": "servicos-2",
    "title": "Planejar um atendimento",
    "level": "mission",
    "relatedUnitIds": [
      "U08"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/participacao",
    "oldId": "participacao",
    "title": "Participação e convivência",
    "level": "unit",
    "relatedUnitIds": [
      "U02",
      "U03"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/participacao/missoes/participacao-1",
    "oldId": "participacao-1",
    "title": "Conversar com respeito",
    "level": "mission",
    "relatedUnitIds": [
      "U02"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/participacao/missoes/participacao-2",
    "oldId": "participacao-2",
    "title": "Encontrar iniciativas da comunidade",
    "level": "mission",
    "relatedUnitIds": [
      "U03"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/aprender-sempre",
    "oldId": "aprender-sempre",
    "title": "Continuar aprendendo",
    "level": "unit",
    "relatedUnitIds": [
      "U10"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/aprender-sempre/missoes/aprender-sempre-1",
    "oldId": "aprender-sempre-1",
    "title": "Escolher algo para aprender",
    "level": "mission",
    "relatedUnitIds": [
      "U10"
    ]
  },
  {
    "path": "/trilhas/cidadania/unidades/aprender-sempre/missoes/aprender-sempre-2",
    "oldId": "aprender-sempre-2",
    "title": "Construir um plano de autonomia",
    "level": "mission",
    "relatedUnitIds": [
      "U10"
    ]
  }
]

export const getLegacyCurriculumRoute = (pathname: string) => legacyCurriculumRoutes.find((route) => route.path === pathname.replace(/\/+$/, ''))

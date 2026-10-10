import { useEffect, useMemo, useState } from 'react'
import {
  Home, Users, MapPinned, Package, CalendarDays, BarChart3, Store, ClipboardList, Share2,
  Truck, CloudSun, FileBarChart, Settings, Bell, Search, ChevronDown, Sprout, Menu,
} from 'lucide-react'
import { useStore } from './store'
import { todayISO, daysBetween, fmtDate } from './lib/utils'

import Dashboard from './pages/Dashboard'
import { Produtores, Propriedades, Produtos } from './pages/Cadastros'
import Calendario from './pages/Calendario'
import Producao from './pages/Producao'
import Mercados from './pages/Mercados'
import Demandas from './pages/Demandas'
import Canais from './pages/Canais'
import Logistica from './pages/Logistica'
import ClimaRiscos from './pages/ClimaRiscos'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'

const NAV = [
  { id: 'inicio', label: 'Início', icon: Home, el: Dashboard },
  { id: 'produtores', label: 'Produtores', icon: Users, el: Produtores },
  { id: 'propriedades', label: 'Propriedades', icon: MapPinned, el: Propriedades },
  { id: 'produtos', label: 'Produtos', icon: Package, el: Produtos },
  { id: 'calendario', label: 'Calendário', icon: CalendarDays, el: Calendario },
  { id: 'producao', label: 'Produção', icon: BarChart3, el: Producao },
  { id: 'mercados', label: 'Mercados', icon: Store, el: Mercados },
  { id: 'demandas', label: 'Demandas', icon: ClipboardList, el: Demandas },
  { id: 'canais', label: 'Canais de Comercialização', icon: Share2, el: Canais },
  { id: 'logistica', label: 'Logística', icon: Truck, el: Logistica },
  { id: 'clima', label: 'Clima e Riscos', icon: CloudSun, el: ClimaRiscos },
  { id: 'relatorios', label: 'Relatórios', icon: FileBarChart, el: Relatorios },
]
const CONFIG = { id: 'config', label: 'Configurações', icon: Settings, el: Configuracoes }
const ALL = [...NAV, CONFIG]

const pageFromHash = () => {
  const id = window.location.hash.replace('#/', '').replace('#', '')
  return ALL.some((n) => n.id === id) ? id : 'inicio'
}

export default function App() {
  const { state } = useStore()
  const [page, setPage] = useState(pageFromHash)
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState('')
  const [showNotif, setShowNotif] = useState(false)

  useEffect(() => {
    const h = () => setPage(pageFromHash())
    window.addEventListener('hashchange', h)
    return () => window.removeEventListener('hashchange', h)
  }, [])

  const go = (id) => {
    window.location.hash = '#/' + id
    setMenuOpen(false)
    setQ('')
    setShowNotif(false)
    window.scrollTo({ top: 0 })
  }

  // busca global
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (t.length < 2) return []
    const pn = (id) => state.produtos.find((p) => p.id === id)?.nome || ''
    const out = []
    state.produtores.forEach((p) => {
      if (`${p.nome} ${p.municipio} ${p.associacao}`.toLowerCase().includes(t))
        out.push({ k: 'pr' + p.id, label: p.nome, sub: `Produtor • ${p.municipio}`, page: 'produtores' })
    })
    state.produtos.forEach((p) => {
      if (`${p.nome} ${p.categoria}`.toLowerCase().includes(t))
        out.push({ k: 'pd' + p.id, label: p.nome, sub: `Produto • ${p.categoria}`, page: 'produtos' })
    })
    state.ofertas.forEach((o) => {
      if (pn(o.produtoId).toLowerCase().includes(t))
        out.push({ k: 'of' + o.id, label: `Oferta de ${pn(o.produtoId)}`, sub: 'Mercados • oferta', page: 'mercados' })
    })
    state.demandas.forEach((d) => {
      if (`${d.comprador} ${pn(d.produtoId)}`.toLowerCase().includes(t))
        out.push({ k: 'dm' + d.id, label: d.comprador, sub: `Demanda • ${pn(d.produtoId)}`, page: 'demandas' })
    })
    return out.slice(0, 10)
  }, [q, state])

  // notificações: alertas climáticos ativos + oportunidades com prazo próximo
  const notifs = useMemo(() => {
    const hoje = todayISO()
    const list = []
    state.alertas
      .filter((a) => a.fim >= hoje)
      .forEach((a) =>
        list.push({ k: a.id, titulo: `Alerta: ${a.tipo} (${a.nivel})`, sub: `${a.regiao} • até ${fmtDate(a.fim)}`, page: 'clima' })
      )
    state.oportunidades
      .filter((o) => o.prazo >= hoje && daysBetween(hoje, o.prazo) <= 21)
      .forEach((o) =>
        list.push({ k: o.id, titulo: o.titulo, sub: `Inscrições até ${fmtDate(o.prazo)}`, page: 'mercados' })
      )
    return list
  }, [state])

  const Current = ALL.find((n) => n.id === page).el
  const initials = (state.config.usuario || 'U')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-btn menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Abrir menu">
          <Menu size={22} />
        </button>
        <button className="logo" onClick={() => go('inicio')} aria-label="AgroConecta — ir para o início">
          <Sprout size={34} />
          <span>AgroConecta</span>
        </button>

        <div className="searchbox">
          <Search size={18} />
          <input
            placeholder="Buscar produtores, produtos, mercados…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar"
          />
          {q.trim().length >= 2 && (
            <div className="dropdown">
              {results.length === 0 ? (
                <div style={{ padding: 14 }} className="muted">
                  Nada encontrado para “{q}”.
                </div>
              ) : (
                results.map((r) => (
                  <button key={r.k} onClick={() => go(r.page)}>
                    {r.label}
                    <small>{r.sub}</small>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="top-right">
          <div style={{ position: 'relative' }}>
            <button className="bell" onClick={() => setShowNotif((s) => !s)} aria-label="Notificações">
              <Bell size={22} />
              {notifs.length > 0 && <span className="bell-count">{notifs.length}</span>}
            </button>
            {showNotif && (
              <div className="notif">
                {notifs.length === 0 ? (
                  <div style={{ padding: 14 }} className="muted">
                    Nenhuma notificação por enquanto.
                  </div>
                ) : (
                  notifs.map((n) => (
                    <button key={n.k} onClick={() => go(n.page)}>
                      <b>{n.titulo}</b>
                      <small className="muted" style={{ display: 'block' }}>
                        {n.sub}
                      </small>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="user">
            <div className="avatar">{initials}</div>
            <div>
              <b>{state.config.usuario}</b>
              <small>{state.config.perfil}</small>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </header>

      <aside className={menuOpen ? 'sidebar open' : 'sidebar'}>
        <nav className="nav" aria-label="Menu principal">
          {NAV.map((n) => (
            <button key={n.id} className={page === n.id ? 'active' : ''} onClick={() => go(n.id)}>
              <n.icon size={20} /> {n.label}
            </button>
          ))}
          <hr />
          <button className={page === CONFIG.id ? 'active' : ''} onClick={() => go(CONFIG.id)}>
            <CONFIG.icon size={20} /> {CONFIG.label}
          </button>
        </nav>
        <div className="side-foot">
          Conectando
          <br />a agricultura familiar
          <br />
          aos mercados
          <svg viewBox="0 0 260 120" aria-hidden="true">
            <path d="M0 70 Q70 30 140 60 T260 50 V120 H0Z" fill="#8fc08f" />
            <path d="M0 90 Q80 55 150 85 T260 75 V120 H0Z" fill="#4f9a5a" />
            <path d="M0 108 Q90 80 170 104 T260 96 V120 H0Z" fill="#2c7048" />
            <rect x="120" y="52" width="26" height="18" fill="#f0e4cf" />
            <path d="M116 54 L133 40 L150 54Z" fill="#c9553c" />
            <circle cx="60" cy="58" r="12" fill="#2c7048" />
            <rect x="58" y="62" width="4" height="14" fill="#6b4a2f" />
            <circle cx="205" cy="48" r="9" fill="#2c7048" />
            <rect x="203" y="52" width="4" height="12" fill="#6b4a2f" />
          </svg>
        </div>
      </aside>

      <main className="main">
        <div className="page">
          <Current go={go} />
        </div>
      </main>
    </div>
  )
}

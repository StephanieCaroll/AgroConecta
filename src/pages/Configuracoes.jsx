import { useRef } from 'react'
import { Download, Upload, RotateCcw, Trash2 } from 'lucide-react'
import { useStore } from '../store'
import { Card, PageHeader } from '../components/ui'
import { CIDADES } from '../lib/weather'
import { downloadFile, todayISO } from '../lib/utils'

export default function Configuracoes() {
  const { state, setConfig, reset, clear, replace } = useStore()
  const c = state.config
  const fileRef = useRef(null)

  const trocarCidade = (nome) => {
    const cid = CIDADES.find((x) => x.nome === nome)
    if (cid) setConfig({ cidade: cid.nome, lat: cid.lat, lon: cid.lon })
  }

  const exportar = () =>
    downloadFile(`agroconecta-backup-${todayISO()}.json`, JSON.stringify(state, null, 2), 'application/json')

  const importar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (!data || typeof data !== 'object' || !Array.isArray(data.produtores)) throw new Error('Formato inválido')
        if (window.confirm('Substituir todos os dados atuais pelos dados deste arquivo?')) replace(data)
      } catch (err) {
        window.alert('Não foi possível ler o arquivo. Use um backup exportado pelo AgroConecta.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <PageHeader title="Configurações" subtitle="Ajuste seu perfil, a região do clima e gerencie os dados do sistema." />

      <div className="grid grid-2">
        <Card title="Perfil e região">
          <div className="form-grid">
            <label className="field">
              <span>Seu nome</span>
              <input value={c.usuario} onChange={(e) => setConfig({ usuario: e.target.value })} />
            </label>
            <label className="field">
              <span>Perfil</span>
              <select value={c.perfil} onChange={(e) => setConfig({ perfil: e.target.value })}>
                {['Produtora', 'Produtor', 'Técnico(a)', 'Gestor(a)', 'Comprador(a)'].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Cidade da previsão do tempo</span>
              <select value={c.cidade} onChange={(e) => trocarCidade(e.target.value)}>
                {CIDADES.map((x) => (
                  <option key={x.nome}>{x.nome}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Alerta de chuva forte (mm por dia)</span>
              <input type="number" min="5" value={c.limiarChuva} onChange={(e) => setConfig({ limiarChuva: Number(e.target.value) || 30 })} />
              <small>Quando a previsão passar desse valor, o painel mostra um alerta.</small>
            </label>
          </div>
        </Card>

        <Card title="Dados do sistema">
          <p className="muted" style={{ marginBottom: 14 }}>
            Tudo fica salvo neste navegador. Faça backup antes de limpar o histórico do navegador ou trocar de computador.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={exportar}>
              <Download size={16} /> Exportar backup
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Importar backup
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importar} />
            <button
              className="btn btn-ghost"
              onClick={() => window.confirm('Restaurar os dados de exemplo? Seus registros atuais serão substituídos.') && reset()}
            >
              <RotateCcw size={16} /> Restaurar dados de exemplo
            </button>
            <button
              className="btn btn-danger"
              onClick={() => window.confirm('Apagar todos os registros e começar do zero? Essa ação não pode ser desfeita.') && clear()}
            >
              <Trash2 size={16} /> Apagar todos os dados
            </button>
          </div>
        </Card>
      </div>
    </>
  )
}

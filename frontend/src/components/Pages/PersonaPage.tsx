import { useEffect, useState } from 'react'
import { User, Save, Upload, Check } from 'lucide-react'

interface PersonaInfo {
  id: string
  name?: string
  description?: string
}

interface PersonaPageProps {
  onCloseGuardChange?: (guard: () => boolean) => void
}

export default function PersonaPage({ onCloseGuardChange }: PersonaPageProps) {
  const [personas, setPersonas] = useState<PersonaInfo[]>([])
  const [selectedPersona, setSelectedPersona] = useState<string>('exusiai')
  const [personaYaml, setPersonaYaml] = useState<string>('')
  const [loadedYaml, setLoadedYaml] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [corpusFile, setCorpusFile] = useState<File | null>(null)

  useEffect(() => {
    fetch('/api/personas')
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : []
        setPersonas(list)
        const first = list[0]?.id || 'exusiai'
        setSelectedPersona((prev) => prev || first)
      })
      .catch(() => setPersonas([]))
  }, [])

  useEffect(() => {
    if (!selectedPersona) return
    fetch(`/api/personas/${selectedPersona}`)
      .then((r) => r.json())
      .then((data) => {
        const yaml = data.yaml || ''
        setPersonaYaml(yaml)
        setLoadedYaml(yaml)
      })
      .catch(() => {
        setPersonaYaml('')
        setLoadedYaml('')
      })
  }, [selectedPersona])

  const isDirty = personaYaml !== loadedYaml

  useEffect(() => {
    const guard = () => {
      if (!isDirty) return true
      return window.confirm('当前角色的 YAML 有未保存的修改，确定要放弃吗？')
    }
    onCloseGuardChange?.(guard)
    return () => onCloseGuardChange?.(() => true)
  }, [isDirty, onCloseGuardChange])

  const handlePersonaChange = (id: string) => {
    if (isDirty && !window.confirm('当前角色的 YAML 有未保存的修改，确定要放弃吗？')) {
      return
    }
    setSelectedPersona(id)
    setMessage(null)
    setCorpusFile(null)
  }

  const savePersona = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/personas/${selectedPersona}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml: personaYaml }),
      })
      const data = await res.json()
      if (res.ok) {
        setLoadedYaml(personaYaml)
        setMessage('保存成功')
      } else {
        setMessage(`保存失败：${data.error || '未知错误'}`)
      }
    } catch {
      setMessage('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const uploadCorpus = async () => {
    if (!corpusFile || !selectedPersona) return
    const form = new FormData()
    form.append('file', corpusFile)
    try {
      const res = await fetch(`/api/personas/${selectedPersona}/corpus`, {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      setCorpusFile(null)
      setMessage(res.ok ? '语料上传成功' : `上传失败：${data.error || '未知错误'}`)
    } catch {
      setMessage('上传失败')
    }
  }

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-dionysus-text-primary">
          <User className="h-4 w-4 text-dionysus-primary" />
          当前角色
        </div>
        <select
          value={selectedPersona}
          onChange={(e) => handlePersonaChange(e.target.value)}
          className="w-full rounded-xl border-2 border-dionysus-subtle-border bg-dionysus-glass-highlight px-3 py-2 text-sm text-dionysus-text-primary outline-none focus:border-dionysus-primary"
        >
          {personas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name || p.id}
            </option>
          ))}
        </select>
        {personas.find((p) => p.id === selectedPersona)?.description && (
          <p className="mt-2 text-xs text-dionysus-text-secondary">
            {personas.find((p) => p.id === selectedPersona)?.description}
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 text-sm font-medium text-dionysus-text-primary">
          提示词 / QA 数据集（YAML）
          {isDirty && <span className="ml-2 text-xs text-dionysus-danger">已修改</span>}
        </div>
        <textarea
          value={personaYaml}
          onChange={(e) => setPersonaYaml(e.target.value)}
          rows={16}
          className="w-full rounded-xl border-2 border-dionysus-subtle-border bg-dionysus-code-bg px-3 py-2 font-mono text-xs text-dionysus-text-primary outline-none focus:border-dionysus-primary"
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={savePersona}
            disabled={saving || !isDirty}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-black/20 bg-dionysus-primary px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? '保存中…' : '保存'}
          </button>
          {message && (
            <span className="flex items-center gap-1 text-xs text-dionysus-success">
              <Check className="h-3.5 w-3.5" />
              {message}
            </span>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 text-sm font-medium text-dionysus-text-primary">语料文件</div>
        <div className="flex items-center gap-2">
          <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border-2 border-dionysus-subtle-border bg-dionysus-glass-highlight px-3 py-1.5 text-xs font-bold text-dionysus-text-primary transition-all hover:border-dionysus-primary/50">
            <Upload className="h-3.5 w-3.5" />
            选择 .txt 语料
            <input
              type="file"
              accept=".txt"
              onChange={(e) => setCorpusFile(e.target.files?.[0] || null)}
              className="sr-only"
            />
          </label>
          {corpusFile && (
            <span className="max-w-[8rem] truncate text-xs text-dionysus-text-secondary">
              {corpusFile.name}
            </span>
          )}
          <button
            type="button"
            onClick={uploadCorpus}
            disabled={!corpusFile}
            className="rounded-xl border-2 border-black/20 bg-dionysus-primary px-3 py-1.5 text-xs font-bold text-white shadow-md transition-all hover:brightness-110 disabled:opacity-50"
          >
            上传
          </button>
        </div>
      </section>
    </div>
  )
}

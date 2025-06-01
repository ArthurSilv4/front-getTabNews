import React from 'react'
import './App.css'

function App() {
  const api = import.meta.env.VITE_API_URL

  const [data, setData] = React.useState(null)
  const [filter, setFilter] = React.useState('')
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = (event) => {

    event.preventDefault()
    setError(null)
    setData(null)
    setLoading(true)

    if (!filter) {
      setError('O filtro não pode ser vazio')
      setLoading(false)
      return
    }

    fetch(`${api}/posts?filter=${encodeURIComponent(filter)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => { throw new Error(text) })
        }
        return response.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
        setFilter('')
      })
      .catch((err) => {
        setLoading(false)
        setError(err.message)
      })
  }


  return (
    <div style={{ maxWidth: '100vw', overflowX: 'auto', padding: '1em', boxSizing: 'border-box' }}>
      <h1>Get TabNews</h1>
      <p>
        Esta rota retorna os últimos 100 posts cujo título começa com o valor informado no parâmetro de filtro. O filtro é aplicado ao início do título, permitindo buscar rapidamente conteúdos que correspondam ao prefixo desejado.
      </p>

      <p>
        Url de exemplo: <code>https://gettabnews.onrender.com/posts?filter=[pitch]</code>
      </p>

      <form
        onSubmit={e => {
          handleSubmit(e)
        }}
      >
        <label htmlFor="filtro">Filtro:</label>
        <input
          id="filtro"
          type="text"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <pre style={{ color: 'red' }}>{error}</pre>}

      {data ? (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <pre style={{
            textAlign: 'left',
            padding: '1em',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : loading && <pre>Carregando...</pre>}
    </div>
  )
}

export default App

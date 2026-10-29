import { readFile } from 'node:fs/promises'
import express from 'express'
import cors from 'cors'
import { pool } from './db.js'

const app = express()

app.use(cors())
app.use(express.json())

const toPost = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: row.created_at,
})


app.get('/posts', async (req, res) => {
  const result = await pool.query('SELECT * FROM posts ORDER BY id')
  res.json(result.rows.map(toPost))
})

app.post('/posts', async (req, res) => {
  const { name, description } = req.body

  if (!name?.trim()) {
    return res.status(400).json({ error: 'Name is required' })
  }

  const result = await pool.query(
    'INSERT INTO posts (name, description) VALUES ($1, $2) RETURNING *',
    [name.trim(), description ?? '']
  )
  res.status(201).json(toPost(result.rows[0]))
})

app.delete('/posts/:id', async (req, res) => {
  const id = Number(req.params.id)

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'Invalid id' })
  }

  const result = await pool.query(
    'DELETE FROM posts WHERE id = $1 RETURNING *',
    [id]
  )

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Post not found' })
  }

  res.json(toPost(result.rows[0]))
})

// create the posts table if it doesn't exist yet
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8')
await pool.query(schema)

app.listen(3000, () => {
  console.log('API listening on http://localhost:3000')
})

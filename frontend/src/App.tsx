import { useEffect, useState } from 'react'
import { PostCard } from './components/PostCard'
import { useAppSelector, useAppDispatch } from './store/store'
import { fetchPosts, createPost } from './store/postSlice'
import { type Post } from './types/Post'
import './App.css'



function App() {
  const posts = useAppSelector(state => state.posts.items)
  const dispatch = useAppDispatch()
  const [filter, setFilter] = useState('')
  const [searchText, setSearchText] = useState('')
  const [newPostName, setNewPostName] = useState('')
  const [newPostDescription, setNewPostDescription] = useState('')

  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch])

  const shownPosts = posts.filter(post =>
    post.name.toLowerCase().includes(filter.toLowerCase())
  )

  const dispatchNewPost = () => {
    const newPost: Omit<Post, 'id'> = { name: newPostName, description: newPostDescription }
    dispatch(createPost(newPost))
  }

  return (
    <>
      <main>
        <header>
          <h1>TCIT interview project: Post manager</h1>
        </header>
        <section className='filter'>
          <input
            value={searchText}
            type="text"
            onChange={e => setSearchText(e.target.value)}
            placeholder='Filtro de nombre'
          />
          <button type='button' onClick={() => setFilter(searchText)}>Buscar</button>
        </section>
        <section className='post_list'>
          {
            shownPosts.map(post => <PostCard key={post.id} post={post} />)
          }
        </section>
        <section className='create_post'>
          <input type="text" placeholder='Nombre del Post' value={newPostName} onChange={e => setNewPostName(e.target.value)}/>
          <input type="text" placeholder='Descripción' value={newPostDescription} onChange={e => setNewPostDescription(e.target.value)}/>
          <button type='button' className='create_post_btn' onClick={() => dispatchNewPost()}>Crear</button>
        </section>
      </main>

    </>
  )
}

export default App

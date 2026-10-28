import { useState } from 'react'
import { type Post } from './types/Post'
import { PostCard } from './components/PostCard'
import './App.css'



function App() {
  const [posts, setPosts] = useState<Post[]>([])

  return (
    <>
      <main>
        <header>
          <h1>TCIT interview project: Post manager</h1>
        </header>
        <section className='filter'>
          <input placeholder='filter by name' />
          <button className='create_post_btn' />
        </section>
        <section className='post_list'>
          {
            posts.map(post => <PostCard key={post.id} post={post} />)
          }
        </section>
      </main>

    </>
  )
}

export default App

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { type Post } from "../types/Post";
import * as postsApi from '../api/posts'

interface PostsState {
  items: Post[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string 
}

const initialState: PostsState = { items: [], status: 'idle' }

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  return await postsApi.getPosts()
}, {
  condition: (_, { getState }) => {
    const { posts } = getState() as { posts: PostsState }
    return posts.status === 'idle'   // false → the thunk doesn't run at all
  },
})


export const createPost = createAsyncThunk('posts/createPost', async (post: Omit<Post, 'id'>) => {
  return await postsApi.postPost(post)
})

export const deletePost = createAsyncThunk('posts/deletePost', async (post: Post) => {
  return await postsApi.deletePost(post)
})

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items.push(action.payload)
      })
      .addCase(createPost.rejected, (state) => {
        state.error = 'No se pudo crear el post'
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.items = state.items.filter(post => post.id !== action.payload.id)
      })
      .addCase(deletePost.rejected, (state) => {
        state.error = 'No se pudo eliminar el post'
      })
  },
})

export default postsSlice.reducer
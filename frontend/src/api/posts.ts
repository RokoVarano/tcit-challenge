import axios from 'axios'
import { type Post } from '../types/Post'

const api = axios.create({ baseURL: 'http://localhost:3000' })

export const getPosts = async () => {
  const response = await api.get<Post[]>('/posts')
  return response.data
}

export const postPost = async (post: Omit<Post, 'id'>) => {
    const response = await api.post<Post>('/posts', post)
    return response.data
}

export const deletePost = async (post: Post) => {
    const response = await api.delete<Post>('/posts/' + post.id)
    return response.data
}
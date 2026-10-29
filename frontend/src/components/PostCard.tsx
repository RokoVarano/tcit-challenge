import { type Post } from "../types/Post"
import { useAppDispatch } from "../store/store"
import { deletePost } from "../store/postSlice"

interface PostCardProps {
    post: Post
}

export const PostCard = ({post}: PostCardProps) => {
    const dispatch = useAppDispatch()

    return (
        <>
            <div className="post_card">
                <div>
                    <h3>{ post.name }</h3>
                    <button type='button' onClick={() => dispatch(deletePost(post))}>Eliminar</button>
                </div>
                <p>{ post.description }</p>
            </div>
        </>
    )
}

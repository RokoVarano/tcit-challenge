import { type Post } from "../types/Post"

interface PostCardProps {
    post: Post
}

export const PostCard = ({post}: PostCardProps) => {
    return (
        <>
            <div className="post_card">
                <h3>{ post.name }</h3>
                <p>{ post.description }</p>
            </div>
        </>
    )
}

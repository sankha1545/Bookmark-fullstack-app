import { blogPosts } from "@/data/blogPosts"
import { notFound } from "next/navigation"

export default function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = blogPosts.find((p) => p.slug === params.slug)

  if (!post) return notFound()

  return (
    <article className="min-h-screen px-6 py-24 max-w-4xl mx-auto space-y-16">

      {/* Cover Image */}
      <img
        src={post.cover}
        className="w-full h-96 object-cover rounded-2xl"
        alt=""
      />

      {/* Title Section */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">{post.title}</h1>
        <p className="text-muted-foreground">{post.date}</p>
      </div>

      {/* Content */}
      {post.content.map((section, i) => (
        <section key={i} className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {section.heading}
          </h2>

          {section.image && (
            <img
              src={section.image}
              className="rounded-xl w-full object-cover"
              alt=""
            />
          )}

          {section.paragraphs.map((para, idx) => (
            <p
              key={idx}
              className="text-muted-foreground leading-relaxed"
            >
              {para}
            </p>
          ))}
        </section>
      ))}
    </article>
  )
}

import { blogPosts } from "@/data/blogPosts"
import { notFound } from "next/navigation"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  const { slug } = await params

  const post = blogPosts.find((p) => p.slug === slug)

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
     {/* Content */}
{post.content.map((section, i) => (

  <section key={i} className="space-y-6">

    <h2 className="text-2xl font-semibold">
      {section.heading}
    </h2>


    {/* Image */}
    {section.image && (

      <img
        src={section.image}
        className="rounded-xl w-full object-cover"
        alt=""
      />

    )}


    {/* TABLE FIX */}
    {section.heading === "Realtime Data Flow Table" ? (

      <div className="overflow-x-auto">

        <table className="w-full border border-border rounded-xl">

          <thead className="bg-muted">

            <tr>

              <th className="p-3 border text-left">
                Component
              </th>

              <th className="p-3 border text-left">
                Responsibility
              </th>

            </tr>

          </thead>


          <tbody>

            <tr>
              <td className="p-3 border">
                Client Application
              </td>

              <td className="p-3 border">
                Subscribes to database changes and updates UI
              </td>
            </tr>


            <tr>
              <td className="p-3 border">
                Supabase Realtime Server
              </td>

              <td className="p-3 border">
                Broadcasts database events to clients
              </td>
            </tr>


            <tr>
              <td className="p-3 border">
                PostgreSQL Database
              </td>

              <td className="p-3 border">
                Stores bookmarks and generates change events
              </td>
            </tr>


            <tr>
              <td className="p-3 border">
                WebSocket Connection
              </td>

              <td className="p-3 border">
                Maintains persistent realtime communication
              </td>
            </tr>


            <tr>
              <td className="p-3 border">
                Authentication Layer
              </td>

              <td className="p-3 border">
                Ensures secure access using RLS
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    ) : (

      section.paragraphs.map((para, idx) => (

        <p
          key={idx}
          className="text-muted-foreground leading-relaxed"
        >
          {para}
        </p>

      ))

    )}

  </section>

))}


    </article>
  )
}

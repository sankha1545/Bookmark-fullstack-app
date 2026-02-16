import { blogPosts } from "@/data/blogPosts"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {

  const { slug } = await params

  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) return notFound()


  return (

    <article className="min-h-screen px-6 py-24 max-w-4xl mx-auto space-y-16">


      {/* COVER IMAGE */}

      <img

        src={post.cover}

        className="w-full h-96 object-cover rounded-2xl"

        alt={post.title}

      />


      {/* TITLE */}

      <div className="space-y-4">

        <h1 className="text-4xl font-bold">

          {post.title}

        </h1>


        <p className="text-muted-foreground">

          {post.date}

        </p>

      </div>



      {/* CONTENT */}


      {post.content.map((section, i) => (

        <section

          key={i}

          className="space-y-6"

        >


          {/* HEADING */}

          <h2 className="text-2xl font-semibold">

            {section.heading}

          </h2>



          {/* IMAGE */}


          {section.image && (

            <img

              src={section.image}

              alt={section.heading}

              className="rounded-xl w-full object-cover"

            />

          )}



          {/* TABLE (DYNAMIC FIX) */}


          {section.table && (

            <div className="overflow-x-auto">

              <table className="w-full border border-border rounded-xl">

                <thead className="bg-muted">

                  <tr>

                    {section.table.headers.map((header, index) => (

                      <th

                        key={index}

                        className="p-3 border text-left font-medium"

                      >

                        {header}

                      </th>

                    ))}

                  </tr>

                </thead>



                <tbody>

                  {section.table.rows.map((row, rowIndex) => (

                    <tr key={rowIndex}>

                      {row.map((cell, cellIndex) => (

                        <td

                          key={cellIndex}

                          className="p-3 border"

                        >

                          {cell}

                        </td>

                      ))}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}



          {/* PARAGRAPHS (SAFE FIX) */}


          {section.paragraphs?.map((para, idx) => (

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

import Navbar from "@/components/Navbar";
import ResearchList from "@/components/ResearchList";
import { client } from "@/sanity/lib/client";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ResearchPage() {
    const posts = await client.fetch(POSTS_QUERY);

    return (
        <main>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '800' }}>Research Library</h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', maxWidth: '600px' }}>
                    Deep dive analysis into the companies shaping the future.
                    Our reports combine fundamental data with technical insights.
                </p>
                <ResearchList posts={posts} />
            </div>
        </main>
    );
}

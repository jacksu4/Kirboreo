import Navbar from "@/components/Navbar";
import AboutContent from "@/components/AboutContent";

export default function AboutPage() {
    return (
        <main>
            <Navbar />
            <div className="container" style={{ paddingTop: '120px' }}>
                <AboutContent />
            </div>
        </main>
    );
}

const AboutUs = () => {
    return (
        <div className="mx-auto px-4 py-16 max-w-4xl flex flex-col justify-center min-h-screen">
            <div className="space-y-8 h-1/2">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="text-lg">
                        Vendle was founded by a group of students from McGill University and Duke University who shared a simple vision:
                        making it easier to find trusted contractors in our local communities. Like many homeowners, we saw firsthand
                        the frustration and uncertainty that came with hiring contractors—whether for routine renovations or urgent repairs.
                        We wanted a solution that was transparent, reliable, and efficient.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                    <p className="text-lg">
                        But as we built our platform, we realized we had a larger calling. When we looked at the aftermath of natural
                        disasters—hurricanes, wildfires, and floods—we saw families struggling not just with loss, but with the
                        overwhelming challenge of rebuilding. Finding a fair, trustworthy, and affordable contractor after a disaster
                        was often just as stressful as the event itself. The disaster relief system was broken, leaving homeowners
                        vulnerable to delays, price gouging, and fraud.
                    </p>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">Making a Difference</h2>
                    <p className="text-lg">
                        This was where Vendle could make a difference.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
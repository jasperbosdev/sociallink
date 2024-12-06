export default function FAQ() {
    return (
        <>
            <div className="px-4">
                <div className="max-w-[1024px] mx-auto w-full bg-[#101013] border-4 border-white/20 rounded-xl my-12">
                    <h1 className="font-black text-center text-4xl py-8">
                        Komako's Frequently Asked Questions
                    </h1>
                    {/* start */}
                    <div className="px-4 sm:px-8">
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">What is Komako:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                    Komako is a biolink service that lets you consolidate all of your social media links and other links into one customizable page.
                                </p>
                            </div>
                        </div>
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">How do I get access:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                    For €3, you gain access, or be invited by another user. You can make the purchase on our Shop <a href="https://komako.mysellix.io" target="_blank"
                                    className="text-indigo-400">here</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
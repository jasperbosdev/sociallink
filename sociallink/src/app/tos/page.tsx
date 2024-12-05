export default function TOS() {
    return (
        <>
            <div className="px-4">
                <div className="max-w-[1024px] mx-auto w-full bg-[#101013] border-4 border-white/20 rounded-xl my-12">
                    <h1 className="font-black text-center text-4xl py-8">
                        Komako's Terms of Service
                    </h1>
                    {/* start */}
                    <div className="px-4 sm:px-8">
                        {/* introduction */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Introduction:</h2>
                            <div className="py-2 font-semibold">
                                <p className="mb-4">
                                    These Terms of Service outline your use of and access to Komako. 
                                    By creating an account, accessing, or using our website, you 
                                    confirm that you’ve read, understood, and agree to these Terms. If you 
                                    don’t agree, you cannot use our services. Please review these Terms 
                                    regularly, as they may change over time.
                                </p>
                                <p>
                                    Komako may update these Terms at any time. Changes will be posted on our 
                                    website and Discord server. Continuing to use the services after updates 
                                    means you accept the new Terms. If you disagree with any updates, please 
                                    stop using the services immediately.
                                </p>
                            </div>
                        </div>
                        {/* termination */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Account Termination</h2>
                            <div className="py-2 font-semibold">
                                <p className="mb-4">
                                    All users must comply with these <a href="/platform" target="_blank" className="text-indigo-400">Platform Guidelines</a>.
                                    Failing to do so may result in termination of your account, deleting files and other data or further action.
                                </p>
                                <p>Komako reserves the right to terminate any user at our own discretion and without notice.</p>
                            </div>
                        </div>
                        {/* Profile Content */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Profile Content</h2>
                            <div className="py-2 font-semibold">
                                <p className="mb-4">
                                    You are solely responsible for any content you upload or share through the Komako platform. You agree to indemnify and hold 
                                    Komako harmless from any claims, damages, or liabilities arising from your content or its use in connection with the platform.
                                </p>
                                <p>
                                    By uploading or sharing content on Komako, you grant us a non-exclusive, worldwide, royalty-free, sublicensable, and 
                                    transferable license to use, reproduce, distribute, display, and perform your content. This license is limited to what’s 
                                    necessary for us to provide, improve, and maintain our services, as well as to meet legal requirements.
                                </p>
                            </div>
                        </div>
                        {/* User Obligations */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">User Obligations</h2>
                            <div className="py-2 font-semibold">
                                <p className="">
                                Users are responsible for keeping their passwords secure and limiting access to their accounts. Komako is not liable for any loss 
                                or damage resulting from failure to follow these responsibilities. While we will do our best to help you recover your account if it 
                                becomes compromised, we cannot guarantee that recovery will be successful.
                                </p>
                            </div>
                        </div>
                        {/* Refunds */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Refunds</h2>
                            <div className="py-2 font-semibold">
                                <p className="">
                                    All sales of digital products are final. Due to their nature, digital products are considered used and consumed upon purchase, 
                                    making them non-returnable and non-refundable.
                                </p>
                            </div>
                        </div>
                        {/* Privacy */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Privacy & Security</h2>
                            <div className="py-2 font-semibold">
                                <p className="">
                                Our Privacy Policy outlines how we collect, use, and protect your personal data. By using our services you consent to the collection
                                and use of your personal data as outlined in our <a href="/privacy" target="_blank" className="text-indigo-400">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
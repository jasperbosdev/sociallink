export default function Privacy() {
    return (
        <>
            <div className="px-4">
                <div className="max-w-[1024px] mx-auto w-full bg-[#101013] border-4 border-white/20 rounded-xl my-12">
                    <h1 className="font-black text-center text-4xl py-8">
                        Komako's Privacy Policy
                        <p className="text-xl font-semibold">(Updated December 5th, 2024)</p>
                    </h1>
                    {/* start */}
                    <div className="px-4 sm:px-8">
                        {/* Explanation */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Introduction:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                This Privacy Policy ("Policy") explains how Komako ("we," "our," or "us") collects, uses, shares, and protects your
                                personal information. References to "we," "our," or "us" in this Policy include Komako and, where applicable, its affiliates,
                                subsidiaries, and employees. References to "you" or "your" mean the individual or entity using our services, visiting our
                                website, or interacting with us in any way.
                                </p>
                            </div>
                        </div>
                        {/* What we collect */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Data we collect:</h2>
                            <div className="py-2 font-semibold">
                                <p>Below you can find all the data we collect of our users.</p>
                                <ol className="list-disc list-inside pl-3">
                                    <li>Username</li>
                                    <li>Email address</li>
                                    <li>IP address</li>
                                    <li>Date of registration</li>
                                    <li>Bcrypt hashed password</li>
                                </ol>
                            </div>
                        </div>
                        {/* Data Sharing */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Data sharing:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                    We may disclose your data when required by law. In all other cases, your information will only be shared with
                                    your consent. We will never sell your data or share it with third parties beyond what has been outlined in this Policy.
                                </p>
                            </div>
                        </div>
                        {/* When we get a report */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">If being reported:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                If we receive a report involving you or directly about you, we will notify you about it. Depending on the nature of the
                                report, we may temporarily disable your account while we look into the report. If the report includes a file you’ve uploaded
                                and it is found to violate our Terms of Service, we may review other content you’ve uploaded to assess the severity
                                of the violation.
                                </p>
                            </div>
                        </div>
                        {/* Data deletion */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Data deletion:</h2>
                            <div className="py-2 font-semibold">
                                <p className="mb-2">
                                    We will retain your data as long as it is necessary to maintain your access to our website.
                                    If you wish to request the deletion of your data, you can contact us at
                                    <a href="mailto:dxmpup@proton.me?subject=Data%20Deletion%20Request%20Komako's%20sociallink"
                                    className="text-indigo-400"> dxmpup@proton.me</a>.
                                    We review incoming requests often and typically respond within 24-72 hours.
                                </p>
                                <p className="mb-2">
                                    Once confirmed you are indeed the account owner, we will remove all personally identifying information from our database
                                    and any backups or mirrors. This includes deleting your uploaded files and bio page.
                                    After the deletion process, only your UID, UUID, and Username will remain. Please note that data deletion will
                                    result in the loss of access to our website.
                                </p>
                                <p>
                                    After completing the deletion process, any emails or messages related to the request will also be deleted.
                                    To protect our platform, we may deny data deletion requests if we have sufficient evidence that the request is
                                    intended to facilitate fraudulent or abusive activity.
                                </p>
                            </div>
                        </div>
                        {/* Underage */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Underage users:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                    If you are not of legal age in your area of residence, please do not use our services.
                                    If we suspect that you or any user is underage, we will terminate your access to all of Komako's services.
                                </p>
                            </div>
                        </div>
                        {/* Concerns */}
                        <div className="py-4">
                            <h2 className="text-2xl text-indigo-400 font-bold">Help needed or concers:</h2>
                            <div className="py-2 font-semibold">
                                <p>
                                If you have any privacy concerns or questions you may contact us through our discord server or
                                through our email at <a href="mailto:dxmpup@proton.me" className="text-indigo-400">dxmpup@proton.me</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
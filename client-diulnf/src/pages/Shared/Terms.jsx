import React from 'react';

const Terms = () => {
    return (
        <div className="w-full">
            <div className="max-w-[1920px] mx-auto px-6 py-6">
                <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>
                
                <p className="mb-4"><strong>Effective Date:</strong> July 08, 2025</p>
                
                <p className="mb-4">Welcome to the DIU Lost and Found System. By using this website, you agree to follow these Terms and Conditions. Please read them carefully.</p>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. Purpose of the Website</h2>
                    <p>This system is made for Daffodil International University (DIU) students, faculty, and employees to report and find lost or found items. The goal is to help the DIU community stay organized and avoid losing important belongings.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. User Eligibility</h2>
                    <p>Only authorized users of DIU (students, faculty members, and employees) can use this system. You must log in with your official DIU email address to access or use the system.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
                    <ul className="list-disc pl-8 mb-4">
                        <li>You must provide true and clear information while submitting lost or found items.</li>
                        <li>You should not use the platform for spam, fake reports, or anything that harms others.</li>
                        <li>If you find an item, you must submit it to the DIU Security Room after reporting it on this system.</li>
                        <li>Do not misuse another person's report or try to claim items that do not belong to you.</li>
                    </ul>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Admin Rights</h2>
                    <p className="mb-2">The Security Department (admin) of DIU has the right to:</p>
                    <ul className="list-disc pl-8 mb-4">
                        <li>Review, verify, approve, or reject any report.</li>
                        <li>Update item status and contact relevant users.</li>
                        <li>Remove any user access for misuse or violation of rules.</li>
                    </ul>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">5. Privacy and Data</h2>
                    <p>We will store your submitted data securely. Only authorized persons can access your personal information. We will not share your data outside DIU without permission.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">6. Limitations</h2>
                    <p>This system is a support tool. DIU does not take legal responsibility for any item lost, stolen, or not returned through this system. It is meant to help and not replace physical verification.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
                    <p>We may update these Terms and Conditions at any time. If we do, we will notify you by email or by showing the changes in the system.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
                    <p>If you have any questions or face any problem, you can contact the DIU Security Department or email us at: <a href="mailto:security@diufordiversity.edu.bd" className="text-blue-600 hover:underline">security@diufordiversity.edu.bd</a></p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
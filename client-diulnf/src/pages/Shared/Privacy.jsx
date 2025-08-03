import React from 'react';

const Privacy = () => {
    return (
        <div className="w-full">
            <div className="max-w-[1920px] mx-auto px-6 py-6">
                <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
                
                <p className="mb-4"><strong>Effective Date:</strong> July 08, 2025</p>
                
                <p className="mb-4">At DIU Lost and Found, we respect your privacy and care about how your personal information is used. This Privacy Policy explains what data we collect, how we use it, and how we keep it safe.</p>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">1. What Information We Collect</h2>
                    <p className="mb-2">When you use this system, we may collect the following information:</p>
                    <ul className="list-disc pl-8 mb-4">
                        <li>Your DIU email address, name, phone number, department, and student ID</li>
                        <li>Details of the lost or found item (like item type, description, photo, location, date)</li>
                        <li>Any messages or reports you submit</li>
                        <li>Login activity and usage data (such as time and date)</li>
                    </ul>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                    <p className="mb-2">We use your data to:</p>
                    <ul className="list-disc pl-8 mb-4">
                        <li>Let you log in and use the system</li>
                        <li>Help match lost and found reports</li>
                        <li>Send notifications about item status</li>
                        <li>Improve and maintain the system</li>
                        <li>Contact you if needed</li>
                    </ul>
                    <p>We do not sell, rent, or share your data with any outside person or company.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">3. Who Can See Your Data</h2>
                    <p>Only authorized DIU admins (such as Security Department staff) can view your full data. Other users can only see public information like item image, description, and date—but not your personal info.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
                    <p>We use safe methods to protect your data. All reports are stored in a secure database, and login is only allowed through DIU verified email. We try our best to protect your data, but no system can be 100% secure.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking</h2>
                    <p>We may use cookies to keep you logged in or remember your settings. These cookies are only for technical purposes and are not used to track you outside this system.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
                    <p className="mb-2">You have the right to:</p>
                    <ul className="list-disc pl-8 mb-4">
                        <li>See your own data</li>
                        <li>Edit your submitted reports</li>
                        <li>Request that your report be removed if needed</li>
                    </ul>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">7. Changes to this Policy</h2>
                    <p>We may update this Privacy Policy sometimes. If we make major changes, we will inform you through email or a message in the system.</p>
                </div>
                
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
                    <p>If you have any questions or problems about your data or privacy, please contact the DIU Security Department or email us at: <a href="mailto:security@diufordiversity.edu.bd" className="text-blue-600 hover:underline">security@diufordiversity.edu.bd</a></p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
import React from 'react';

const About = () => {
    const contactData = [
        {
            designation: "Director",
            name: "Major(Retd.)Md. Shah Alam,PSC, MPhill",
            email: "director.ssm@daffodilvarsity.edu.bd",
            phone: "++8801713493171",
            ip: "65455"
        },
        {
            designation: "Security in-Charge",
            name: "S M Tariqul Islam",
            email: "security@daffodilvarsity.edu.bd",
            phone: "+8801847140049",
            ip: "65462"
        },
        {
            designation: "Assistant Safety and Security Officer",
            name: "Md. Nadim Mahmud",
            email: "security.office@daffodilvarsity.edu.bd",
            phone: "+8801847334911",
            ip: "65463"
        },
        {
            designation: "Assistant Safety and Security Officer",
            name: "Mr. Rahat Uddin",
            email: "security.office@daffodilvarsity.edu.bd",
            phone: "+8801897644948",
            ip: "65463"
        },
        {
            designation: "CCTV Operator",
            name: "MD. Mahbub Alam",
            email: "security.office2@daffodilvarsity.edu.bd",
            phone: "+8801847334914",
            ip: "65466"
        },
        {
            designation: "CCTV Operator",
            name: "Md. Mostofa Ahmed",
            email: "cctv4@daffodilvarsity.edu.bd",
            phone: "+8801847334914",
            ip: "65466"
        },
        {
            designation: "CCTV Operator",
            name: "Md. Arifuzzaman",
            email: "cctv5@daffodilvarsity.edu.bdd",
            phone: "+8801847334914",
            ip: "65466"
        },
        {
            designation: "CCTV Operator",
            name: "Mr. Abu Naser",
            email: "cctv1@daffodilvarsity.edu.bd",
            phone: "+8801797762844",
            ip: "65466"
        },
        {
            designation: "CCTV Operator",
            name: "Mr. Ali Azam",
            email: "-",
            phone: "+8801840804579", 
            ip: "-"
        },
        {
            designation: "CCTV Operator",
            name: "Mr. Tanjim Khan Nokib",
            email: "-",
            phone: "+8801731418206",
            ip: "-"
        },
        {
            designation: "Security Supervisor",
            name: "Md. Habibur Rahman",
            email: "-",
            phone: "+8801776591769",
            ip: "-"
        },
        {
            designation: "Security Supervisor",
            name: "Md. Shahjahan",
            email: "-",
            phone: "+8801718883780",
            ip: "-"
        },
        {
            designation: "Security Supervisor",
            name: "Md. Rafiqul Islam",
            email: "-",
            phone: "+8801746284109",
            ip: "-"
        },
        {
            designation: "Security Supervisor",
            name: "Md. Shafiul Alom",
            email: "-",
            phone: "+8801726906969",
            ip: "-"
        },
        {
            designation: "Security Supervisor",
            name: "Sree Bhoben Chandra",
            email: "-",
            phone: "+8801304426034",
            ip: "-"
        }
    ];

    return (
        <div className="w-full">
            {/* About Us Section */}
            <div className="max-w-[1920px] mx-auto px-6 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">About Us</h2>
                <div className="text-gray-700 leading-relaxed space-y-4">
                    <p>
                        DIU Lost and Found is an online platform made for the students, teachers, and employees of Daffodil International University (DIU) to report and track lost and found items inside the campus.
                    </p>
                    <p>
                        In our university, many people lose important items like ID cards, pen drives, calculators, umbrellas, etc. every semester. Before, the system used Google Forms and Sheets, which was not so efficient or user-friendly. Many users didn't even know where to report or how to find their lost things.
                    </p>
                    <p>
                        With this system, users can easily report lost items or if they found something belonging to others, they can submit it to the system. Whenever anyone reports, upload photos, and give email notifications if someone finds a matching item. The Security Department (Admin) can review reports, approve claims, and update the item status easily from their dashboard.
                    </p>
                    <p>
                        Our goal is to make the process simpler, faster, and more transparent for everyone at DIU. We believe this small step can save time and help many people get their valuable belongings back.
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-[1920px] mx-auto px-6 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Contact</h2>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-t border-b border-gray-200">
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">Designation</th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">Name</th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">Email</th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">Phone</th>
                                <th className="px-5 py-3 text-left font-semibold text-gray-800">IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contactData.map((contact, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-5 py-3 text-gray-800">{contact.designation}</td>
                                    <td className="px-5 py-3 text-gray-800">{contact.name}</td>
                                    <td className="px-5 py-3">
                                        {contact.email !== "-" ? (
                                            <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
                                                {contact.email}
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-gray-800">{contact.phone}</td>
                                    <td className="px-5 py-3 text-gray-800">{contact.ip || "-"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Location Section */}
            <div className="max-w-[1920px] mx-auto px-6 py-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-5">Location</h2>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-1">
                        <div className="space-y-1 text-gray-700">
                            <p className="font-semibold">Safety and Security Management Office</p>
                            <p>Ground Floor</p>
                            <p>Knowledge Tower (A502)</p>
                            <p>Daffodil International University</p>
                            <p>Birulia, Savar</p>
                            <p>Dhaka</p>
                        </div>
                    </div>
                    <div className="lg:col-span-3 h-[400px]">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2365.672132958626!2d90.32068259556522!3d23.87668235266462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1754226850840!5m2!1sen!2sbd"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="DIU Birulia Location"
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;  
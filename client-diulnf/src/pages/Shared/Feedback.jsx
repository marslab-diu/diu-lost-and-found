import React, { useState } from 'react';

const Feedback = () => {
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitStatus('success');
            setFormData({ subject: '', message: '' });
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setSubmitStatus(null);
            }, 3000);
        }, 1000);
    };

    return (
        <div className="w-full flex justify-center items-center min-h-[calc(100vh-172px)]">
            <div className="max-w-[1920px] w-full px-6 py-6">
                <div className="max-w-2xl mx-auto">
                    {submitStatus === 'success' && (
                        <div className="bg-green-50 border border-green-200 rounded-md px-4 py-2 mb-6 flex items-center gap-2">
                            <div className="text-green-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <span className="text-sm text-green-800">Thank you for your feedback! We'll review it shortly.</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Subject"
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none"
                                required
                            />
                        </div>
                        
                        <div>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Message"
                                rows="6"
                                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none"
                                required
                            ></textarea>
                        </div>
                        
                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-4 rounded text-white font-medium bg-[#3a31a8] hover:bg-[#332b94] transition duration-200"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
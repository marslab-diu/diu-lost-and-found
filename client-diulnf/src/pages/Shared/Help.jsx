import React, { useState } from 'react';
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";

const AccordionItem = ({ title, children, isOpen, onClick }) => {
    return (
        <div className="border border-gray-200 rounded-md mb-4">
            <div 
                className="flex justify-between items-center p-4 cursor-pointer bg-white" 
                onClick={onClick}
            >
                <h3 className="font-semibold">{title}</h3>
                {isOpen ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
            </div>
            {isOpen && (
                <div className="p-5 border-t border-gray-200 bg-white">
                    {children}
                </div>
            )}
        </div>
    );
};

const Help = () => {
    // State for managing which accordion items are open
    const [openItems, setOpenItems] = useState({
        'step1': true,
        'step2': false,
        'step3': false,
        'option1': true,
        'option2': false,
        'notes': false
    });

    // Toggle function for accordion items
    const toggleItem = (id) => {
        setOpenItems(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="w-full">
            <div className="max-w-[1920px] mx-auto px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left Column - If You Have Lost an Item */}
                    <div>
                        <h2 className="text-2xl font-bold mb-5">If You Have Lost an Item</h2>

                        {/* Step 1 */}
                        <AccordionItem 
                            title="Step 1: Submit a Lost Item Report" 
                            isOpen={openItems.step1}
                            onClick={() => toggleItem('step1')}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Go to the "Report Lost" section of the website.</li>
                                <li>Fill in the form with as much detail as possible.</li>
                            </ul>
                            <p className="mt-2 ml-5">This includes:</p>
                            <ul className="list-disc pl-10 space-y-2">
                                <li>Name of the item (e.g. iPhone 15 Pro Max)</li>
                                <li>Primary color</li>
                                <li>Description (e.g. case color, scratches, lock screen photo etc.)</li>
                                <li>Date and approximate time you lost it</li>
                                <li>Where you last remember having it</li>
                                <li>Upload a photo (if available)</li>
                            </ul>
                        </AccordionItem>

                        {/* Step 2 */}
                        <AccordionItem 
                            title="Step 2: Wait for Notification" 
                            isOpen={openItems.step2}
                            onClick={() => toggleItem('step2')}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Once your report is submitted, it will be reviewed by the Security Department.</li>
                                <li>If someone finds an item that matches your report, you will receive an email notification.</li>
                                <li>You may also get contacted by the security team to verify and collect your item.</li>
                            </ul>
                        </AccordionItem>

                        {/* Step 3 */}
                        <AccordionItem 
                            title="Step 3: Search Manually" 
                            isOpen={openItems.step3}
                            onClick={() => toggleItem('step3')}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You can always visit the "Recovered Items" section.</li>
                                <li>Use the search bar and filters (by date, location, or item type) to check if your item has already been found.</li>
                            </ul>
                        </AccordionItem>
                    </div>

                    {/* Right Column - If You Have Found an Item */}
                    <div>
                        <h2 className="text-2xl font-bold mb-5">If You Have Found an Item</h2>

                        {/* Option 1 */}
                        <AccordionItem 
                            title="Option 1: Report Online First" 
                            isOpen={openItems.option1}
                            onClick={() => toggleItem('option1')}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Go to the "Report Found" section of the website.</li>
                                <li>Fill in the form with item details and upload a photo if possible.</li>
                                <li>Then, submit the form and hand over the item to the Security Control Room as soon as you can.</li>
                            </ul>
                        </AccordionItem>

                        {/* Option 2 */}
                        <AccordionItem 
                            title="Option 2: Go to Security Directly" 
                            isOpen={openItems.option2}
                            onClick={() => toggleItem('option2')}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li>You can directly go to the Security Control Room.</li>
                                <li>Fill in their physical entry form and hand over the item.</li>
                                <li>The admin will add the item to the system if not already submitted.</li>
                            </ul>
                        </AccordionItem>

                        {/* Notes */}
                        <AccordionItem 
                            title="Notes" 
                            isOpen={openItems.notes}
                            onClick={() => toggleItem('notes')}
                        >
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Always describe the item clearly — this helps others find their items quickly.</li>
                                <li>Reports with photos and accurate location/time info are more effective.</li>
                                <li>Submitting false reports or trying to claim items that are not yours is a policy violation and may lead to disciplinary action.</li>
                            </ul>
                        </AccordionItem>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
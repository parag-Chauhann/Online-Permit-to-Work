import React, { useState, useEffect } from 'react';
import { FaArrowCircleLeft, FaArrowCircleRight, FaMicrophone } from "react-icons/fa";
import { RxEnter } from "react-icons/rx";
import { emailjs, SERVICE_ID, TEMPLATE_ID, USER_ID } from '../../emailjsConfig'; // Adjust path if needed
import { db } from '../../Firebase'; // Adjust path if needed
import "./PermitForm.css";
import { doc, setDoc } from 'firebase/firestore'; // Ensure this path is correct



function PermitForm() {
    const [formData, setFormData] = useState({
        ptwNumber: '',
        contractorName: '',
        projectName: '',
        numberOfEmployees: '',
        startDate: '',
        completionDate: '',
        liftingEquipment: '',
        weight: '',
        dimension: '',
        quantity: '',
        serialNumber: '',
        inspectionDate: '',
        capacity: '',
        plantLocation: '',
        currentLocation: '',
        jobDescription: '',
        selectedApprovers: []
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isListening, setIsListening] = useState(false);
    const [approverOptions, setApproverOptions] = useState([]);

    const sections = [
        {
            title: "Details of Load",
            fields: [
                { label: "Weight", type: "text", name: "weight", placeholder: "Enter Weight" },
                { label: "Dimension", type: "text", name: "dimension", placeholder: "Enter Dimension" },
                { label: "Quantity", type: "number", name: "quantity", placeholder: "Enter Quantity" },
            ]
        },
        {
            title: "Details of Equipment",
            fields: [
                { label: "Serial Number", type: "text", name: "serialNumber", placeholder: "Enter Serial Number" },
                { label: "Valid Inspection Date", type: "date", name: "inspectionDate", placeholder: "Enter Inspection Date" },
                { label: "Capacity", type: "text", name: "capacity", placeholder: "Enter Capacity" },
            ]
        }
    ];

    const permitFormData = [
        {
            label: "PTW Number",
            type: "number",
            name: "ptwNumber",
            placeholder: "Automatic Generated",
        },
        {
            label: "Contractor Name",
            type: "text",
            name: "contractorName",
            placeholder: "Enter your Name",
        },
        {
            label: "Project Name",
            type: "text",
            name: "projectName",
            placeholder: "Enter Project Name",
        },
        {
            label: "No. of Employees involved",
            type: "number",
            name: "numberOfEmployees",
            placeholder: "No. of Employees",
        },
        {
            label: "Starting From",
            type: "datetime-local",
            name: "startDate",
        },
        {
            label: "Expected Completion From",
            type: "datetime-local",
            name: "completionDate",
        },
    ];

    const plantLocationOptions = [
        { value: '', label: 'Select Location' },
        { value: 'area1', label: 'Area 1' },
        { value: 'section1', label: 'Section 1' },
        { value: 'department1', label: 'Department 1' },
    ];

    const equipmentOptions = [
        { value: '', label: 'Select Equipment' },
        { value: 'crane', label: 'Crane' },
        { value: 'forklift', label: 'Forklift' },
        { value: 'hoist', label: 'Hoist' },
        { value: 'truckMounted', label: 'Truck Mounted' },
        { value: 'crawlerCrane', label: 'Crawler Crane' },
        { value: 'overheadCrane', label: 'Overhead Crane' },
        { value: 'towerCrane', label: 'Tower Crane' },
        { value: 'other', label: 'Other' },
    ];

    const approvers = {
        area1: [
            { email: 'approver1@domain.com', name: 'Approver 1' },
            { email: 'approver2@domain.com', name: 'Approver 2' }
        ],
        section1: [
            { email: 'approver3@domain.com', name: 'Approver 3' },
            { email: 'approver4@domain.com', name: 'Approver 4' }
        ],
        department1: [
            { email: 'approver5@domain.com', name: 'Approver 5' },
            { email: 'approver6@domain.com', name: 'Approver 6' }
        ]
    };

    useEffect(() => {
        if (formData.plantLocation) {
            setApproverOptions(approvers[formData.plantLocation] || []);
        } else {
            setApproverOptions([]);
        }
    }, [formData.plantLocation]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleApproverChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => {
            const selectedApprovers = checked
                ? [...prevState.selectedApprovers, value]
                : prevState.selectedApprovers.filter(email => email !== value);

            return { ...prevState, selectedApprovers };
        });
    };

    const handleNext = () => {
        setCurrentStep(prevStep => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep(prevStep => prevStep - 1);
    };



const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the email data
    const templateParams = {
        ptwNumber: formData.ptwNumber,
        contractorName: formData.contractorName,
        projectName: formData.projectName,
        details: `Weight: ${formData.weight}, Dimension: ${formData.dimension}, Quantity: ${formData.quantity}, Serial Number: ${formData.serialNumber}, Inspection Date: ${formData.inspectionDate}, Capacity: ${formData.capacity}`,
        approvalLink: `http://yourwebsite.com/approve?ptwNumber=${formData.ptwNumber}`, // Replace with your actual link
    };

    try {
        // Upload permit data to Firestore
        await setDoc(doc(db, 'permits', formData.ptwNumber), {
            ...formData,
            status: 'pending', // Set initial status as 'pending'
        });

        // Send email to all selected approvers
        for (const approver of formData.selectedApprovers) {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...templateParams, to_email: approver }, USER_ID);
        }
        alert("PTW form is submitted and approval emails have been sent.");
    } catch (error) {
        console.error("Failed to submit form:", error);
        alert("Failed to submit form. Please try again later.");
    }
};



    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prevState => ({
                        ...prevState,
                        currentLocation: `Latitude: ${latitude}, Longitude: ${longitude}`
                    }));
                },
                (error) => {
                    console.error("Error obtaining location", error);
                }
            );
        } else {
            alert("Geolocation is not supported / blocked by this browser, Please enable it");
        }
    };

    const startVoiceRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        setIsListening(true);
        recognition.start();

        recognition.onstart = () => {
            console.log("Voice recognition started. Speak now.");
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setFormData(prevState => ({
                ...prevState,
                jobDescription: transcript
            }));
            console.log("Speech recognized: ", transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
            console.log("Voice recognition ended.");
            alert("Speech recognition ended.");
        };
    };

    return (
        <div className='MainBody'>
            <div className='PermitFormContainer'>
                <header>Lifting Operation Permit</header>
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="form first animate__animated animate__fadeIn">
                            <div className='details personal'>
                                <span className='title'>Permit form</span>
                                <div className='fields'>
                                    {permitFormData.map((item, index) => (
                                        <div className='input-fields' key={index}>
                                            <label>{item.label}</label>
                                            <input
                                                type={item.type}
                                                name={item.name}
                                                placeholder={item.placeholder}
                                                value={formData[item.name]}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='details personal'>
                                <span className='title'>Lifting Operation / Equipment details</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Lifting Equipment</label>
                                        <select
                                            name="liftingEquipment"
                                            value={formData.liftingEquipment}
                                            onChange={handleChange}
                                            required
                                        >
                                            {equipmentOptions.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {sections.map((section, index) => (
                                <div className='details personal' key={index}>
                                    <span className='title'>{section.title}</span>
                                    <div className='fields'>
                                        {section.fields.map((field, idx) => (
                                            <div className='input-fields' key={idx}>
                                                <label>{field.label}</label>
                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                   
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            <div className='details location'>
                                <span className='title'>Plant Location</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Plant Location</label>
                                        <select
                                            name="plantLocation"
                                            value={formData.plantLocation}
                                            onChange={handleChange}
                                            required
                                        >
                                            {plantLocationOptions.map((option, index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className='details approvers'>
                                <span className='title'>Approvers</span>
                                <div className='fields'>
                                    {approverOptions.map((approver, index) => (
                                        <div className='input-fields' key={index}>
                                            <input
                                                type="checkbox"
                                                id={`approver-${index}`}
                                                value={approver.email}
                                                onChange={handleApproverChange}
                                            />
                                            <label htmlFor={`approver-${index}`}>
                                                {approver.name} ({approver.email})
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className='buttons'>
                                <button type="button" onClick={handleNext}>Next <FaArrowCircleRight /></button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="form second animate__animated animate__fadeIn">
                            <div className='details job-description'>
                                <span className='title'>Job Description</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Description</label>
                                        <textarea
                                            name="jobDescription"
                                            value={formData.jobDescription}
                                            onChange={handleChange}
                                            placeholder="Describe the job"
                                            rows="4"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='details location'>
                                <span className='title'>Current Location</span>
                                <div className='fields'>
                                    <div className='input-fields'>
                                        <label>Current Location</label>
                                        <input
                                            type="text"
                                            name="currentLocation"
                                            value={formData.currentLocation}
                                            readOnly
                                        />
                                        <button type="button" onClick={getCurrentLocation}>
                                            Get Current Location <RxEnter />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className='buttons'>
                                <button type="button" onClick={handleBack}><FaArrowCircleLeft /> Back</button>
                                <button type="button" onClick={startVoiceRecognition}>
                                    {isListening ? "Stop Listening" : "Start Voice Recognition"} <FaMicrophone />
                                </button>
                                <button type="submit">Submit</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default PermitForm;

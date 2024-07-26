import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../Firebase'; // Adjust the import based on your Firebase setup
import './ApprovalPage.css'; // Import the CSS file

const ApprovalPage = () => {
    const { permitNumber } = useParams(); // Extract permitNumber from URL
    const [permitData, setPermitData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPermitData = async () => {
            try {
                const permitRef = doc(db, 'permits', permitNumber);
                const permitSnap = await getDoc(permitRef);

                if (permitSnap.exists()) {
                    setPermitData(permitSnap.data());
                } else {
                    setError("No such permit found!");
                }
            } catch (err) {
                setError("Failed to fetch permit data");
                console.error("Error fetching permit data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPermitData();
    }, [permitNumber]);

    const handleApproval = async (approved) => {
        try {
            const permitRef = doc(db, 'permits', permitNumber);
            await updateDoc(permitRef, {
                status: approved ? 'approved' : 'rejected'
            });
            alert(`Permit ${approved ? 'approved' : 'rejected'} successfully.`);
        } catch (err) {
            console.error("Failed to update permit status:", err);
            alert("Failed to update permit status. Please try again later.");
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <header>
                <h2>Permit Details</h2>
            </header>
            <p><strong>PTW Number:</strong> {permitData.ptwNumber}</p>
            <p><strong>Contractor Name:</strong> {permitData.contractorName}</p>
            <p><strong>Project Name:</strong> {permitData.projectName}</p>
            <p><strong>Details:</strong> {permitData.details}</p>
            <button className="approve" onClick={() => handleApproval(true)}>Approve</button>
            <button className="reject" onClick={() => handleApproval(false)}>Reject</button>
        </div>
    );
};

export default ApprovalPage;

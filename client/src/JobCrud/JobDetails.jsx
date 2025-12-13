import React from 'react';
import { useParams } from 'react-router-dom';

const JobDetails = () => {
    const { jobId } = useParams();
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Job Details</h2>
            <p>Details for job ID: {jobId}</p>
        </div>
    );
};

export default JobDetails;

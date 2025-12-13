import React from 'react';
import { useParams } from 'react-router-dom';

const JobUpdate = () => {
    const { jobId } = useParams();
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Update Job</h2>
            <p>Update form for job ID: {jobId}</p>
        </div>
    );
};

export default JobUpdate;

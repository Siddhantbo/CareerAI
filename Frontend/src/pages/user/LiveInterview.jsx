import React, { useState } from "react";
import AddInterview from "../../component/models/AddInterview";
import InterviewList from "./InterviewList";

const LiveInterview = () => {
  const [addInterview, setAddInterview] = useState(false);
  return (
    <>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div
            className="p-10 border rounded-lg bg-gray-100 hover:shadow-md cursor-pointer transition-all text-center"
            onClick={() => setAddInterview(true)}
          >
            <h2 className="text-lg text-center font-semibold">+ Add New</h2>
            <p className="text-gray-500">Add a new interview feature to the application for users</p>
          </div>
        </div>

        <InterviewList />
      </div>
      {addInterview && (
        <AddInterview
          onClose={() => {
            setAddInterview(false);
          }}
        />
      )}
    </>
  );
};

export default LiveInterview;

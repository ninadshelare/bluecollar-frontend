import { useState } from "react";
import Navbar from "../../components/Navbar";
import { checkIn, checkOut } from "../../api/attendanceApi";

const MaidAttendance = () => {
  const workerId = localStorage.getItem("workerProfileId");
  const today = new Date().toISOString().slice(0, 10);

  const [checkedIn, setCheckedIn] = useState(false);

  return (
    <>
      <Navbar />
      <div style={{ padding: 20 }}>
        <h2>Today's Attendance</h2>

        {!checkedIn ? (
          <button
            onClick={async () => {
              await checkIn(workerId, today);
              alert("Checked in");
              setCheckedIn(true);
            }}
          >
            Check In
          </button>
        ) : (
          <button
            onClick={async () => {
              await checkOut(workerId, today);
              alert("Checked out");
              setCheckedIn(false);
            }}
          >
            Check Out
          </button>
        )}
      </div>
    </>
  );
};

export default MaidAttendance;

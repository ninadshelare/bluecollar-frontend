import Navbar from "../../components/Navbar";
import { createWorkRequest } from "../../api/workRequestApi";

const BookService = () => {
  const customerId = localStorage.getItem("userId");

  // For now we hardcode workerId
  // Later this will come from SearchWorkers page
  const workerId = localStorage.getItem("selectedWorkerId");

  const handleBook = async () => {
    if (!workerId) {
      alert("Please select a worker first");
      return;
    }

    try {
      await createWorkRequest(customerId, workerId);
      alert("Service booked successfully!");
    } catch (err) {
      alert("Failed to book service");
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2>Confirm Booking</h2>

        <p>Proceed to book the selected worker.</p>

        <button onClick={handleBook} style={styles.button}>
          Book Service
        </button>
      </div>
    </>
  );
};

export default BookService;

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "auto",
  },
  button: {
    padding: "10px",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    width: "100%",
  },
};

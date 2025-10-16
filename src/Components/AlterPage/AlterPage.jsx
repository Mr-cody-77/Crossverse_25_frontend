import { Link } from "react-router-dom";
import "./AlterPage.css";

function AlterPage() {
  return (
    <div className="alter-page relative ">
      <div className="alter-content ">
        <h1>Access Denied</h1>
        <p>You need to first attempt 10 questions to move to the next round.</p>
        <p>Try again and complete the challenge!</p>

        <Link to="/" className="alter-retry-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default AlterPage;

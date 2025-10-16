import { Link } from "react-router-dom"
import "./EliminationPage.css"
import Navbar from "../Navbar/Navbar"

function EliminationPage() {
  return (
   <>
    <Navbar/>
    <div className="elimination-page">
      <div className="elimination-content">
        <h1>You Are Eliminated</h1>
        <p>You didn't collect enough riddles to complete the challenge.</p>
        <p>Better luck next time!</p>

        <Link to="/" className="retry-button">
          Try Again
        </Link>
      </div>
    </div>
   </>
  )
}

export default EliminationPage


export default function Home() {
    return (
        <div className="home-container">
            <div className="introduction-card">
                <h1 className="title-header">Master any choreography with <span className="app-name">Furi</span></h1>
                <h2 className="title-subtitle">A structured choreography learning and practice app for dancers</h2>
                <div className="button-row">
                    <button className="home-button">Start Practicing</button>
                    <button className="home-button">Explore features</button>
                </div>
                <div className="features">
                    <div className="feature-tab">Visually track your progress</div>
                    <div className="feature-tab">Drill dances by section</div>
                    <div className="feature-tab">Schedule practice sessions</div>
                    <div className="feature-tab">Track your mastery of dances</div>
                </div>
            </div>
        </div>
    )
}
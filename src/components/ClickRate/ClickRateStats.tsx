import {Stats} from "./ClickRateTypes"

type ClickRateStatsProps = {
    stats: Stats
    resetGame: () => void;
}

export default function ClickRateStats({stats, resetGame}: ClickRateStatsProps) {
    return (
        <>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-label">Click Rate</div>
                    <div className="stat-value">{stats.cps} CPS</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Clicks</div>
                    <div className="stat-value">{stats.totalClicks}</div>
                </div>
                 <div className="stat-card">
                    <div className="stat-label">Fastest Click</div>
                    <div className="stat-value">{stats.minInterval}ms</div>
                </div>
                 <div className="stat-card">
                    <div className="stat-label">Slowest Click</div>
                    <div className="stat-value">{stats.maxInterval}ms</div>
                </div>
                 <div className="stat-card">
                    <div className="stat-label">Avg Interval</div>
                    <div className="stat-value">{stats.avgInterval}ms</div>
                </div>
            </div>
            <button className="reset-btn" onClick={resetGame}>Try Again</button>
        </>
    );
}
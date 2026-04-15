# OmniSight AI: Risk Prediction Workflow

![OmniSight Data Architecture Workflow Isometric Overview](./omnisight_workflow_graphic_1776282402386.png)

This document illustrates the precise data flow architecture powering the OmniSight AI Risk Prediction Model across the 20 Pan-India zones.

```mermaid
graph TD
    %% Styling
    classDef offline fill:#3b0764,stroke:#d8b4fe,stroke-width:2px,color:#fff
    classDef live fill:#064e3b,stroke:#6ee7b7,stroke-width:2px,color:#fff
    classDef frontend fill:#7f1d1d,stroke:#fca5a5,stroke-width:2px,color:#fff
    classDef data fill:#1e3a5f,stroke:#93c5fd,stroke-width:2px,color:#fff

    %% Offline Pipeline 
    subgraph Offline_Training [1. Offline ML Training Pipeline]
        H[Historical Dataset Generation\n112 Weeks, 20 Zones] -->|Feature Engineering| M((XGBoost ML\nModel))
        M -->|Predictions| B[Baseline Scores CSV\n'zone_risk_scores_latest.csv']
    end

    %% Live Inference Pipeline
    subgraph Live_Backend [2. Live Inference Engine FastAPI]
        B -.->|Load Baseline 55%| Z[zone_risk.py\nInference Engine]
        W[Live WeatherAPI\nRain/Wind/Visibility] -->|Live Weather Score 45%| Z
        Z -->|Blend & Calculate| E[[Endpoint: /zones/risk/heatmap]]
    end

    %% Frontend App
    subgraph Frontend_App [3. Frontend Dashboard]
        F[Python Folium Script] -->|Generates via CI/CD| I(heatmap.html)
        E -->|React Native Fetch\nevery 10 mins| A[AdminDashboard.jsx\nReact State]
        I -->|iframe src| A
        A --> C1[Danger/Caution Badges]
        A --> C2[Dynamic Progress Bars]
        A --> C3[Emergency Kill Switch triggers]
    end

    %% Flow connections between subgraphs
    Offline_Training:::offline
    Live_Backend:::live
    Frontend_App:::frontend
    
    H:::data
    W:::data
    B:::data
```

## Breakdown of the Process

1. **The XGBoost Brain (Offline)**: We generate 112 weeks of historical weather and risk behavior specific to 20 zones across Mumbai, Delhi, Kolkata, and Chennai. The XGBoost model calculates long-term baseline trends (weight = 55%).
2. **The Pulse (Live Weather)**: Every 10 minutes, the backend queries live metrics (rainfall in mm, wind in kph, visibility). It generates a severe weather spike score (weight = 45%).
3. **The Blend (The Engine)**: `zone_risk.py` instantly fuses the XGBoost baseline and the Live Weather score into a 0-100 Danger Metric.
4. **The UI (React Dashboard)**: `AdminDashboard.jsx` hits the API, bringing the live scores into React. At the exact same time, it natively renders the HTML `iframe` map inside the application.

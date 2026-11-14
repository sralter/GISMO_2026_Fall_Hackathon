NYC Solar Rooftop Suitability Analysis
Project Overview
This project explores the potential for rooftop solar energy development across New York City, focusing on commercial and industrial buildings.
Using Geographic Information Systems (GIS), we aim to identify rooftops that may be suitable for solar installations based on available roof area, building characteristics, sunlight exposure, and potential shading from surrounding structures.
The goal is to develop a spatial analysis that can help identify promising locations for solar energy investment and support more informed urban sustainability planning.
Research Question
Which commercial and industrial rooftops in New York City demonstrate the greatest potential for solar energy development based on roof area, building height, sunlight exposure, and surrounding building conditions?
Data Sources
NYC MapPLUTO: Property characteristics, land use classifications, and building information.
NYC Building Footprints: Building geometries and height-related attributes.
New York State Elevation Data: Digital Elevation Model (DEM) used to estimate ground elevation.
Derived GIS Datasets: Rooftop area estimates, elevation calculations, and nearby-building comparisons.
GIS Analysis Completed
1. Commercial and Industrial Building Identification
Integrated NYC property and building footprint datasets.
Identified approximately 31,111 commercial and industrial rooftop candidates.
Organized building attributes for further spatial analysis.
2. Rooftop Area Screening
Calculated estimated rooftop areas.
Applied a minimum rooftop area threshold of 5,000 square feet.
Retained 12,946 candidate rooftop features for further evaluation.
3. Building Elevation Analysis
Integrated building-height attributes with elevation data.
Developed estimated rooftop elevation values.
Created a preliminary Digital Surface Model (DSM) for a Brooklyn pilot area.
4. Preliminary Shading Analysis
Identified nearby buildings within a 100-foot search radius.
Compared candidate rooftop elevations with neighboring building heights.
Developed an initial method for evaluating potential shading obstructions.
Current Analysis: Solar Radiation
A Brooklyn pilot analysis is underway using ArcGIS Pro's Area Solar Radiation tool.
The model is designed to estimate sunlight exposure on June 21, using an approximate surface model incorporating building heights.
Results will be used to explore variation in sunlight exposure and identify rooftops that may warrant further investigation.
Next Steps
Complete the Brooklyn solar radiation model.
Summarize estimated solar exposure by rooftop.
Integrate radiation results with nearby-building height comparisons.
Develop a preliminary rooftop solar suitability ranking.
Explore opportunities to expand the analysis across NYC.
Investigate how rooftop and alternative solar technologies could improve access to renewable energy.
Tools and Technologies
ArcGIS Pro
Spatial Analyst
Raster Calculator
Zonal Statistics
GIS spatial joins and proximity analysis
GeoJSON for sharing spatial data
Repository Structure
data/ — Exported GIS datasets
docs/ — Research notes, methodology, and data documentation
maps/ — Maps and visualizations
Limitations
This project is an exploratory GIS analysis. Rooftop area estimates do not necessarily represent usable solar panel installation space.
The preliminary surface model does not fully account for roof slope, rooftop equipment, vegetation, structural suitability, or detailed seasonal shading. Solar radiation results should be interpreted as modeled estimates rather than verified solar energy production.
Project Status
In development — November 2026 Hackathon
Initial GIS preprocessing and rooftop screening are complete. Solar radiation modeling and suitability analysis are ongoing.

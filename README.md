# FixAI: AI-Powered Platform for Smart City Issue Detection & Resolution
#### `Grade: /20` 

## Project Overview

FixAI is an **AI-driven platform engineered to optimise urban issue detection and resolution within smart city frameworks**. Developed as a final project for the Bachelor's degree in Informatics Engineering course at the University of Aveiro, this system addresses the inefficiencies and fragmentation inherent in traditional methods of reporting urban problems, such as potholes, damaged infrastructure or vandalism. By leveraging advanced technologies like Artificial Intelligence, geospatial indexing, and scalable infrastructure, FixAI aims to modernise the entire lifecycle of urban issue management, from initial reporting by citizens to automated verification of resolution.

The project was carried out within the scope of the **Aveiro Tech City Living Lab (ATCLL)** initiative, where the city of Aveiro serves as a living technological laboratory equipped with various communication technologies (4G/5G, V2X, LoRa, LoRaWAN, Wi-Fi) and sensors (environmental sensors, radars, LIDARs, video cameras, edge computing units) interconnected. This infrastructure is linked to a datacenter at the Instituto de Telecomunicações, which also provided the **PIXKIT autonomous vehicle** for proof-of-concept demonstrations.

## Team & Supervision

**Team Members:**
| <div align="center"><a href="https://github.com/tomasf18"><img src="https://avatars.githubusercontent.com/u/122024767?v=4" width="150px;" alt="Tomás Santos"/></a><br/><strong>Tomás Santos</strong></div> | <div align="center"><a href="https://github.com/pedropintoo"><img src="https://avatars.githubusercontent.com/u/120741472?v=4" width="150px;" alt="Pedro Pinto"/></a><br/><strong>Pedro Pinto</strong></div> | <div align="center"><a href="https://github.com/DaniloMicael"><img src="https://avatars.githubusercontent.com/u/115811245?v=4" width="150px;" alt="Danilo Silva"/></a><br/><strong>Danilo Silva</strong></div> | <div align="center"><a href="https://github.com/jpapinto"><img src="https://avatars.githubusercontent.com/u/81636006?v=4" width="150px;" alt="João Pinto"/></a><br/><strong>João Pinto</strong></div> | <div align="center"><a href="https://github.com/Gui113893"><img src="https://avatars.githubusercontent.com/u/119808297?v=4" width="150px;" alt="Guilherme Santos"/></a><br/><strong>Guilherme Santos</strong></div> |
| --- | --- | --- | --- | --- |

**Supervisors:**
*   Professor Doctor Susana Sargento (susana@ua.pt)
*   Professor Doctor Pedro Rito (pedrorito@ua.pt)

## Key Features

FixAI features a **dual-interface approach** designed for both citizens and municipal operators, streamlining urban issue reporting and management:

*   **Mobile Application for Citizens:**
    *   **Effortless Incident Reporting:** Citizens can report urban incidents by simply capturing a photograph.
    *   **AI-Powered Automation:** The application leverages AI to automatically process and populate incident details, including **precise incident description, categorisation (e.g., damaged traffic lights, compromised pavement), and severity assessment**, while automatically acquiring location from the device.
    *   **Report Anywhere:** Users have the flexibility to report issues either directly on-site or from their homes.
    *   **Incident Tracking:** Users can consult their incident history and track the status of each report (i.e., **pending, in progress, or resolved**) through intuitive list and map formats.

*   **Desktop Application for Municipal Operators:**
    *   **Comprehensive Incident Management:** Provides a comprehensive digital representation of reported urban problems.
    *   **Customisable Dashboard:** Operators can view incidents grouped by category, apply various filters (e.g., by problem category or resolution status), and consolidate all occurrences related to a specific incident onto a dedicated page to **reduce redundancy and streamline workflow**.
    *   **Map View with Heatmaps:** Offers an intuitive map view displaying all incidents, with capabilities to filter by category and present **incident heatmaps for rapid visual identification of problematic regions**.
    *   **Automated Issue Resolution Verification:** Integrates with edge devices (e.g., the PIXKIT autonomous vehicle) for **automatic detection and verification of resolved problems**, providing city operators with video evidence and a suggested "resolved" status for confirmation.

*   **Core Platform Capabilities:**
    *   **Intelligent Clustering:** Incorporates functionality to **automatically group related occurrences into a single incident** through geospatial indexing (H3 framework) and AI-based similarity analysis, significantly streamlining the workload for city operators.
    *   **Dynamic Status Assessment:** Intelligent systems dynamically assess the escalating severity of a particular problem based on new citizen reports, **automatically updating its status for the city operator**.
    *   **Scalable Architecture:** Designed and implemented for **high scalability and fault tolerance**, capable of handling substantial data volumes and concurrent requests.
    *   **Multi-language Support:** Provides comprehensive support for **multiple languages** (Portuguese, English, and Chinese).
    *   **Robust Security:** Implements **robust session management with refresh tokens** and Role-Based Access Control (RBAC).
    *   **Continuous Delivery (CD) Pipeline:** Utilises a reliable CD pipeline for streamlined deployments.

## Main Technology Stack

The FixAI platform is built upon a robust and modern technology stack, combining stateless service pods with stateful distributed components.

*   **Backend Development:**
    *   **Python (FastAPI):** Chosen for its effectiveness in demanding asynchronous execution, high concurrency, and low latency scenarios for building APIs.
*   **Frontend Clients:**
    *   **React Native (Mobile Application):** Provides a cross-platform development environment for the citizen mobile app, used with Expo Go for fast prototyping and testing.
    *   **Electron with React (Desktop Application):** Enables the web-based ReactJS codebase to run as a native desktop application for city operators, offering better OS integration and a unified user experience.
*   **Container Orchestration:**
    *   **Kubernetes (K3s):** An open-source system for automating deployment, scaling, and management of containerised applications, particularly the lightweight K3s distribution for resource-constrained environments.
    *   **Traefik:** Used as the Ingress Controller to route HTTPS traffic from external clients to internal services.
*   **Data Storage:**
    *   **Apache Cassandra:** An open-source, distributed NoSQL database used for primary persistent storage of structured data, chosen for its **high write throughput, scalability, and fault tolerance**.
    *   **MinIO:** A high-performance, open-source **object storage solution compatible with the Amazon S3 API**, used for efficient management of multimedia content such as photos and videos.
    *   **Redis:** Employed as a cache and Pub/Sub system for ephemeral caching and fast key-value access.
    *   **NFS + Kubernetes StorageClasses:** Provides persistent volumes for stateful components.
*   **Asynchronous Processing & AI Integration:**
    *   **Apache Kafka:** A distributed streaming platform used as a message broker to enable robust asynchronous processing of AI tasks, such as incident detail generation and intelligent clustering.
    *   **Google Gemini API:** A Large Language Model (LLM) integrated for **AI-driven tasks** like generating incident descriptions, categorisation, severity assessment, and clustering related reports.
*   **Security & Networking:**
    *   **JSON Web Tokens (JWT):** Used for robust authentication and session management.
    *   **HTTPS with TLS protocols:** Ensures encrypted communication between applications and backend services.
    *   **Role-Based Access Control (RBAC):** Ensures users can only access resources and functionalities relevant to their assigned roles (Citizen, Operator).
*   **Other Tools & Libraries:**
    *   **H3 Index (Uber):** A geospatial indexing system used for efficient spatial mapping and indexing, enabling **fast spatial queries and neighborhood traversal**.
    *   **Axios:** HTTP client for frontend-backend communication.
    *   **Expo Go:** Development environment for React Native.
    *   **`expo-camera` & `expo-location`:** Libraries for camera and geolocation functionalities in the mobile app.
    *   **`react-native-maps` & `react-leaflet` with `leaflet.heat`:** For interactive map and heatmap visualisations.
    *   **SonarCloud:** Integrated for continuous code quality assurance across all repositories.
    *   **GitHub Boards:** Used for Agile workflow management, including backlogs, sprints, and task tracking.
    *   **SendGrid:** Email service for outbound messaging.

## Project Resources

Here you will find all relevant documentation and media related to the FixAI project:

*   **Original GitHub Organisation:** [FixAI GitHub](https://github.com/PI-2024-2025-NAP)
    *   Contains all source code, packages, and dedicated repositories (e.g., Mobile, Backend, Desktop-App, Deploy, Documentation, Sensors-Process-Unit, H3-Viewer).
*   **Technical Report:** [Technical Report](./Documentation/app-docs/static/deliverables/TechnicalReport-G11.pdf)
    *   A comprehensive document detailing the project's motivations, objectives, architecture, implementation, and results.
*   **Project Demo & Promotional Videos:** [FixAI Demonstration and Promtotional Videos](https://drive.google.com/file/d/10xv_hOI8fNaNhdGEQkbpENIo4ChkCV3Y/view?usp=sharing)
    *   Showcases the system’s usability, responsiveness, and intelligent automation capabilities.
    *   Demonstrates the automatic status updates of previously reported issues using the PIXKIT autonomous vehicle.
*   **Project Poster:** [FixAI Poster](./Documentation/app-docs/static/poster/poster.pdf)
    *   Describes the project’s objectives, architecture, and key features in a concise format to be presented at the final project exhibition (*Students@Deti* 2025).
*   **Online Documentation:** [FixAI Documentation](https://pi-2024-2025-nap.github.io/Documentation/)
    *   Provides a summarized documentation of the project.

## Important Note!
The project of this repository is not currently being maintained, as the team has graduated and moved on to other projects. However, it only needs some API keys to be fully functional (as the ones used during the project have already expired).   
The code remains available for educational purposes and as a reference for future students and developers (me) interested in smart city solutions and desires to learn (or, in my case, remember) about the scalable (and highly used nowadays) technologies utilized in the project.
---
id: deploy-diagram
title: Deploy Diagram
sidebar_label: Deploy Diagram
---

## System Deploy Diagram

Below is a high-level diagram illustrating the deployment architecture of the **AI-Powered Platform for Smart City Issue Detection & Resolution**.

![System Deploy Diagram](../../static/img/architecture/PI-Architecture-Deploy.svg)

This architectural diagram outlines a **robust and scalable system** designed for real-time data processing and smart city applications. The core components are orchestrated within a Kubernetes Cluster, ensuring high availability and efficient resource management.

At the heart of the system, a Master01 VM manages the Kubernetes cluster, hosting essential services. Zookeeper coordinates distributed processes, while Kafka serves as the central event streaming platform for asynchronous data processing, particularly for managing requests related to image descriptions and classifications. MinIO is utilized for high-performance file storage, offering S3 API compatibility for seamless integration. The Backend processes business logic and handles API requests.

Incoming HTTPS requests are routed through Traefik, an edge router, which directs traffic to the appropriate backend services.

A Worker01 VM handles the main processing loads. Cassandra acts as the main storage, providing scalability, high availability, and fault tolerance for core data. Redis is used for cache storage, accelerating data retrieval. This VM also hosts several LLM-Consumer instances (Clustering, Description, Check Incidents), which are Python-based applications responsible for consuming messages from Kafka and leveraging Gemini as the Large Language Model for processing and generating responses.

The system also includes a MacStudio VM running a Mobile App. This mobile application, used by citizens, communicates with the main system via an ngrok client and ngrok edge, establishing a secure tunnel for WebSocket communication, enabling real-time interaction with the FixAI platform. This setup facilitates user interaction, problem reporting, and status tracking, connecting citizens to the smart city infrastructure.
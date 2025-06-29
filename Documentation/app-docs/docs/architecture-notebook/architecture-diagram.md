---
id: architecture-diagram
title: Architectural Diagram
sidebar_label: Architectural Diagram
---

## System Architecture Diagram

Below is a high-level diagram illustrating the system architecture of the **AI-Powered Platform for Smart City Issue Detection & Resolution**, showing how the various components and technologies are integrated to form a cohesive and scalable platform.

![System Architecture Diagram](../../static/img/architecture/PI-Architecture-v2.0.1.svg)

The diagram represents a **modern, scalable, and distributed system** designed for **real-time data processing, analytics, and smart city applications**. The architecture integrates **Kubernetes clusters, event-driven communication, and machine learning components** to process incidents, analyze data, and deliver insights to both **citizens and city operators**.  

## Key Components  

### 1. User Interaction Layer (Frontend & Mobile Application)  

- **Citizens** interact with the system through a **mobile application**.  
- The app connects to the backend services via **RESTful APIs** and supports:  
  - **User authentication**  
  - **Problem reporting**  
  - **Status tracking**  
- **SendGrid** (a third-party email service) is used for notifications, alerts and identity confirmation.  

### 2. Business Logic Layer 

This section is the **core of the system**, responsible for handling API requests, processing business logic, and managing data.  

#### API Layer (Kubernetes Pod)  
- Includes controllers such as:  
  - **Auth Controller**  
  - **User Controller**  
  - **Occurrence Controller**  
  - **Incident Controller**  
- Handles **authentication, user management, problem management and report submission**.  

#### Business Logic Layer (Kubernetes Pod)  
- Contains the core business logic for the system, including:
- **Auth Service** – Manages user authentication and authorization.
- **LLM Producer** - Connects to the Kafka broker to produce messages for LLM processing.
- **Occurrence Service** – Processes user-reported issues.  

### 3. Databases

Below are the main databases used in the system, each serving a specific purpose:

#### Main Storage: Cassandra

- **Scalability**: Cassandra scales horizontally by simply adding new nodes, making it ideal for handling growing data loads.
- **High Availability**: It offers robust replication and a decentralized architecture, ensuring continuous service even during node failures.
- **Performance**: Optimized for fast read operations, Cassandra efficiently handles high-throughput workloads with low latency.
- **Fault Tolerance**: Its distributed, peer-to-peer design makes the system resilient to hardware failures and network issues.
- **Flexible Data Model**: Supports a wide range of data structures, allowing adaptability as application requirements evolve.

#### File Storage: MinIO

- **S3 API Compatibility**: MinIO is fully compatible with the Amazon S3 API, allowing for seamless integration with existing tools and libraries designed for AWS S3.
- **On-Premises and Private Cloud Deployment**: It can be deployed on-premises or in private cloud environments, offering complete control over your infrastructure.
- **High Performance**: Designed for high-performance object storage, MinIO is well-suited for demanding workloads in edge computing and hybrid cloud environments.
- **Lightweight Alternative**: MinIO provides a lightweight and efficient alternative for local or private object storage deployments.
- **Open-Source**: Being open-source, MinIO offers flexibility and transparency, benefiting from community contributions and allowing for custom modifications.

### 5. Event Streaming Layer (Kafka Broker)

#### Kafka Broker (Kubernetes Pod)  

- Uses **Kafka** as the **central internal event-streaming platform**.  
- Manages **asynchronous data processing**.  
- Used to manage many requests to generate images' descriptions and classifications.

### 6. LLM Processing Layer

- The system uses Gemini as the **Large Language Model (LLM)** for processing user requests and generating responses.
- The LLM Consumer connects to the Kafka broker to consume messages and produce responses based on user requests.

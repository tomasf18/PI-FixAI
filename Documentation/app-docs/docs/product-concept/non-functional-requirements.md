---
id: non-functional-requirements
title: Non Functional Requirements
sidebar_label: Non Functional Requirements
sidebar_position: 6
---

In addition to the functional requirements outlined in the user stories, the system must meet several non-functional requirements to ensure reliability, performance, security, and usability. These requirements define the quality attributes of the platform and provide guidelines for its implementation.

## 1. Performance Requirements
- **LLM Model**: Must generate a description and categorize an incident within less than **10 seconds**. If the model fails to generate a description, the user should be able to manually select a category and provide a description.

## 2. Scalability Requirements
- The application should **scale horizontally** by adding instances rather than requiring hardware upgrades.
- **Database queries** should be optimized to handle increasing data indexation efficiently.

## 3. Maintainability and Extensibility
- The codebase should follow **clean architecture** principles to allow independent updates and a maintainable environment.
- The system should be designed to allow for **easy integration** of new AI models and features without significant rework.
- Components should be **loosely coupled** and **highly cohesive** for easier modifications and integration with multiple systems like **Digital Twin**.

## 4. Reliability and Availability
- **Incident reports and status updates** should be synchronized in real-time across the **mobile app and desktop platform**.
- A failure in an **AI model** should not impact the entire system. The user should still be able to submit an incident with a manual description and category selection.

## 5. Security and Privacy
- Communication between the **mobile app, desktop platform, and backend services** must be encrypted using **HTTPS with TLS** protocols.

## 6. Usability
- The **mobile app** and **desktop platform** should have a **user-friendly interface** that is intuitive for both citizens and city control operators.
- The **mobile app** must be compatible with **Android and iOS**.

## 7. Accessibility
- The platform should support **multiple languages** to accommodate diverse populations.
- The **font size** should be easily adjustable without breaking the **UI layout or design**.
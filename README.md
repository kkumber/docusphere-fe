# DocuSphere: Document Tracking and Monitoring System

DocuSphere is a specialized web-based solution developed for the Department of Education (DepEd) Makati. It provides a comprehensive platform for the systematic tracking, monitoring, and management of documents within the organization. This repository contains the frontend application, built with modern web technologies to ensure a responsive and efficient user experience.

As a Capstone project, DocuSphere addresses the need for digital transformation in administrative workflows, moving from manual paper-based processes to a streamlined digital ecosystem.

## Core Features

- **Document Management**: Complete lifecycle tracking of documents from registration to archiving.
- **Workflow Automation**: Automated status updates and movement tracking across different departments.
- **Digital Signatures**: Integration for document signing and verification.
- **Real-time Monitoring**: Live dashboard and notification system for pending actions and document statuses.
- **User Role Management**: Secure access control based on organizational roles and departmental assignments.
- **Analytics & Reporting**: Data visualization for document throughput and departmental performance.
- **Bulk Operations**: Support for batch user registration and document processing.

## Live Demo & Credentials

Experience the system in action:
- **Demo Video**: [How Docusphere Works](https://drive.google.com/file/d/1n5XNxZpGIcJKOSDS7FfqZBnVdsJE6mGC/view)

You can log in using the following demo accounts (Password: `password`):

| Role | Email |
| :--- | :--- |
| **Admin** | `docusphere@admin.com` |
| **Records** | `docusphere@records.com` |
| **SDS** | `docusphere@sds.com` |
| **Chief** | `docusphere@chief.com` |
| **Staff** | `docusphere@staff.com` |


## Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router) (File-based routing)
- **State Management**: [TanStack Query](https://tanstack.com/query) (Asynchronous state management)
- **Data Table**: [TanStack Table](https://tanstack.com/table)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **API Client**: [Axios](https://axios-http.com/)

## Getting Started

### Prerequisites

- Node.js (Version 18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kkumber/docusphere-fe.git
   cd docusphere-fe
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory and define the API base URL:
   ```env
   VITE_API_URL=https://your-api-endpoint.com
   ```

### Development

Start the local development server:
```bash
npm run dev
```
The application will be accessible at `http://localhost:3000`.

### Docker Development

Alternatively, you can run the development environment using Docker:
```bash
docker build -f Dockerfile.dev -t docusphere-fe .
docker run -p 3000:3000 docusphere-fe
```

### Production Build

Create an optimized production build:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

## Project Structure

- `src/components`: Reusable UI components and layout structures.
- `src/hooks`: Custom React hooks for business logic and API interactions.
- `src/lib`: Core configurations, including API interceptors and utility functions.
- `src/pages`: Main view components for different application modules.
- `src/routes`: File-based route definitions using TanStack Router.
- `src/types`: TypeScript interfaces and type definitions.
- `src/utils`: Helper functions and domain-specific constants.

## Quality Assurance

- **Linting**: [ESLint](https://eslint.org/) with TanStack configurations.
- **Formatting**: [Prettier](https://prettier.io/).
- **Testing**: [Vitest](https://vitest.dev/) for unit and integration testing.

Run all checks:
```bash
npm run check
```

## Related Repositories

This project requires the DocuSphere API to function. The backend implementation can be found here:
[DocuSphere API (Backend)](https://github.com/kkumber/docusphere-api)

## Deployment

The application is configured for deployment on [Vercel](https://vercel.com/). Configuration details can be found in `vercel.json`.

---

Developed as a Capstone Project for DepEd Makati.

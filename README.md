# Plumbing Reservation App

A comprehensive plumbing reservation system built using modern web technologies, including Next.js, Firebase, Stripe, and various React libraries. This app provides a seamless experience for customers to book plumbing services, manage their appointments, and handle payments. It also includes an admin portal for managing appointments, inventory, and customer interactions.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
  - [Home Page](#home-page)
  - [Booking Flow](#booking-flow)
  - [Authentication](#authentication)
  - [Profile Page](#profile-page)
  - [Admin Management Page](#admin-management-page)
  - [Dark Mode](#dark-mode)
- [API Endpoints](#api-endpoints)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Features

* **User-Friendly Interface:** Mobile-first design with easy navigation and a clean interface.
* **Comprehensive Booking System:** Allows users to book plumbing services, upload photos, choose appointment slots, and more.
* **Secure Authentication:** Supports Google OAuth, password reset, and error handling.
* **Admin Management:** Manage appointments, technicians, and inventory with detailed workflows.
* **Stripe Integration:** Secure payment processing with Stripe for customer account balances.
* **Dark Mode:** Full support for light and dark themes across the application.
* **Real-Time Notifications:** Email confirmations and reminders for appointments.

## Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Next-Themes
* **Backend:** Firebase, Firestore, Google APIs
* **Payment:** Stripe.js
* **File Handling:** React-Dropzone, React-PDF/Renderer, React-Signature-Canvas
* **Deployment:** Vercel

## Installation

To run this project locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/plumbing-reservation-app.git
    cd plumbing-reservation-app
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.local` file in the root of your project and add your environment variables:

    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
    NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
    STRIPE_SECRET_KEY=your_stripe_secret_key
    GOOGLE_API_KEY=your_google_api_key
    ```

4. **Run the development server:**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## Usage

### Home Page

- **Navbar:** Contains the company logo, "Book Now" button (opens booking modal), "Services" button (navigates to the services page), "Client Portal" (with dropdown for login/signup or profile/logout), and "Employee Portal" (for admin management).
- **Slideshow:** Highlights past plumbing work with a "Learn More" button.
- **Sections:** Includes "About Us," "Why Us," and a Q&A section.
- **Chatbot:** Integrated Drift chatbot for customer inquiries.

### Booking Flow

- **Modal Workflow:**
  1. **Service Selection:** Retrieves services from Firestore via a custom hook and displays them in a dropdown.
  2. **Appointment Details:** Users can add comments and upload photos of plumbing issues.
  3. **Date and Time Selection:** Choose from available slots.
  4. **Customer Info:** Enter personal details (name, email, address).
  5. **Review and Confirm:** Review appointment summary and confirm booking.
  6. **Confirmation:** Users receive an email with appointment details and a Google Calendar link.

### Authentication

- **Firebase Auth:** Supports email/password sign-up, Google OAuth, and password reset.
- **Error Handling:** Displays relevant error messages during the sign-in/sign-up process.

### Profile Page

- **Customer Information:** Displays user details, booked appointments, and account balance.
- **Appointment Management:** Users can cancel or reschedule appointments, and pay account balance via Stripe.
- **Payment Feedback:** Displays success or cancellation modals post-payment.

### Admin Management Page

- **Dashboard:** Shows today's appointments, required parts, and low inventory alerts.
- **Appointments:** Displays a list of appointments with details and options to manage each appointment.
- **Inventory Management:** Allows adding, updating, and tracking inventory levels.
- **Post-Completion Workflow:**
  1. Assign technicians.
  2. Mark work as complete.
  3. Upload proof and customer signatures.
  4. Generate and manage invoices.

### Dark Mode

- **Theme Support:** The app supports both light and dark modes, with seamless transitions using `next-themes`.

## API Endpoints

- **Get Services:** Fetch available plumbing services.
- **Get Appointments:** Retrieve customer or specific date appointments.
- **Get Customer Info:** Fetch user details and account balance.
- **Stripe Payment:** Handle payment processing and status updates.
- **Manage Inventory:** API for adding, updating, and retrieving inventory data.

## Future Enhancements

- **Mobile App:** Develop a mobile version of the app for iOS and Android.
- **Push Notifications:** Implement push notifications for upcoming appointments and updates.
- **Multi-Language Support:** Add support for multiple languages to cater to a broader audience.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

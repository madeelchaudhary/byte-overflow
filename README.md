# Byte Overflow

Byte Overflow is a Stack Overflow clone where users can post questions, answer questions, upvote and downvote questions and answers, utilize a complete tags system, and experience robust authentication and profile management. Additionally, the platform features interactions, reputation, and badges systems to reward users for their contributions.

## Features

- **Questions and Answers:** Users can post questions and provide answers to existing questions.
- **Voting System:** Users can upvote and downvote questions and answers to indicate their helpfulness.
- **Tags System:** Questions can be categorized using tags for easy navigation and filtering.
- **Authentication:** Robust authentication system for secure user logins and registrations.
- **Profile Management:** Users can manage their profiles, including updating information and preferences.
- **Interactions:** Users can interact with each other through comments and notifications.
- **Reputation and Badges:** Users earn reputation points and badges based on their contributions to the platform.

## Tech Stack

- **Next.js 14:** Utilizing server actions and server components for enhanced performance.
- **Tailwind CSS and Shadcn-UI:** Styling the frontend with modern design frameworks.
- **MongoDB and Mongoose:** Storing and managing data with a NoSQL database.
- **Zod:** Validating and sanitizing user inputs for enhanced security.
- **Clerk:** Handling authentication and user management with ease.

## Getting Started

To run Byte Overflow locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/madeelchaudhary/byte-overflow.git
   ```
   
2. Navigate to the project directory:
   ```bash
   cd byte-overflow
   ```
   
3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   - Copy the .example.env file and rename it to .env.
   - Update the variables with your own MongoDB connection string and Clerk configuration.

5. Run the development server:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to http://localhost:3000 to view the application.

## Live Demo

Check out the live Byte Overflow site at https://byte-overflow.vercel.app/.

## Contribution

Contributions to Byte Overflow are welcome! Feel free to open issues for bug fixes, feature requests, or general feedback. Pull requests are also appreciated.

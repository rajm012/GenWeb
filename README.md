# GenWeb  
GenWeb is an AI-powered website builder built with Next.js, designed to streamline web development using modern tools like Clerk for authentication and Supabase for data storage.  

## Getting Started  
To run the development server, use:  

```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) to view it in your browser. The page auto-updates as you edit files.  

---

## Repository Structure  

```
GenWeb/
│   README.md
│   next.config.ts
│   package.json
│   tsconfig.json
│
├── app/                 
│   ├── api/              # API routes for backend logic
│   └── page.tsx          # Main application page
│
├── components/          
│   ├── ui/               # Reusable UI components
│
├── hooks/               # Custom React hooks
├── lib/                 # Helper functions and utilities
├── public/              # Static assets
└── styles/              # Global styles
```

---

## Features  
- **Clerk Authentication:** Secure and easy-to-integrate user authentication.  
- **Project Storage:** Saves user-created projects in local storage for quick access.  
- **GitHub Integration:** Automatically creates GitHub repositories for user projects.  
- **Live Preview:** Displays a real-time preview of the user's project.  
- **File Structure Generation:** Dynamically generates file structures based on the user's input or idea.  
- **Google APIs:** Utilizes Google APIs for enhanced functionality, such as Drive integration.  
- **Agent.ai Integration:** Uses Agent.ai for advanced AI capabilities, making the website builder smarter and more intuitive.  

---

## Summary  
GenWeb generates complete websites using user inputs, leveraging AI to bring ideas to life. It integrates Next.js for server-side rendering, Supabase for data management, Clerk for authentication, Google APIs, and Agent.ai. The tool provides live previews and automates version control, making web development fast and seamless.  

For more details, visit the [GitHub Repository](#).  

## 👥 Co-authors

This project was built along with:

- 🧠 [Raj Maurya](https://github.com/rajm012) – Backend + Model Integration

---

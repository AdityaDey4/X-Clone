# X-Clone

A full-stack social media application inspired by **X (formerly Twitter)**, built with **Next.js**, **TypeScript**, **Prisma**, and **Tailwind CSS**.  
This project replicates the core functionality of X — including posting, feeds, and user interaction — with real-time notifications and secure authentication.

---

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Real-time:** [Socket.IO](https://socket.io/)
- **Media Handling:** [ImageKit.io](https://imagekit.io/)
- **Runtime:** [Node.js](https://nodejs.org/)
- **Package Manager:** npm (can also use Yarn/PNPM)

---

## 📂 Project Structure

# X-Clone
├── prisma/ # Prisma schema & migrations  
├── public/ # Static assets  
├── src/ # Application source code  
│ ├── components/ # UI components  
│ ├── pages/ or app/ # Next.js routing  
│ ├── providers/ # Query oroviders for pagination  
│ ├── lib/ # Utilities / helpers  
│ └── sockets/ # Socket.IO event handling  
├── server/ # Socket.IO server setup  
├── tailwind.config.ts # Tailwind configuration  
├── postcss.config.js # PostCSS configuration  
├── package.json # Dependencies & scripts  
└── README.md # Project documentation  

---

## ✨ Features

- 🔐 **Secure User Authentication** with Clerk
- 📝 **Create Posts** with text and/or media
- 📰 **Feed** displaying latest posts
- ❤️ **Like / Unlike, Repost and Comment Posts**
- 👤 **User Profiles**
- 🔔 **Real-time Notifications** with Socket.IO
- 🎨 **Responsive Design** powered by Tailwind CSS
- ⚡ **Fast Rendering** with Next.js Server Components

---

## 🛠️ Installation & Setup

1️⃣ Clone the repository

- git clone https://github.com/AdityaDey4/X-Clone.git
- cd X-Clone

2️⃣ Install dependencies

- npm install

3️⃣ Set up environment variables

**Create a .env file in the root directory and configure:**
- DATABASE_URL="your_database_url_here"
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
- CLERK_SECRET_KEY="your_clerk_secret_key"
- CLERK_WEBHOOK_SIGNING_SECRET="webhook_secret_key"
- NEXT_PUBLIC_PUBLIC_KEY="your_imagekit_public_key"
- PRIVATE_KEY="your_imagekit_private_key"
- IMAGEKIT_URL_ENDPOINT="your_imagekit_url_endpoint"

4️⃣ Set up Prisma

- npx prisma migrate dev --name init
- npx prisma generate

5️⃣ Run the development server
- npm run dev

---

## 📜 License

This project is licensed under the MIT License.

---

## 🤝 Contributing
Pull requests are welcome! Please fork the repo and create a feature branch.
For major changes, open an issue first to discuss your ideas.

---

## 📁 Deployment

We deploy this application on Vercel, as it does not support WebSocket connections. Any other platforms would be perfect.

Reference: https://vercel.com/guides/do-vercel-serverless-functions-support-websocket-connections

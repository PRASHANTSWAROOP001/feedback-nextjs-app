# Feedback Collection Platform

## 🚀 What I Built

This is a feedback collection platform designed for ease and accountability. It allows an **admin** to create a **topic** (e.g., for alpha testing), define **categories** to manage email segments, and then collect structured feedback through a **frictionless magic link**.

### 🧩 How It Works

1. Admin creates a topic to collect feedback.
2. Admin defines a category to group emails (e.g., testers, users).
3. Admin uploads a `.csv` with emails (with `email` as header).
4. Users are sent invite links via email.
5. Users click the **magic link** and submit their feedback directly.
6. No more Google Forms. Just clean, accountable feedback collection.

**✅ 100% Accountability** | **💬 Zero Friction** | **📨 Streamlined Process**

---

## 🧪 Features

- Magic link feedback submission
- Email-based invite system
- Category-wise email groupings
- Clean and responsive UI
- Admin-controlled topic and invite creation

---

## 🔧 What's Missing / To-Do

- 🔗 Integration with Amazon SES using a verified domain
- 🧼 Polishing of some UI pages (still version 1)
- 💳 Add payment gateway for future SaaS version
- 🕵️ Add anonymous feedback option

---

## 🛠 Tech Stack

- **Frontend & Backend**: [Next.js](https://nextjs.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Auth**: [Clerk](https://clerk.dev/)
- **Emails**: Nodemailer (moving to Amazon SES)
- **Styling**: Tailwind CSS + ShadCN UI
- **Landing Page**: MagicUI components

---

## 📁 Folder Structure (Simplified)

```
/app
  /api
  /dashboard
  /landing
  /auth
/components
/lib
/utils
```

---

## 🧠 Inspiration

Built from a need to collect clean and traceable feedback without relying on clunky tools like Google Forms. This system allows admins to know who submitted what, making feedback loops tighter and more reliable.

---

## 📈 Future Vision

The platform will eventually evolve into a **SaaS** product with:
- Subscription plans
- Analytics for feedback
- Role-based admin system
- Custom domains

---

## 🙌 Contributions

If you'd like to suggest features, fix bugs, or contribute, feel free to open an issue or PR!

---

## 📫 Contact

Built with ❤️ by Prashant Swaroop
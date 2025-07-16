# 🗳️ Feedback Collection Platform

## 🚀 What I Built

A structured and frictionless **feedback collection platform** built for teams that value **clarity**, **accountability**, and **ease of use**.

Admins can create feedback topics, group users into categories, invite them via **magic links**, and collect feedback in a clean, efficient, and fully traceable way—no more cluttered Google Forms.

**✅ 100% Accountability** | **💬 Zero Friction** | **📨 Streamlined Process**

---

## 🧩 How It Works

1. **Create a Topic** – Define what you're collecting feedback for.
2. **Upload Emails** – Organize users with categories and CSV uploads.
3. **Send Magic Links** – Each user gets a unique link via email.
4. **Collect Feedback** – Authenticated users leave structured feedback.
5. **Track Everything** – Monitor feedback, activity, and email usage from the dashboard.

---

## 💡 What's New (Major Improvements)

* 🧾 **Razorpay Integration** – Users can now subscribe to a plan via secure payments.
* 💳 **One-Plan Subscription** – Simple, non-stackable pricing logic. Backend-secured validation.
* 📊 **Realtime Dashboard** – View metrics like:

  * Feedback received in the last 1 hour
  * Average rating in that timeframe
  * Emails sent per hour
  * Upcoming plan expiry reminder
  * Quick actions: add emails, create topics
* 📬 **Improved Email System**

  * Switched to **Resend** for better deliverability
  * Dynamic templates via **Handlebars**
  * Sent from your verified domain for improved trust
  * Faster, robust sending via `Promise.all` + `transaction` logic
  * Only **delivered emails** now count against `emailQuota`
* ⏱️ **Email Quota System**

  * Free tier with monthly quota resets
  * Quota tracked only for successfully delivered emails
  * Subscription check only kicks in after free tier is exhausted
* 🛡️ **Admin Controls**

  * Super admin route (easter egg: `/dashboard/admin`) to update pricing plans
  * Access secured via `.env` `ADMIN_ID`

---

## 🧪 Features Overview

* 🔗 Magic link-based feedback
* ✉️ Category-wise email segmentation
* 📦 Subscription & billing (via Razorpay)
* 📉 Dashboard analytics for feedback + email activity
* 🧮 Email quota and usage tracking
* 📑 Paginated views for clean data browsing
* 🔐 Role-based access (Admin / User)
* 🪄 Reminder on plan expiry for users
* 📬 Transactional email system (Resend + Handlebars)

---

## 🛠 Tech Stack

* **Frontend + Backend**: [Next.js](https://nextjs.org/)
* **Database**: PostgreSQL
* **ORM**: [Prisma](https://www.prisma.io/)
* **Auth**: [Clerk](https://clerk.dev/)
* **Emails**: Resend + Handlebars
* **Payments**: Razorpay
* **Styling**: Tailwind CSS + ShadCN UI
* **Landing Page UI**: MagicUI

---

## 📁 Simplified Folder Structure

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

## 🗄️ Database Schema

View the interactive schema on [DrawSQL](https://drawsql.app/teams/prashant-swaroop/diagrams/feedbacksass).

---

## 🧠 Inspiration

Born from the frustration of using bloated tools like Google Forms. This tool gives you full control—track **who** gave feedback and **what** they said, without friction for the users.

---

## 📈 Future Vision

The platform is shaping into a full-fledged **SaaS product** with:

* Subscription plans with tier-based features
* Analytics and insights from feedback
* Role-based permissions
* Custom domains for enterprise use
* Team management and shared dashboards

---

## 🙌 Contributions

Want to contribute? Feel free to open an issue, suggest a feature, or raise a PR. Always happy to collaborate!

---

## 📫 Contact

Built with ❤️ by **Prashant Swaroop**

Find me on [LinkedIn](https://www.linkedin.com/in/prashant-swaroop-b051141a5/) or drop a message if you want to collaborate, ask questions, or just geek out over dev tools.

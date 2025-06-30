# 🩺 SymptoWise – Your Personal AI Health Companion

<br>

![Banner](/assets/preview/Image_11.webp)

<br>

**SymptoWise** is a sleek, responsive, and AI-Powered **Health & Wellness Web Application** designed to empower users in managing their well-being. From identifying symptoms with natural language input to generating personalized daily routines, exploring diet and skincare recommendations, consulting virtual doctors, and even unwinding with mental wellness activities – SymptoWise offers an all-in-one solution for holistic health.

Built using **React**, **TypeScript**, **TailwindCSS**, **Firebase**, and the **OpenAI API**, it combines smart technology with user-friendly design to make proactive healthcare more accessible, engaging, and personalized.

<br>

## 📚 Table of Contents

* [✨ Features](#-features)
* [📸 Preview](#-preview)
* [📁 Project Structure](#-project-structure)
* [⚙️ Technologies Used](#-technologies-used)
* [🚀 Getting Started](#-getting-started)
* [🧪 Usage Guide](#-usage-guide)
* [🎥 Demo](#-demo)
* [🌈 Customization Ideas](#-customization-ideas)
* [🛠️ Future Improvements](#-future-improvements)
* [🤝 Contributing](#-contributing)
* [📄 License](#-license)
* [📄 Credits](#-credits)
* [📢 Author](#-author)

<br>

## ✨ Features

✅ Intelligent **Symptom Checker** powered by OpenAI API <br>
✅ **Routine Planner** for daily wellness planning <br>
✅ **Skincare & Exercise suggestions** tailored to user needs <br>
✅ **Nutrition Plan Generator** & AI-based recipe assistant <br>
✅ Option to **Consult Doctors** (static demo version) <br>
✅ Built-in **Fun Zone** for mental wellness <br>
✅ Fully **Responsive** UI with **Dark Mode** <br>
✅ Firebase **Authentication** and user context management <br>

<br>

## 📸 Preview

| **Login Page**                                   | **Home Page**                                    |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Login Page](/assets/preview/Image_1.webp)      | ![Home Page](/assets/preview/Image_2.webp)       |

| **Symptom Checker Page**                         | **Routine Planner Page**                         |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Symptom Checker](/assets/preview/Image_3.webp) | ![Routine Planner](/assets/preview/Image_4.webp) |

| **Skincare Solutions Page**                      | **Consult Doctor Page**                          |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Skincare](/assets/preview/Image_5.webp)        | ![Consult Doctor](/assets/preview/Image_6.webp)  |
    
| **Exercise Library Page**                        | **Nutrition Plans Page**                         |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Exercise](/assets/preview/Image_7.webp)        | ![Nutrition](/assets/preview/Image_8.webp)       |
    
| **Fun Zone Page**                                | **Profile Page**                                 |
| ------------------------------------------------ | ------------------------------------------------ |
| ![Fun Zone](/assets/preview/Image_9.webp)        | ![Profile](/assets/preview/Image_10.webp)        |


<br>

## 📁 Project Structure

```bash
SymptoWise/
├── public/
│   └── assets/
│       ├── images/             # App Visuals & UI Assets
│       ├── json/               # Static Data (Doctors, Diet Plans, Workouts)
│       └── preview/            # Website Preview   
│
├── src/
│   ├── components/             # Reusable UI + layout Components
│   ├── contexts/               # Global State Providers (Theme, Toast, Health)
│   ├── hooks/                  # Custom React Hooks
│   ├── layouts/                # Page Layouts
│   ├── lib/                    # Utility Functions & APIs
│   ├── pages/                  # All App Pages
│   ├── App.tsx                 # Main App With Routing
│   └── main.tsx                # App Entry Point
│
├── index.html                  # Base HTML Template
├── tailwind.config.js          # TailwindCSS Config
├── vite.config.ts              # Vite Build Settings
└── package.json                # Project Metadata & Dependencies
```

<br>

## ⚙️ Technologies Used

| Tech                   | Usage                                         |
| ---------------------- | --------------------------------------------- |
| **React (TypeScript)** | Component-based architecture with type safety |
| **Vite**               | Fast dev/build tooling                        |
| **TailwindCSS**        | Utility-first CSS framework                   |
| **Firebase**           | Authentication & session storage              |
| **OpenAI API**         | Symptom reasoning & recipe generation         |
| **Cloudinary**         | Cloud image hosting for user profile pictures |
| **Netlify**            | Hosting & deployment                          |
| **Context API**        | Global state (auth, health data, toasts)      |

<br>

## 🚀 Getting Started

To run the project locally:

1. **Clone the repository**

```bash
git clone https://github.com/FrostByte-49/SymptoWise.git
cd SymptoWise
```
---

2. **Install dependencies**

```bash
npm install
```
---

3. **Start the development server**

```bash
npm run dev
```
---

4. Open `http://localhost:5173` in your browser.

```text
⚠️ You may need to set up Firebase and OpenAI credentials in a `.env` file.
```

<br>

## 🧪 Usage Guide

1. 🔐 **Register or Log in** to access all features.
2. 🏠 Use the **Home page** as your navigation hub.
3. 🩺 Go to **Symptom Checker** and input any symptoms.
4. 📅 Visit **Routine Generator** to auto-plan your day.
5. 🧴 Check **Skincare** for tailored care tips.
6. 🏋️ Explore **Exercise** & 🥗 **Nutrition** pages.
7. 👩‍⚕️ Browse **Consult Doctors** to simulate connecting with experts.
8. 🎮 Unwind in the **Fun Zone** for mental health breaks.
9. 👤 Access your **Dashboard** to manage your data.

<br>

## 🎥 Demo

Want to see SymptoWise in action?
We’ve prepared a full walkthrough covering all the major features.

[![YouTube](https://img.shields.io/badge/YouTube-red?style=for-the-badge&logo=youtube)](https://youtu.be/yZ8Swcb1dsA)

```text
See how SymptoWise helps users check symptoms, plan routines, consult doctors, and manage wellness, all in one place.
```

<br>

## 🌈 Customization Ideas

Want to extend SymptoWise? Try:

* 🧠 Integrating real-time health APIs (e.g., symptom databases)
* 💬 Adding chat-based AI for health guidance
* 🧾 Exporting routines or meals as PDF
* 📈 Adding health stats tracking and charts
* 🔔 Notifications and reminders for routines

<br>

## 🛠️ Future Improvements

* [ ] Real-time doctor API integration
* [ ] Persistent routine planner (using Firestore)
* [ ] Full user profile editing
* [ ] Voice input for symptom checker
* [ ] Mobile-first offline mode with PWA

<br>

## 🤝 Contributing

Whether you're fixing bugs, building new features, improving performance, or even enhancing UI – We’d **love to have you onboard**! 

### 📦 Set up in Seconds

```bash
# 1. Fork the repository 🍴
git clone https://github.com/FrostByte-49/SymptoWise.git
cd SymptoWise


# 2. Create your feature branch 🌱
git checkout -b feature/your-feature-name


# 3. Make your changes 🎯


# 4. Commit and push 🚀
git commit -m "✨ Added: Short description of what you did"
git push origin feature/your-feature-name


# 5. Open a Pull Request 🔁
```

### 🧑‍💻 What You Can Work On

Here are some areas where **you can contribute**:

* 🔧 Bug fixes
* 🌟 New health modules or sections
* 🎨 UI/UX improvements
* 📖 Documentation and accessibility
* 🔌 API enhancements or integrations
* 🧪 Adding unit or integration tests <br><br>

### 💬 Got an Idea?

If you have feedback, feature suggestions, or questions:

* 📬 Open an **issue** on GitHub
* 🧠 Start a **discussion**
* 💌 Drop a suggestion

We truly believe **great things are built together**, and we’d love for you to be part of this journey.  💖 

<br>

## 📄 License

This Project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to explore and build upon it. <br>
**© 2025 Pranav Khalate**  

```text
Permission Is Hereby Granted, Free Of Charge, To Any Person Obtaining A Copy...
```

<br>

## 🙌 Credits

* [OpenAI](https://platform.openai.com/) – Core AI Model Powering Symptom Reasoning
* [ChatAnywhere API](https://chatanywhere.com.cn/) – API Proxy For Accessing OpenAI In China
* [Cloudinary](https://cloudinary.com/) – Image Hosting & Delivery
* [Firebase](https://firebase.google.com/) – Authentication & Real-Time Data Storage
* [LottieFiles](https://lottiefiles.com/) – Lightweight Animations
* [Font Awesome](https://fontawesome.com/) – Iconography
* [Google Fonts](https://fonts.google.com/) – Custom Typography

<br>

## 📢 Author

**Created by Pranav Khalate**

[![GitHub](https://img.shields.io/badge/GitHub-1e1e2f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/FrostByte-49) &nbsp;
[![Email](https://img.shields.io/badge/Email-ff6f91?style=for-the-badge&logo=gmail&logoColor=white)](mailto:pranav.kh49@gmail.com) &nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pranav-kh/) &nbsp;
[![Discord](https://img.shields.io/badge/Discord-5865f2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/users/1377918872925241375)

<br>

## 📌 Support the Project

If you found **SymptoWise** helpful or inspiring, consider giving this repository a ⭐️ – It helps others discover it and keeps the project growing!

<br>

> 💬 *Have feedback or want to collaborate? Drop me a message or open an issue!*


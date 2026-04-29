# CRUD Books Backend and Frontend Automation Project


This project contains automated tests of both backend (API) and frontend(UI) of a Library Management System. The test suite was built using JavaScript, Playwright, and Faker.js for dynamic test data generation.


## 🚀 Tech Stack 
- JavaScript (Node.js)
- Playwright – End-to-end and API testing
- Faker.js – Fake data generation


## 📦 Setup & Installation
1. **Clone the repository**  
```bash
git clone https://github.com/joanaraposo96/crud-livros-backend-and-frontend-automation-project.git
cd crud-livros-backend-and-frontend-automation-project
```

2. **Initialize Node.js project**
```
npm init -y
```

3. **Install Playwright**
```bash
npm install -D @playwright/test
npx playwright install
```

4. **Install Faker.js**
```
npm install @faker-js/faker
```

## 🔌 Backend API Setup
1. **Download the API Repository**: This test suite depends on a backend API running locally 👉 [CRUD Livros Expandido](https://github.com/brunonf15/crud-livros-expandido)

2. **Run the API**: By default, the API runs at **http://localhost:3000**
```bash
git clone https://github.com/brunonf15/crud-livros-expandido.git
cd brunonf15/crud-livros-expandido
npm install
npm start
```

3. **Configure Playwright**: Update playwright.config.js
```bash
use: {
  baseURL: 'http://localhost:3000'
}
```


## ▶️ Running Tests (UI mode)
```
npx playwright test --ui
```

## 📁 Project Structure
```md id="p9m1qx"
📦 crud-livros-backend-and-frontend-automation-project
├── 📂 components
│   └── 📄 Header.js
│
├── 📂 node_modules
│
├── 📂 playwright-report
│
├── 📂 pom
│   ├── 📄 Dashboard.js
│   ├── 📄 Details.js
│   ├── 📄 Favourites.js
│   ├── 📄 Login.js
│   ├── 📄 ManageBooks.js
│   └── 📄 Register.js
│
├── 📂 test-data
│   ├── 📄 apiBook.js
│   ├── 📄 book.js
│   ├── 📄 date.js
│   └── 📄 user.js
│
├── 📂 test-results
│
├── 📂 tests
│   ├── 📄 api.spec.js
│   ├── 📄 dashboard.spec.js
│   ├── 📄 details.spec.js
│   ├── 📄 favourites.spec.js
│   ├── 📄 login.spec.js
│   ├── 📄 logout.spec.js
│   ├── 📄 manageBooks.spec.js
│   └── 📄 register.spec.js
│
├── 📄 package-lock.json
├── 📄 package.json
├── 📄 playwright.config.js
└── 📄 README.md
```

## 🧪 Test Coverage
⚙️ **Backend (API)**
- User registration
- Login (success and failure)
- Books CRUD operations
- Statistics endpoint
- Favorites feature

🖥️ **Frontend (UI)**
- Authentication flow
- Navigation between pages
- Dashboard validation
- Book management
- Favorites system
- Route protection

## ⚠️ Important Note
Make sure the backend API is running locally before executing the tests, otherwise the test suite will fail.

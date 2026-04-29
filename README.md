# Books CRUD Backend and Frontend Automation Project


This project contains automated tests of both backend (API) and frontend (UI) of a Library Management System. The test suite was built using JavaScript, Playwright, and Faker.js for dynamic test data generation.


## 🚀 Tech Stack 
- JavaScript (Node.js)
- Playwright – End-to-end and API testing
- Faker.js – Fake data generation


## 📦 Setup & Installation
1. **Clone the repository**  
```bash
git clone https://github.com/joanaraposo96/books-crud-backend-and-frontend-automation-project.git
cd books-crud-backend-and-frontend-automation-project
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
This test suite depends on a backend API running locally 👉 [CRUD Livros Expandido](https://github.com/brunonf15/crud-livros-expandido).

1. **Clone the repository and Run the API** (by default, the API runs at **http://localhost:3000**)
```bash
git clone https://github.com/brunonf15/crud-livros-expandido.git
cd brunonf15/crud-livros-expandido
npm install
npm start
```

2. **Configure Playwright** (update playwright.config.js)
```bash
use: {
  baseURL: 'http://localhost:3000'
}
```


## ▶️ Running Tests (UI mode)
```
npx playwright test --ui
```

## 🧭 Locating trace files and running them

Trace files are saved inside:
```
test-results/**/trace.zip
```
Use the Playwright Trace Viewer to open a trace: 
```
npx playwright show-trace path/to/trace.zip
```
Example:
```
npx playwright show-trace test-results/api-Books-API-Books-Add-new-book-chromium//trace.zip
```
## 🔍 What you can inspect in a trace
- Step-by-step test execution
- Screenshots at each action
- DOM snapshots
- Network requests
- Console logs

## 📁 Project Structure
```md id="p9m1qx"
📦 books-crud-backend-and-frontend-automation-project
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
- Login
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

# 💸 Expense Splitter

A simple and interactive **expense-splitting web application** that helps groups fairly divide expenses and calculate who owes whom — perfect for trips, roommates, outings, or shared bills.

Built using **HTML, CSS, and Vanilla JavaScript** with local storage support.

---

## 🚀 Features

- ➕ Add multiple people dynamically  
- ❌ Remove people instantly  
- 💰 Add expenses with:
  - Who paid
  - Who the expense was for
  - Total amount
- 📊 Automatically calculates fair splits
- 🔁 Optimized settlement algorithm to reduce transactions
- 💾 Saves data using **localStorage**
- 🔄 Reset calculator anytime
- 🎨 Clean and responsive UI

---

## 🧠 How It Works

1. Add all participants.
2. Select who paid the bill.
3. Select who the expense was for (multiple people allowed).
4. Enter the amount.
5. The app:
   - Splits the amount equally
   - Tracks balances
   - Minimizes settlement transactions.

### Example

If:

- A pays ₹600 for A, B, C  

Each share = ₹200  

Then:

- B owes A ₹200  
- C owes A ₹200  

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6)**
- **LocalStorage API**

---

## 📂 Project Structure

```
Expense-Splitter/
│
├── index.html
├── style.css
├── app.js
├── assets/
│   ├── logo.png
│   └── background.jpeg
└── README.md
```

---

## ⚙️ Core Logic

- Each expense is stored as:
```js
{
  from: "Person A",
  to: "Person B",
  amount: 250
}
```

- Positive balance → money to receive  
- Negative balance → money owed  

- A greedy algorithm matches debtors with creditors to minimize transactions.

---

## 💾 Data Storage

The app uses browser **localStorage**:

```js
localStorage.setItem("settlementsData", JSON.stringify(settlements));
```

This ensures data remains after page refresh.

---

## ▶️ How to Run

1. Clone the repository:
```bash
git clone https://github.com/your-username/expense-splitter.git
```

2. Open the folder.

3. Run:
```
index.html
```

No server or installation required.

---

## ✨ Future Improvements

- Mobile responsiveness
- Dark mode
- Multiple currency support
- Export settlements (PDF / CSV)
- Group profiles
- Expense analytics

---

## 👨‍💻 Author

**Abhishek Verma**

- GitHub: https://github.com/Warrior5301  
- LinkedIn: https://www.linkedin.com/in/abhishek-verma-97b7343a1/

---

## 📄 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute it.

---

⭐ If you like this project, consider giving it a star!

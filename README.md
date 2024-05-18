
# StockMo

This is a web application to monitor the stock current values from your watchlist.

## Main Features
Here are just a few of the things that StockMo does well:

  - Smooth user interface to register and Login to your StockMo account.
  - Manages concurrent users, each having different watchlists.
  - Lets user add Stocks/Symbol to their watchlist.
  - Fetches the current stock values from https://www.alphavantage.co/ and displays in the users dashboard. 
  - Uses REST API using FASTApi. User validations are done through Tokens.
  - Uses PostgreSQL DataBase and React for FrontEnd and FastApi for Backend.
  - The frontEnd is designed using Material UI (MUI).

## How to setup
The source code is currently hosted on GitHub at:
https://github.com/anusha-uc/stock_mo

### 1. Clone the GitLab Repository
```sh
git clone https://github.com/anusha-uc/stock_mo.git
```
## 2. FrontEnd
### 2.1 Navigate to the react project directory
```sh
cd stock_frontend
```
### 2.2 Install react Dependencies
```sh
npm install
```
### 2.3 Update your token
Change https://www.alphavantage.co/ token in Dashboard.tsx file component
const API_KEY = '<token>'; 

### 2.4 Run the Project
```sh
npm start
```

## 3. Backend
### 3.1 Install packages
```sh
pip install requirements.txt
```

### 3.2 Update environment variables in .env file
DB_NAME=<Database Name>  
DB_USER=<Database Username>  
DB_PASSWORD=<Database Password>  
DB_HOST=<Database Server(‘localhost’ for local development)>  
DB_PORT=<Database Port>  
SECRET_KEY=<Secret key for creating token>

### 3.3 Run Backend
```sh
uvicorn main:app --reload
```

## 4.Create DB and tables in PostgreSQL
### 4.1 Create Database:
```sql
CREATE DATABASE database_name;
```
### 4.2 Create tables:
#### 4.2.1 Create users table:
```sql
CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    hashed_password VARCHAR(100) NOT NULL
);
```
#### 4.2.2 Create watchlist table:
```sql
CREATE TABLE IF NOT EXISTS watchlist
(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    CONSTRAINT watchlist_username_fkey FOREIGN KEY (username)
        REFERENCES users (username) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
```
#### For more details refer the below documentation
[Download Word Document](https://docs.google.com/document/d/1X1keCvPDKXnsryUWYjHkGsZ96oUlhnuqxRP7fFQZ924)


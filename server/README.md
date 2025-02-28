# API Documentation for KYC Application

## Base URL

```
http://localhost:8081/v1
```

---

## 1. Authentication

### 1.1 User Registration

**Endpoint:**

```
POST /auth/register
```

**Request Body (JSON):**

```json
{
  "name": "testuser",
  "email": "testuser@gmail.com",
  "password": "1234",
  "confirmedPassword": "1234",
  "mobileNo": "9876543210"
}
```

**Response:**

```json
{
  "message": "User registered successfully"
}
```

---

### 1.2 User Login

**Endpoint:**

```
POST /auth/login
```

**Request Body (JSON):**

```json
{
  "email": "testuser@gmail.com",
  "password": "1234"
}
```

**Response:**

```json
{
  "token": "your_generated_jwt_token_here"
}
```

---

### 1.3 User Logout

**Endpoint:**

```
POST /auth/logout
```

**Response:**

```json
{
  "message": "Logout successful"
}
```

---

## 2. User Data API

### 2.1 Update User Data

**Endpoint:**

```
PUT /data/update_data
```

**Request Body (JSON):**

```json
{
  "panDetails": {
    "panNumber": "ABCDE1234F",
    "dateOfBirth": "1995-05-12",
    "iAm": "Individual"
  },
  "profileDetails": {
    "gender": "Male",
    "placeOfBirth": "Pune",
    "occupation": "Software Engineer",
    "annualIncome": 500000,
    "citizenship": true,
    "informationConfirmation": true
  },
  "addressDetails": {
    "permanentAddress": "123 Street Name, Area, City",
    "landmark": "Near XYZ Mall",
    "permanentCity": "Mumbai",
    "permanentPincode": "400001",
    "permanentState": "Maharashtra",
    "permanentCountry": "India"
  }
}
```

**Response:**

```json
{
  "message": "User data updated successfully",
  "data": {
    "panDetails": {
      /* Updated PAN details */
    },
    "profileDetails": {
      /* Updated Profile details */
    },
    "addressDetails": {
      /* Updated Address details */
    }
  }
}
```

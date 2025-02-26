# API Documentation for KYC Application

This document provides details about the APIs for the KYC application, including endpoints, request bodies, and responses.

## Base URL

```
http://localhost:8081/v1
```

---

## 1. PAN Registration

### Endpoint

```
POST /pan/register-pan
```

### Request Body (JSON)

```json
{
  "panNumber": "ABCDE1234F",
  "mobileNo": "9876543210",
  "dateOfBirth": "1995-05-12",
  "email": "user@example.com",
  "iAm": "Individual"
}
```

### Response

```json
{
  "message": "Pan info successfully registered!",
  "data": {
    /* PAN details */
  }
}
```

---

## 2. Bank Registration

### Endpoint

```
POST /bank/register-bank
```

### Request Body (JSON)

```json
{
  "bankName": "HDFC Bank",
  "accountType": "Saving",
  "bankAccountNumber": "123456789012",
  "ifscCode": "HDFC0001234",
  "primary": true
}
```

### Response

```json
{
  "message": "Bank info successfully registered!",
  "data": {
    /* Bank details */
  }
}
```

---

## 3. Profile Creation

### Endpoint

```
POST /profile/create-profile
```

### Request Body (JSON)

```json
{
  "gender": "Male",
  "placeOfBirth": "Pune",
  "occupation": "Software Engineer",
  "annualIncome": 500000,
  "citizenship": true,
  "informationConfirmation": true
}
```

### Response

```json
{
  "message": "Profile successfully created!",
  "data": {
    /* Profile details */
  }
}
```

---

## 4. Address Registration

### Endpoint

```
POST /address/register-address
```

### Request Body (JSON)

```json
{
  "permanentAddress": "123 Street Name, Area, City",
  "landmark": "Near XYZ Mall",
  "permanentCity": "Mumbai",
  "permanentPincode": "400001",
  "permanentState": "Maharashtra",
  "permanentCountry": "India"
}
```

### Response

```json
{
  "message": "Address info successfully registered!",
  "data": {
    /* Address details */
  }
}
```

---

## 5. Demat Registration

### Endpoint

```
POST /demat/register-demat
```

### Request Body (JSON)

```json
{
  "clientMasterCopy": "file_upload",
  "dematAccountNumber": "1234567890",
  "depository": "NSDL",
  "holderName": "John Doe",
  "linkedBankAccount": "123456789012"
}
```

### Response

```json
{
  "message": "Demat account successfully registered!",
  "data": {
    /* Demat details */
  }
}
```

---

## 6. Authentication APIs

### 6.1 User Registration

**Endpoint:**
```
POST /auth/register
```

**Request Body (JSON):**
```json
{
    "name" : "testuser",
    "email" : "testuser@gmail.com",
    "password" : "1234",
    "confirmedPassword" : "12345",
    "mobileNo" : "2569874526"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

---

### 6.2 User Login

**Endpoint:**
```
POST /auth/login
```

**Request Body (JSON):**
```json
{
  "email": "testuser@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "your_generated_jwt_token_here"
}
```

---

## Notes

- All requests must be sent in JSON format.
- Ensure validation rules are met to avoid errors.
- `clientMasterCopy` for Demat requires a file upload.
- Use the correct `Content-Type` header for file uploads (`multipart/form-data`).

Let me know if you need further refinements! 🚀

```
```

## .env file
- PORT 
- MONGO_URI 
- SESSION_SECRET 
- JWT_SECRET 

```

---
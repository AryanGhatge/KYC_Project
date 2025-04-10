# KYC_Project

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
    "mobileNo": "9876543210",
    "dateOfBirth": "1995-08-15",
    "email": "user@example.com",
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
    "permanentAddress": "123, MG Road, Pune",
    "landmark": "Near City Mall",
    "permanentCity": "Pune",
    "permanentPincode": "411001",
    "permanentState": "Maharashtra",
    "permanentCountry": "India"
  },
  "bankDetails": [
    {
      "bankName": "HDFC Bank",
      "accountType": "Saving",
      "bankAccountNumber": 123456789012,
      "ifscCode": "HDFC0001234",
      "primary": true
    },
    {
      "bankName": "SBI Bank",
      "accountType": "Current",
      "bankAccountNumber": 987654321098,
      "ifscCode": "SBIN0005678",
      "primary": false
    }
  ],
  "dematDetails": [
    {
      "depository": "NSDL",
      "dpID": "1234567890123456",
      "clientID": "6543210987654321",
      "primary": true,
      "clientMasterCopy": "BASE64_ENCODED_FILE_HERE"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "panDetails": {
      "panNumber": "ABCDE1234F",
      "dateOfBirth": "1995-08-15T00:00:00.000Z",
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
      "permanentAddress": "123, MG Road, Pune",
      "landmark": "Near City Mall",
      "permanentCity": "Pune",
      "permanentPincode": "411001",
      "permanentState": "Maharashtra",
      "permanentCountry": "India"
    },
    "_id": "67f4a509e1adf48dc00131e0",
    "name": "mahi",
    "email": "mahi@gmail.com",
    "mobileNo": "1234567890",
    "password": "$2b$10$G8GCbGVX1/zZiRmzkFGuwOHo6nbQqyoHLoRdI/HJvl8Q6H6Karj42",
    "bankDetails": [
      {
        "bankName": "HDFC Bank",
        "accountType": "Saving",
        "bankAccountNumber": "123456789012",
        "ifscCode": "HDFC0001234",
        "primary": true,
        "_id": "67f4a6250b2dc86fadb62213"
      },
      {
        "bankName": "SBI Bank",
        "accountType": "Current",
        "bankAccountNumber": "987654321098",
        "ifscCode": "SBIN0005678",
        "primary": false,
        "_id": "67f4a6250b2dc86fadb62214"
      }
    ],
    "dematDetails": [
      {
        "depository": "NSDL",
        "dpID": "1234567890123456",
        "clientID": "6543210987654321",
        "primary": true,
        "clientMasterCopy": {
          "type": "Buffer",
          "data": [
            66, 65, 83, 69, 54, 52, 95, 69, 78, 67, 79, 68, 69, 68, 95, 70, 73,
            76, 69, 95, 72, 69, 82, 69
          ]
        },
        "_id": "67f4a6250b2dc86fadb62212"
      }
    ],
    "__v": 0
  }
}
```

**_ Env _**
MONGO_URI =
PORT = 8081
SESSION_SECRET = KYC_SECRET

CF_CLIENT_ID=your_cashfree_client_id
CF_CLIENT_SECRET=your_cashfree_client_secret

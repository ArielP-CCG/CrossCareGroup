# 📎 File Attachment Handling Guide - Power Automate Integration

## Overview
This guide explains how file attachments are sent from the frontend and how to properly handle them in Power Automate to save files to SharePoint, OneDrive, or email.

---

## 📤 Payload Format

### **Attachment Format: Base64 Encoded**

The attachments are sent as **Base64-encoded strings** (NOT binary). Here's the exact payload structure:

### **JSON Payload Structure**
```json
{
  "fields": {
    "ref_clientFullName": "John Doe",
    "ref_email": "john@example.com",
    // ... other form fields
  },
  "attachments": [
    {
      "name": "John_Doe_20260123_1.pdf",
      "content": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNTU+PgpzdHJlYW0KeJwr5HIK4TI2UzA0VzDUUzDk4grkMlQwAEJDBSMFQwUjBUMuAyMF..."
    },
    {
      "name": "John_Doe_20260123_2.jpg",
      "content": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCABkAGQDASIA..."
    }
  ]
}
```

### **Key Points**
- ✅ **Format**: Base64-encoded string
- ✅ **Location**: `attachments` array in the payload
- ✅ **Properties**: Each attachment has `name` and `content`
- ✅ **Content**: Pure Base64 string (no data URI prefix like `data:application/pdf;base64,`)

---

## 🔍 How Files Are Processed

### **Frontend Processing (JavaScript)**

```javascript
// 1. User selects file
const file = fileInput.files[0];

// 2. File is read as Data URL
const reader = new FileReader();
reader.readAsDataURL(file);

// 3. Data URL format: "data:application/pdf;base64,JVBERi0xLjQK..."
const dataURL = event.target.result;

// 4. Extract ONLY the Base64 part (remove prefix)
const base64Content = dataURL.split(',')[1];
// Result: "JVBERi0xLjQK..."

// 5. Create attachment object
const attachment = {
  name: "sanitized_filename.pdf",
  content: base64Content  // Pure Base64 string
};
```

### **Filename Convention (for make-a-referral)**
```javascript
// Format: {ClientName}_{Date}_{Index}.{Extension}
// Example: "John_Doe_20260123_1.pdf"

const clientFullName = "John Doe".replace(/[^a-z0-9]/gi, '_');  // "John_Doe"
const dateToday = "2026-01-23".replace(/-/g, '');                // "20260123"
const index = 1;
const extension = "pdf";

const filename = `${clientFullName}_${dateToday}_${index}.${extension}`;
// Result: "John_Doe_20260123_1.pdf"
```

---

## 🔧 Power Automate Implementation

### **Method 1: Save to SharePoint Document Library** ✅ Recommended

#### **Step-by-Step Setup**

1. **Trigger**: When a HTTP request is received
   - Use your existing trigger

2. **Parse JSON**: Parse the incoming payload
   ```json
   {
     "type": "object",
     "properties": {
       "fields": {
         "type": "object",
         "properties": {
           "ref_clientFullName": { "type": "string" },
           "ref_email": { "type": "string" }
           // ... other fields
         }
       },
       "attachments": {
         "type": "array",
         "items": {
           "type": "object",
           "properties": {
             "name": { "type": "string" },
             "content": { "type": "string" }
           }
         }
       }
     }
   }
   ```

3. **Condition**: Check if attachments exist
   ```
   Condition: length(body('Parse_JSON')?['attachments']) is greater than 0
   ```

4. **Apply to each**: Loop through attachments
   - Select: `attachments` from Parse JSON output

5. **Create file** (SharePoint)
   - **Action**: SharePoint - Create file
   - **Site Address**: Your SharePoint site
   - **Folder Path**: `/Shared Documents/Referrals` (or your path)
   - **File Name**: `items('Apply_to_each')?['name']`
   - **File Content**: `base64ToBinary(items('Apply_to_each')?['content'])`

#### **Power Automate Expression**
```
base64ToBinary(items('Apply_to_each')?['content'])
```

This converts the Base64 string back to binary for SharePoint.

---

### **Method 2: Save to OneDrive**

#### **Create file** (OneDrive)
- **Action**: OneDrive for Business - Create file
- **Folder Path**: `/Referrals`
- **File Name**: `items('Apply_to_each')?['name']`
- **File Content**: `base64ToBinary(items('Apply_to_each')?['content'])`

---

### **Method 3: Send as Email Attachment**

#### **Send an email** (Outlook)
- **Action**: Office 365 Outlook - Send an email (V2)
- **To**: Recipient email
- **Subject**: Referral from [Client Name]
- **Body**: Email content
- **Attachments**: 
  - **Name**: `items('Apply_to_each')?['name']`
  - **Content Bytes**: `base64ToBinary(items('Apply_to_each')?['content'])`

---

### **Method 4: Multiple Destinations**

You can combine methods to save to SharePoint AND send via email:

```
Apply to each (attachments)
  ├─ Create file (SharePoint)
  └─ Add to email attachments array

Send email with all attachments
```

---

## 📋 Complete Power Automate Flow Example

### **Flow Structure**
```
1. When a HTTP request is received
   └─ Trigger URL: https://prod-xx.logic.azure.com/...

2. Parse JSON
   └─ Content: @triggerBody()
   └─ Schema: [See schema above]

3. Initialize variable - Email Body
   └─ Name: emailBody
   └─ Type: String
   └─ Value: "New referral received..."

4. Condition - Has Attachments?
   └─ Expression: length(body('Parse_JSON')?['attachments'])
   └─ Condition: is greater than 0

   ├─ If YES:
   │   └─ Apply to each
   │       └─ Select: body('Parse_JSON')?['attachments']
   │       
   │       ├─ Create file (SharePoint)
   │       │   └─ Site: https://yourcompany.sharepoint.com/sites/CCG
   │       │   └─ Folder: /Shared Documents/Referrals
   │       │   └─ File Name: items('Apply_to_each')?['name']
   │       │   └─ File Content: base64ToBinary(items('Apply_to_each')?['content'])
   │       
   │       └─ Append to string variable (emailBody)
   │           └─ Value: "Attachment: @{items('Apply_to_each')?['name']}\n"
   │
   └─ If NO:
       └─ (Continue without attachments)

5. Send an email (V2)
   └─ To: referrals@crosscaregroup.com.au
   └─ Subject: New Referral - @{body('Parse_JSON')?['fields']?['ref_clientFullName']}
   └─ Body: @{variables('emailBody')}
   └─ Attachments: (Optional - if you want to attach to email too)

6. Respond to HTTP request
   └─ Status Code: 200
   └─ Body: {"status": "success"}
```

---

## 🔑 Key Power Automate Expressions

### **Convert Base64 to Binary**
```javascript
base64ToBinary(items('Apply_to_each')?['content'])
```

### **Get Attachment Name**
```javascript
items('Apply_to_each')?['name']
```

### **Check if Attachments Exist**
```javascript
length(body('Parse_JSON')?['attachments'])
```

### **Get Client Name from Fields**
```javascript
body('Parse_JSON')?['fields']?['ref_clientFullName']
```

### **Create Dynamic Folder Path**
```javascript
concat('/Shared Documents/Referrals/', formatDateTime(utcNow(), 'yyyy-MM'))
// Result: /Shared Documents/Referrals/2026-01
```

---

## 📊 Payload Example (Real Data)

### **Complete Referral Payload**
```json
{
  "fields": {
    "ref_clientFullName": "John Smith",
    "ref_email": "john.smith@example.com",
    "ref_phone": "0412345678",
    "ref_dob": "1980-05-15",
    "ref_address": "123 Main St, Melbourne VIC 3000",
    "ref_serviceType": "Rehabilitation in the Home",
    "ref_referrerName": "Dr. Jane Doe",
    "ref_referrerOrg": "Melbourne Hospital",
    "ref_urgency": "Routine",
    "ref_notes": "Patient requires post-surgery rehabilitation"
  },
  "attachments": [
    {
      "name": "John_Smith_20260123_1.pdf",
      "content": "JVBERi0xLjQKJeLjz9MKMyAwIG9iago8PC9UeXBlIC9QYWdlCi9QYXJlbnQgMSAwIFIKL1Jlc291cmNlcyAyIDAgUgovQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9GaWx0ZXIgL0ZsYXRlRGVjb2RlIC9MZW5ndGggNTU+PgpzdHJlYW0KeJwr5HIK4TI2UzA0VzDUUzDk4grkMlQwAEJDBSMFQwUjBUMuAyMF..."
    },
    {
      "name": "John_Smith_20260123_2.jpg",
      "content": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz..."
    }
  ]
}
```

---

## ✅ Testing in Power Automate

### **Test Payload (Small File)**
```json
{
  "fields": {
    "ref_clientFullName": "Test User",
    "ref_email": "test@example.com"
  },
  "attachments": [
    {
      "name": "test_document.txt",
      "content": "SGVsbG8gV29ybGQhIFRoaXMgaXMgYSB0ZXN0IGZpbGUu"
    }
  ]
}
```

**Note**: The Base64 string above decodes to: "Hello World! This is a test file."

### **How to Test**
1. Copy the test payload above
2. In Power Automate, click "Test" → "Manually"
3. Paste the JSON payload
4. Run the flow
5. Check SharePoint/OneDrive for the created file
6. Download and verify the file content

---

## 🚨 Common Issues & Solutions

### **Issue 1: File is corrupted after saving**
**Cause**: Not using `base64ToBinary()` function
**Solution**: Always use `base64ToBinary(items('Apply_to_each')?['content'])`

### **Issue 2: "Invalid base64 string" error**
**Cause**: Including the data URI prefix (`data:application/pdf;base64,`)
**Solution**: Our frontend already strips this - the `content` field is pure Base64

### **Issue 3: Filename has special characters**
**Cause**: Original filename not sanitized
**Solution**: Our frontend sanitizes filenames - use the `name` field as-is

### **Issue 4: Large files fail**
**Cause**: Power Automate has limits (100MB for HTTP trigger)
**Solution**: Our frontend limits files to 10MB - should work fine

### **Issue 5: Multiple files not saving**
**Cause**: Not using "Apply to each" loop
**Solution**: Always loop through the `attachments` array

---

## 📐 SharePoint Folder Structure Recommendation

### **Organized by Date**
```
/Shared Documents/Referrals/
  ├─ 2026-01/
  │   ├─ John_Smith_20260123_1.pdf
  │   ├─ John_Smith_20260123_2.jpg
  │   └─ Jane_Doe_20260125_1.pdf
  ├─ 2026-02/
  │   └─ ...
```

### **Power Automate Expression for Dynamic Folder**
```javascript
concat('/Shared Documents/Referrals/', formatDateTime(utcNow(), 'yyyy-MM'))
```

### **Organized by Client Name**
```
/Shared Documents/Referrals/
  ├─ John_Smith/
  │   ├─ John_Smith_20260123_1.pdf
  │   └─ John_Smith_20260123_2.jpg
  ├─ Jane_Doe/
  │   └─ Jane_Doe_20260125_1.pdf
```

### **Power Automate Expression**
```javascript
concat('/Shared Documents/Referrals/', body('Parse_JSON')?['fields']?['ref_clientFullName'])
```

---

## 🔐 Security Considerations

### **Already Implemented**
- ✅ File type validation (frontend + backend)
- ✅ File size limits (10MB max)
- ✅ File count limits (5 files max)
- ✅ Filename sanitization
- ✅ Double extension check
- ✅ Base64 validation (backend)

### **Power Automate Security**
- ✅ Use managed identities for SharePoint access
- ✅ Set appropriate folder permissions
- ✅ Enable versioning in SharePoint
- ✅ Set up retention policies
- ✅ Enable audit logging

---

## 📊 Performance Considerations

### **File Size Impact**
- Small files (<1MB): ~1-2 seconds
- Medium files (1-5MB): ~3-5 seconds
- Large files (5-10MB): ~6-10 seconds

### **Optimization Tips**
1. **Parallel Processing**: If saving to multiple locations, use parallel branches
2. **Async Operations**: Don't wait for file save to complete before responding
3. **Chunking**: For very large files, consider chunked upload (not needed for 10MB limit)

---

## 🎯 Quick Reference

### **Payload Format**
```json
{
  "attachments": [
    {
      "name": "filename.pdf",
      "content": "Base64EncodedString"
    }
  ]
}
```

### **Power Automate Actions**

| Destination | Action | File Content Expression |
|-------------|--------|------------------------|
| SharePoint | Create file | `base64ToBinary(items('Apply_to_each')?['content'])` |
| OneDrive | Create file | `base64ToBinary(items('Apply_to_each')?['content'])` |
| Email | Send email (V2) | `base64ToBinary(items('Apply_to_each')?['content'])` |
| Azure Blob | Create blob | `base64ToBinary(items('Apply_to_each')?['content'])` |

### **Essential Expressions**
```javascript
// Convert Base64 to Binary
base64ToBinary(items('Apply_to_each')?['content'])

// Get filename
items('Apply_to_each')?['name']

// Check if attachments exist
length(body('Parse_JSON')?['attachments']) > 0

// Dynamic folder path (by month)
concat('/Shared Documents/Referrals/', formatDateTime(utcNow(), 'yyyy-MM'))

// Dynamic folder path (by client)
concat('/Shared Documents/Referrals/', body('Parse_JSON')?['fields']?['ref_clientFullName'])
```

---

## 📞 Support

### **Testing**
1. Use the test payload provided above
2. Verify file saves correctly
3. Download and open the file
4. Check file size and content

### **Troubleshooting**
- Check Power Automate run history
- Verify Base64 string is valid
- Ensure SharePoint permissions are correct
- Check file size limits

---

## ✨ Summary

**Attachment Format**: ✅ **Base64-encoded strings**

**Power Automate Conversion**: ✅ **Use `base64ToBinary()` function**

**Key Points**:
- Attachments are in the `attachments` array
- Each has `name` and `content` properties
- Content is pure Base64 (no prefix)
- Use `base64ToBinary()` to convert for saving
- Loop through attachments with "Apply to each"
- Can save to SharePoint, OneDrive, or email

**Your implementation is ready to go!** 🚀

---

**Last Updated**: 2026-01-23  
**Version**: 1.0

# 📥 Import Format Guide

## 📋 JSON Format cho Flashcards

### **Format Cơ Bản (Bắt Buộc)**

```json
[
  {
    "id": 1,
    "word": "facilitate",
    "meaning": "hỗ trợ, tạo điều kiện",
    "example": "The new software facilitates communication.",
    "phonetic": "/fəˈsɪlɪteɪt/",
    "type": "verb",
    "status": "new",
    "review": {
      "lastReviewed": "2026-05-20T10:00:00Z",
      "nextReview": "2026-05-21T10:00:00Z",
      "interval": 1,
      "easeFactor": 2.5,
      "repetition": 0
    }
  }
]
```

---

## 🔍 Chi Tiết Từng Field

### **Field Bắt Buộc:**

| Field | Loại | Ví dụ | Mô Tả |
|-------|------|-------|-------|
| `id` | number | `1` | ID duy nhất (không được trùng) |
| `word` | string | `"facilitate"` | Từ vựng tiếng Anh |
| `meaning` | string | `"hỗ trợ, tạo điều kiện"` | Nghĩa tiếng Việt |
| `example` | string | `"The new software..."` | Câu ví dụ |
| `phonetic` | string | `"/fəˈsɪlɪteɪt/"` | Phát âm IPA |
| `type` | string | `"verb"` | Loại từ (noun, verb, adjective, etc.) |
| `status` | string | `"new"` | Trạng thái (new, learning, remembered) |
| `review` | object | `{...}` | Dữ liệu spaced repetition |

### **Review Object (Bắt Buộc):**

```json
{
  "lastReviewed": "2026-05-20T10:00:00Z",    // Lần ôn cuối (ISO 8601)
  "nextReview": "2026-05-21T10:00:00Z",      // Lần ôn tiếp (ISO 8601)
  "interval": 1,                              // Số ngày chờ (1, 3, 7, 14, 30...)
  "easeFactor": 2.5,                         // Độ khó (1.3 - 2.5+)
  "repetition": 0                            // Lần nhớ liên tiếp
}
```

### **Field Tùy Chọn:**

| Field | Loại | Ví dụ | Mô Tả |
|-------|------|-------|-------|
| `tags` | array | `["business", "advanced"]` | Nhãn phân loại |
| `notes` | string | `"Remember..."` | Ghi chú riêng |
| `createdAt` | string | `"2026-05-20T10:00:00Z"` | Ngày tạo (ISO 8601) |

---

## 📝 Ví Dụ Chi Tiết

### **Ví Dụ 1: Flashcard Mới**

```json
{
  "id": 1,
  "word": "benevolent",
  "meaning": "tốt bụng, từ bi",
  "example": "The benevolent organization helps underprivileged children.",
  "phonetic": "/bəˈnevələnt/",
  "type": "adjective",
  "status": "new",
  "tags": ["positive", "character"],
  "review": {
    "lastReviewed": "2026-05-20T14:30:00Z",
    "nextReview": "2026-05-21T14:30:00Z",
    "interval": 1,
    "easeFactor": 2.5,
    "repetition": 0
  }
}
```

### **Ví Dụ 2: Flashcard Đang Học**

```json
{
  "id": 2,
  "word": "eloquent",
  "meaning": "lưu loát, có hùng biện",
  "example": "She gave an eloquent speech about social change.",
  "phonetic": "/ˈeləkwənt/",
  "type": "adjective",
  "status": "learning",
  "tags": ["communication"],
  "notes": "Hay dùng trong presentations",
  "review": {
    "lastReviewed": "2026-05-19T10:00:00Z",
    "nextReview": "2026-05-22T10:00:00Z",
    "interval": 3,
    "easeFactor": 2.3,
    "repetition": 1
  }
}
```

### **Ví Dụ 3: Flashcard Đã Nhớ**

```json
{
  "id": 3,
  "word": "meticulous",
  "meaning": "cẩn thận, tỉ mỉ",
  "example": "The architect paid meticulous attention to every detail.",
  "phonetic": "/məˈtɪkjələs/",
  "type": "adjective",
  "status": "remembered",
  "tags": ["work", "positive"],
  "review": {
    "lastReviewed": "2026-05-15T09:00:00Z",
    "nextReview": "2026-05-28T09:00:00Z",
    "interval": 14,
    "easeFactor": 2.5,
    "repetition": 5
  }
}
```

---

## 🎯 Status Types

```typescript
type CardStatus = 'new' | 'learning' | 'remembered';
```

| Status | Ý Nghĩa | Hiển Thị |
|--------|---------|---------|
| `new` | Chưa bao giờ ôn | 🔴 Mới |
| `learning` | Đang học (0-2 lần đúng) | 🟡 Đang học |
| `remembered` | Đã thuộc (3+ lần đúng) | 🟢 Đã nhớ |

---

## 🏷️ Word Types

```typescript
type WordType = 
  | 'noun'         // Danh từ
  | 'verb'         // Động từ
  | 'adjective'    // Tính từ
  | 'adverb'       // Trạng từ
  | 'preposition'  // Giới từ
  | 'pronoun'      // Đại từ
  | 'conjunction'  // Liên từ
  | 'interjection' // Thán từ
```

---

## 📤 Complete File Example

Lưu dưới tên: `my-flashcards.json`

```json
[
  {
    "id": 1,
    "word": "facilitate",
    "meaning": "hỗ trợ, tạo điều kiện",
    "example": "The new software facilitates communication.",
    "phonetic": "/fəˈsɪlɪteɪt/",
    "type": "verb",
    "status": "new",
    "tags": ["business", "advanced"],
    "review": {
      "lastReviewed": "2026-05-20T10:00:00Z",
      "nextReview": "2026-05-21T10:00:00Z",
      "interval": 1,
      "easeFactor": 2.5,
      "repetition": 0
    }
  },
  {
    "id": 2,
    "word": "serendipity",
    "meaning": "sự may mắn không ngờ",
    "example": "It was pure serendipity that we met at the same café.",
    "phonetic": "/ˌserənˈdɪpɪti/",
    "type": "noun",
    "status": "new",
    "tags": ["advanced"],
    "review": {
      "lastReviewed": "2026-05-20T10:00:00Z",
      "nextReview": "2026-05-21T10:00:00Z",
      "interval": 1,
      "easeFactor": 2.5,
      "repetition": 0
    }
  },
  {
    "id": 3,
    "word": "eloquent",
    "meaning": "lưu loát, có hùng biện",
    "example": "She gave an eloquent speech about social change.",
    "phonetic": "/ˈeləkwənt/",
    "type": "adjective",
    "status": "learning",
    "tags": ["communication"],
    "notes": "Dùng khi nói về khả năng trình bày",
    "review": {
      "lastReviewed": "2026-05-19T10:00:00Z",
      "nextReview": "2026-05-22T10:00:00Z",
      "interval": 3,
      "easeFactor": 2.3,
      "repetition": 1
    }
  }
]
```

---

## ✅ Validation Rules

### **ID:**
- ✅ Phải là số (number)
- ✅ Mỗi ID phải duy nhất (không trùng)
- ✅ Có thể bắt đầu từ 1 hoặc bất kỳ số nào

### **Word:**
- ✅ Phải là string (không rỗng)
- ✅ Khuyên dùng tiếng Anh

### **Meaning:**
- ✅ Phải là string (không rỗng)
- ✅ Khuyên dùng tiếng Việt

### **Type:**
- ✅ Phải là một trong: noun, verb, adjective, adverb, preposition, pronoun, conjunction, interjection
- ✅ Không được tùy ý

### **Status:**
- ✅ Phải là một trong: new, learning, remembered
- ✅ Không được tùy ý

### **Interval:**
- ✅ Phải là số dương (> 0)
- ✅ Thường: 1, 3, 7, 14, 30, ...

### **EaseFactor:**
- ✅ Phải >= 1.3
- ✅ Thường 1.3 - 2.5+
- ✅ Ở status "new" khuyên = 2.5

### **Repetition:**
- ✅ Phải >= 0
- ✅ Ở status "new" khuyên = 0

### **Ngày (ISO 8601):**
- ✅ Format: `YYYY-MM-DDTHH:mm:ssZ`
- ✅ Ví dụ: `2026-05-20T14:30:00Z`

---

## 🚀 Cách Import

### **Step 1: Chuẩn bị JSON file**

Tạo file `flashcards.json` với format ở trên

### **Step 2: Mở ứng dụng**

Truy cập: `http://localhost:5173/flashcard-learning/`

### **Step 3: Click Import**

![Import Button](./docs/import-button.png)

1. Nhấn nút **Import** ở header
2. Chọn file JSON
3. Chờ load xong
4. Thông báo "Import successful" ✅

### **Step 4: Kiểm tra**

- Click **Cards** xem flashcards đã import
- Click **Dashboard** xem thống kê
- Bắt đầu học!

---

## ⚠️ Lỗi Thường Gặp

### **Lỗi 1: "Invalid JSON format"**

```json
❌ Sai: {id: 1, word: "hello"}  // Missing quotes
✅ Đúng: {"id": 1, "word": "hello"}
```

### **Lỗi 2: "Duplicate IDs"**

```json
❌ Sai:
[
  {"id": 1, "word": "a", ...},
  {"id": 1, "word": "b", ...}  // ID 1 trùng
]

✅ Đúng:
[
  {"id": 1, "word": "a", ...},
  {"id": 2, "word": "b", ...}
]
```

### **Lỗi 3: "Missing required fields"**

```json
❌ Sai: {"id": 1}  // Missing word, meaning, etc.

✅ Đúng: 
{
  "id": 1,
  "word": "hello",
  "meaning": "xin chào",
  "example": "Hello world",
  "phonetic": "/həˈloʊ/",
  "type": "interjection",
  "status": "new",
  "review": {...}
}
```

### **Lỗi 4: "Invalid status"**

```json
❌ Sai: "status": "learning2"
✅ Đúng: "status": "learning"  // Only: new, learning, remembered
```

### **Lỗi 5: "Invalid date format"**

```json
❌ Sai: "nextReview": "05-20-2026"
✅ Đúng: "nextReview": "2026-05-20T10:00:00Z"
```

---

## 🧪 Test JSON Online

Kiểm tra JSON có hợp lệ:
- https://jsonlint.com/

---

## 💾 Export Format

Khi bạn **Export** từ ứng dụng, file sẽ có format này:

```json
{
  "version": "1.0.0",
  "exportDate": "2026-05-20T15:30:00Z",
  "cards": [
    {
      "id": 1,
      "word": "facilitate",
      ...
    }
  ],
  "stats": {
    "totalLearned": 5,
    "totalSessions": 10
  }
}
```

Bạn có thể **import lại** file này mà không cần chỉnh sửa! ✅

---

## 🎓 Tips

1. **Thêm tags** - Giúp phân loại từ vựng theo chủ đề
2. **Viết example cụ thể** - Giúp nhớ cách dùng từ
3. **Phonetic chính xác** - Dùng cho pronunciation
4. **Kiểm tra trước import** - Sử dụng JSONLint
5. **Backup định kỳ** - Export data quy định
6. **Import từng batch** - Nếu file quá lớn (>10000 cards)

---

**Bây giờ bạn đã sẵn sàng import flashcards! 🚀**

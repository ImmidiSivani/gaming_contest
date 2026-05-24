# Quick Start Guide - Phase 2 Debugging Update

## Files Modified/Created

### Frontend
```
frontend/
├── src/
│   ├── pages/
│   │   └── Phase2.jsx ........................ COMPLETELY REWRITTEN
│   ├── services/
│   │   └── submissionService.js ............. UPDATED (added runDebugCode)
│   └── styles/
│       └── Phase2.css ........................ NEW FILE (optional, for enhanced styling)
```

### Backend
```
backend/
├── controllers/
│   └── submissionController.js .............. UPDATED (added runDebugCode function)
└── routes/
    └── submissionRoutes.js .................. UPDATED (added /run-debug route)
```

## Key Changes Summary

### 1. Frontend Phase2.jsx
**Before:** Simple textarea for code input
**After:** Full Monaco Editor with:
- Multi-language support
- Pre-loaded buggy code
- Run button for testing
- Submit button for grading
- Test result visualization
- Question sidebar

### 2. New API Endpoint
```
POST /api/submissions/run-debug
Purpose: Execute code against test cases (no scoring)
```

### 3. No Breaking Changes
- Existing submit endpoint unchanged
- Scoring logic preserved
- Phase completion logic preserved
- Database schema compatible

## Deployment Steps

### Step 1: Update Frontend Files
```bash
cd frontend

# File 1: Replace src/pages/Phase2.jsx with new version
# File 2: Update src/services/submissionService.js

# Optional: Add styling
mkdir -p src/styles
# Copy Phase2.css to src/styles/Phase2.css
```

### Step 2: Update Backend Files
```bash
cd backend

# File 1: Update controllers/submissionController.js
# File 2: Update routes/submissionRoutes.js

# No new packages needed
```

### Step 3: Verify Dependencies
```bash
# Frontend - Check package.json includes:
# - @monaco-editor/react ^4.7.0 ✓
# - monaco-editor ^0.55.1 ✓

# Backend - Already has:
# - judge0Service ✓
# - axios ✓
```

### Step 4: Test the Changes
```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd frontend
npm run dev

# Visit http://localhost:5173
# Navigate to Phase 2
```

## Database Preparation

Ensure your DEBUG questions have:

```javascript
{
  type: "DEBUG",
  starterCode: "// buggy code here",
  languageId: 71,  // Python example
  testCases: [
    {
      input: "5",
      expectedOutput: "25",
      isHidden: false
    },
    {
      input: "10",
      expectedOutput: "100",
      isHidden: true  // Hidden test cases
    }
  ],
  hints: ["Check your formula", "Square should be x*x"],
  marks: 10,
  wrongSubmissionPenalty: 2,
  hintPenalty: 1
}
```

## Testing Workflow

### Test 1: Load Question
1. Navigate to Phase 2
2. Select a DEBUG question
3. ✅ Verify code pre-loads in editor
4. ✅ Verify language selector shows correct language

### Test 2: Run Code
1. Make a simple change (e.g., fix a bug)
2. Click "▶ Run Code" button
3. ✅ See test results appear
4. ✅ Verify pass/fail indicators
5. ✅ Verify sample test cases display

### Test 3: Submit Code
1. Fix the code to pass all tests
2. Click "✓ Submit" button
3. ✅ Verify "Correct" result appears
4. ✅ Verify score is calculated
5. ✅ Verify question marked as attempted

### Test 4: Navigation
1. Navigate between questions
2. ✅ Verify code persists
3. ✅ Verify state is maintained
4. ✅ Verify attempted questions show checkmark

### Test 5: Mobile Responsive
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. ✅ Verify layout adjusts
4. ✅ Verify buttons are clickable
5. ✅ Verify editor is usable

### Test 6: Different Languages
1. Select Python from language dropdown
2. Change code to Python syntax
3. Click Run
4. ✅ Verify Python code executes
5. Repeat for JavaScript, Java, C++

## Common Issues & Solutions

### Issue: Run button greyed out
- **Cause:** Code field is empty
- **Solution:** Type some code first

### Issue: "Debug question not found" error
- **Cause:** Question type is not DEBUG
- **Solution:** Check question.type in database

### Issue: No test results showing
- **Cause:** Question has no testCases
- **Solution:** Add testCases to question in database

### Issue: Monaco Editor not rendering
- **Cause:** Package not installed
- **Solution:** `npm install` in frontend folder

### Issue: Slow execution
- **Cause:** Judge0 API rate limiting
- **Solution:** Normal - Judge0 has 200 requests/day free tier

## API Request Examples

### Run Code
```bash
curl -X POST http://localhost:3000/api/submissions/run-debug \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "questionId": "507f1f77bcf86cd799439011",
    "code": "def square(x):\n  return x * x",
    "languageId": 71
  }'
```

### Submit Code
```bash
curl -X POST http://localhost:3000/api/submissions/debug \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "questionId": "507f1f77bcf86cd799439011",
    "answer": "def square(x):\n  return x * x",
    "hintsUsed": 0
  }'
```

## Browser Console Debugging

Enable console logging:
```javascript
// In browser console
localStorage.debug = '*'  // Shows all logs
// Refresh page
```

Check for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check Network tab for 404s on API calls

## Performance Metrics

- Page load: ~1-2 seconds
- Editor initialization: ~500ms
- Code execution: ~2-5 seconds (Judge0)
- Result display: <100ms

## Rollback Procedure

If issues occur, revert changes:

```bash
# Frontend
git checkout frontend/src/pages/Phase2.jsx
git checkout frontend/src/services/submissionService.js

# Backend
git checkout backend/controllers/submissionController.js
git checkout backend/routes/submissionRoutes.js

# Restart servers
```

## Support Resources

- Monaco Editor Docs: https://microsoft.github.io/monaco-editor/
- Judge0 API: https://judge0.com/docs
- React Hooks: https://react.dev/reference/react/hooks
- Tailwind CSS: https://tailwindcss.com/docs

## Next Steps

After deployment:
1. ✅ Monitor error logs
2. ✅ Get user feedback
3. ✅ Monitor Judge0 API usage
4. ✅ Plan Phase 3 updates (if needed)
5. ✅ Consider dark mode support

## Performance Tuning (Optional)

### Optimize Monaco Editor
```javascript
// In Phase2.jsx editor options
{
  fontSize: 13,
  tabSize: 2,
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  minimap: { enabled: false },  // Disable for speed
  smoothScrolling: true,
  cursorBlinking: 'blink',
  colorDecorators: false,  // Disable if slow
}
```

### Optimize API Calls
- Add request debouncing for Run button (optional)
- Implement request cancellation for new runs
- Cache question data where possible

## Monitoring

Track these metrics:
- Run button success rate
- Submit button success rate
- Average execution time
- Judge0 API errors
- User completion rate
- Score distribution

---

**Last Updated:** 2024
**Version:** 1.0

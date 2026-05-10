# GeoAttend - API Integration Guide

## Supabase REST API Integration

The app uses Supabase client SDK for all database operations. No direct API calls needed.

### Authentication

```javascript
import { supabase } from './supabase/client'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign out
await supabase.auth.signOut()
```

### Reading Data

```javascript
// Select all
const { data, error } = await supabase
  .from('users')
  .select('*')

// Select with filter
const { data, error } = await supabase
  .from('attendance')
  .select('*')
  .eq('student_id', userId)
  .order('attendance_date', { ascending: false })

// Get single row
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single()
```

### Creating Data

```javascript
// Insert single row
const { data, error } = await supabase
  .from('attendance')
  .insert([{
    student_id: userId,
    attendance_date: '2024-05-10',
    entry_time: new Date().toISOString(),
    is_marked: false
  }])
  .select()
  .single()

// Insert multiple rows
const { data, error } = await supabase
  .from('table_name')
  .insert([
    { column1: 'value1' },
    { column1: 'value2' }
  ])
```

### Updating Data

```javascript
const { data, error } = await supabase
  .from('attendance')
  .update({
    is_marked: true,
    exit_time: new Date().toISOString()
  })
  .eq('id', recordId)
  .select()
  .single()
```

### Deleting Data

```javascript
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', recordId)
```

## Real-time Subscriptions

```javascript
// Subscribe to changes
const subscription = supabase
  .channel('attendance-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'attendance'
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// Unsubscribe
supabase.removeChannel(subscription)
```

## Error Handling

```javascript
try {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
  
  if (error) throw error
  
  // Use data
} catch (error) {
  console.error('Error:', error.message)
}
```

## Common Queries

### Get User's Attendance for Today

```javascript
const today = new Date().toISOString().split('T')[0]
const { data } = await supabase
  .from('attendance')
  .select('*')
  .eq('student_id', userId)
  .eq('attendance_date', today)
  .single()
```

### Get Teacher's Subjects

```javascript
const { data } = await supabase
  .from('subjects')
  .select('*')
  .eq('teacher_id', teacherId)
```

### Get Students Enrolled in Subject

```javascript
const { data } = await supabase
  .from('student_subjects')
  .select('student_id(*)')
  .eq('subject_id', subjectId)
```

### Get Attendance Statistics

```javascript
const { data } = await supabase
  .from('attendance')
  .select('is_marked')
  .eq('student_id', userId)
  .gte('attendance_date', startDate)
  .lte('attendance_date', endDate)
```

## Rate Limiting

Supabase has built-in rate limiting:
- Free tier: Generous limits
- Pro tier: 10,000 requests/minute

Handle rate limit errors:
```javascript
if (error?.status === 429) {
  // Too many requests, retry after delay
  setTimeout(retryFunction, 5000)
}
```

## Batch Operations

```javascript
// Update multiple records
const { error } = await supabase
  .from('attendance')
  .update({ is_marked: false })
  .in('student_id', [userId1, userId2, userId3])
```

## File Storage

```javascript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload('path/to/file', file)

// Download file
const { data, error } = await supabase.storage
  .from('bucket-name')
  .download('path/to/file')

// Get public URL
const { data } = supabase.storage
  .from('bucket-name')
  .getPublicUrl('path/to/file')
```

## Debugging

```javascript
// Enable request logging
const supabase = createClient(url, key, {
  auth: { debug: true },
  realtime: { log: 'debug' }
})

// Check current session
const { data: { session } } = await supabase.auth.getSession()
```

## Performance Tips

1. Use select to get specific columns
2. Add limit() to large queries
3. Use indexes for frequent queries
4. Cache results when possible
5. Use realtime subscriptions for live data

## Security

- Never expose API key in frontend
- Use Row Level Security (RLS) policies
- Validate data before insertion
- Sanitize user inputs
- Use HTTPS for all requests

## Resources

- [Supabase JS Client](https://supabase.com/docs/reference/javascript)
- [Supabase REST API](https://supabase.com/docs/reference/api)
- [Database Functions](https://supabase.com/docs/guides/database/functions)

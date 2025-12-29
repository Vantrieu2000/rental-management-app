# Reminder System

The Reminder System provides automated notification scheduling for payment reminders in the Rental Management Application.

## Features

### 1. Due Date Reminders (Requirement 14.1)
- Automatically schedules reminders 3 days before payment due dates
- Validates that reminders are not scheduled for past dates
- Uses local notifications via Expo Notifications

### 2. Custom Reminder Intervals (Requirement 14.2)
- Allows property managers to set custom reminder intervals
- Supports any number of days before the due date
- Flexible configuration per payment

### 3. Reminder Logging (Requirement 14.3)
- Logs all sent reminders with timestamp and recipient information
- Tracks delivery status
- Maintains complete audit trail

### 4. Recurring Reminders (Requirement 14.4)
- Schedules recurring reminders for late payers
- Configurable interval (e.g., every 7 days)
- Continues until payment is made

## Architecture

### Services

#### `reminderScheduler.ts`
Core service for scheduling and managing reminders:
- `scheduleDueDateReminder()` - Schedule 3-day advance reminder
- `scheduleCustomReminder()` - Schedule with custom interval
- `scheduleRecurringReminder()` - Schedule recurring reminders
- `logReminder()` - Log sent reminders
- `shouldFireReminder()` - Check if reminder should fire
- `requestPermissions()` - Request notification permissions

#### `reminderApi.ts`
API client for reminder management:
- CRUD operations for reminders
- Reminder log management
- Filtering and querying

#### `mockReminderApi.ts`
Mock implementation for development and testing

### Hooks

#### `useReminders.ts`
React Query hooks for reminder management:
- `useReminders()` - Fetch all reminders
- `useReminder()` - Fetch single reminder
- `useReminderLogs()` - Fetch reminder logs
- `useScheduleDueDateReminder()` - Schedule due date reminder
- `useScheduleCustomReminder()` - Schedule custom reminder
- `useScheduleRecurringReminder()` - Schedule recurring reminder
- `useDeleteReminder()` - Delete reminder
- `useLogReminder()` - Log reminder

## Usage

### Scheduling a Due Date Reminder

```typescript
import { useScheduleDueDateReminder } from '@features/reminders/hooks/useReminders';

const { mutate: scheduleReminder } = useScheduleDueDateReminder(accessToken);

// Schedule reminder for a payment
scheduleReminder(payment);
```

### Scheduling a Custom Reminder

```typescript
import { useScheduleCustomReminder } from '@features/reminders/hooks/useReminders';

const { mutate: scheduleCustom } = useScheduleCustomReminder(accessToken);

// Schedule reminder 5 days before due date
scheduleCustom({ payment, daysBefore: 5 });
```

### Scheduling a Recurring Reminder

```typescript
import { useScheduleRecurringReminder } from '@features/reminders/hooks/useReminders';

const { mutate: scheduleRecurring } = useScheduleRecurringReminder(accessToken);

// Schedule reminder every 7 days
scheduleRecurring({ payment, intervalDays: 7 });
```

### Logging a Reminder

```typescript
import { useLogReminder } from '@features/reminders/hooks/useReminders';

const { mutate: logReminder } = useLogReminder(accessToken);

// Log that a reminder was sent
logReminder({
  reminder,
  recipientId: 'user-123',
  notificationId: 'notif-456',
});
```

## Testing

The reminder system includes comprehensive property-based tests:

### Property 48: Reminders fire at correct time
Validates that reminders are scheduled exactly 3 days before due dates.

### Property 49: Custom reminder intervals work
Validates that custom intervals are applied correctly.

### Property 50: Reminders are logged
Validates that all reminders are logged with complete information.

### Property 51: Recurring reminders repeat correctly
Validates that recurring reminders maintain their interval configuration.

Run tests:
```bash
npm test -- reminders.pbt.test.ts
```

## Notification Permissions

The app requests notification permissions on first use. Users must grant permission to receive reminders.

```typescript
import { reminderScheduler } from '@features/reminders/services/reminderScheduler';

// Request permissions
const granted = await reminderScheduler.requestPermissions();
```

## Integration with Payments

Reminders are automatically created when:
1. A new payment record is created (due date reminder)
2. A payment becomes overdue (recurring reminders)
3. Property manager manually schedules custom reminders

## Future Enhancements

- Push notifications for mobile devices
- Email reminders
- SMS reminders
- Reminder templates
- Bulk reminder scheduling
- Reminder analytics and reporting

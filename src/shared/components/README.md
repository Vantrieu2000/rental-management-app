# Shared UI Components

This directory contains reusable UI components that follow Material Design 3 principles using React Native Paper.

## Components

### Typography

Text components with predefined styles for consistent typography across the app.

**Variants:**
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Heading styles
- `body1`, `body2` - Body text styles
- `caption` - Small text
- `overline` - Uppercase small text

**Props:**
- `variant` - Typography variant
- `color` - Text color (primary, secondary, error, success, warning, info, textPrimary, textSecondary)
- `align` - Text alignment (left, center, right, justify)
- `weight` - Font weight

**Example:**
```tsx
import { Typography, Heading1, Body1 } from '@shared/components';

<Typography variant="h1" color="primary">Title</Typography>
<Heading1 color="primary">Title</Heading1>
<Body1>Regular text</Body1>
```

### Button

Customizable button component with different variants and sizes.

**Props:**
- `variant` - Button style (contained, outlined, text)
- `size` - Button size (small, medium, large)
- `fullWidth` - Make button full width

**Example:**
```tsx
import { Button } from '@shared/components';

<Button variant="contained" size="large" onPress={handlePress}>
  Click Me
</Button>
```

### Card

Container component for grouping related content.

**Props:**
- `elevation` - Shadow elevation (0-5)
- `padding` - Internal padding
- `variant` - Card style (elevated, outlined, filled)

**Sub-components:**
- `CardTitle` - Card header with title and subtitle
- `CardContent` - Card body content
- `CardCover` - Card image cover
- `CardActions` - Card action buttons

**Example:**
```tsx
import { Card, CardContent, CardActions, Button } from '@shared/components';

<Card variant="elevated" padding={16}>
  <CardContent>
    <Typography>Card content</Typography>
  </CardContent>
  <CardActions>
    <Button>Action</Button>
  </CardActions>
</Card>
```

### Input

Text input field with validation support.

**Props:**
- `variant` - Input style (outlined, flat)
- `helperText` - Helper text below input
- `errorText` - Error message
- `fullWidth` - Make input full width

**Example:**
```tsx
import { Input } from '@shared/components';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  errorText={errors.email}
  placeholder="Enter your email"
/>
```

### Badge

Small status indicator or label.

**Props:**
- `variant` - Badge color (default, primary, secondary, success, error, warning, info)
- `size` - Badge size (small, medium, large)

**Example:**
```tsx
import { Badge } from '@shared/components';

<Badge variant="success" size="medium">Active</Badge>
<Badge variant="error">Overdue</Badge>
```

### Avatar

User avatar component supporting images, icons, and text.

**Props:**
- `source` - Image source (URI or local)
- `label` - Text to display (initials)
- `icon` - Icon name
- `size` - Avatar size in pixels
- `color` - Icon/text color
- `backgroundColor` - Background color

**Example:**
```tsx
import { Avatar } from '@shared/components';

<Avatar source={{ uri: 'https://...' }} size={48} />
<Avatar label="JD" size={40} />
<Avatar icon="account" size={36} />
```

### Loading

Loading indicator with optional message.

**Props:**
- `size` - Spinner size (small, large, or number)
- `message` - Loading message
- `fullScreen` - Cover entire screen

**Example:**
```tsx
import { Loading, Skeleton } from '@shared/components';

<Loading message="Loading data..." />
<Loading fullScreen />

// Skeleton loader for content placeholders
<Skeleton width="100%" height={20} />
<Skeleton width={100} height={100} borderRadius={50} />
```

### ErrorState

Error display component with retry action.

**Props:**
- `title` - Error title
- `message` - Error message
- `onRetry` - Retry callback
- `retryLabel` - Retry button text
- `fullScreen` - Cover entire screen
- `icon` - Custom icon element

**Example:**
```tsx
import { ErrorState } from '@shared/components';

<ErrorState
  title="Failed to load"
  message="Unable to fetch data"
  onRetry={handleRetry}
  retryLabel="Try Again"
/>
```

### EmptyState

Empty state display for lists with no data.

**Props:**
- `title` - Empty state title
- `message` - Empty state message
- `icon` - Custom icon element
- `actionLabel` - Action button text
- `onAction` - Action callback
- `fullScreen` - Cover entire screen

**Example:**
```tsx
import { EmptyState } from '@shared/components';

<EmptyState
  title="No rooms found"
  message="Add your first room to get started"
  actionLabel="Add Room"
  onAction={handleAddRoom}
/>
```

### SearchBar

Search input component.

**Props:**
- `value` - Search value
- `onChangeText` - Change handler
- `placeholder` - Placeholder text
- `fullWidth` - Make search bar full width

**Example:**
```tsx
import { SearchBar } from '@shared/components';

<SearchBar
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search rooms..."
/>
```

### FilterChip

Chip component for filters.

**Props:**
- `selected` - Whether chip is selected
- `onPress` - Press handler

**Example:**
```tsx
import { FilterChip, FilterChipGroup } from '@shared/components';

<FilterChipGroup>
  <FilterChip selected={filter === 'all'} onPress={() => setFilter('all')}>
    All
  </FilterChip>
  <FilterChip selected={filter === 'paid'} onPress={() => setFilter('paid')}>
    Paid
  </FilterChip>
</FilterChipGroup>
```

## Theme

The app uses a custom Material Design 3 theme with the following colors:

**Light Theme:**
- Primary: #2563EB (Blue)
- Secondary: #7C3AED (Purple)
- Tertiary: #059669 (Green)
- Error: #DC2626 (Red)
- Success: #16A34A (Green)
- Warning: #F59E0B (Amber)
- Info: #0EA5E9 (Sky Blue)

**Dark Theme:**
- Adjusted colors for better contrast in dark mode

Import and use the theme:
```tsx
import { lightTheme, darkTheme } from '@shared/config/theme';
import { PaperProvider } from 'react-native-paper';

<PaperProvider theme={lightTheme}>
  {/* Your app */}
</PaperProvider>
```

## Best Practices

1. **Consistency**: Use these components throughout the app for consistent UI
2. **Accessibility**: Components follow accessibility best practices
3. **Theming**: Components automatically adapt to the app theme
4. **Responsive**: Components work across different screen sizes
5. **Type Safety**: All components are fully typed with TypeScript

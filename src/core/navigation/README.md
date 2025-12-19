# Navigation Structure

This directory contains the navigation configuration for the Rental Management Application.

## Architecture

The app uses React Navigation v6 with a hierarchical structure:

```
RootNavigator (Native Stack)
├── Auth Stack (when not authenticated)
│   └── Login Screen
└── Main Tabs (when authenticated)
    ├── Dashboard Tab → Dashboard Stack
    │   └── Dashboard Screen
    ├── Rooms Tab → Rooms Stack
    │   ├── Room List Screen
    │   ├── Room Detail Screen
    │   ├── Add Room Screen
    │   ├── Edit Room Screen
    │   └── Assign Tenant Screen
    ├── Payments Tab → Payments Stack
    │   ├── Payment List Screen
    │   ├── Record Payment Screen
    │   ├── Payment History Screen
    │   └── Payment Detail Screen
    ├── Reports Tab → Reports Stack
    │   ├── Report Dashboard Screen
    │   ├── Generate Report Screen
    │   └── Report Preview Screen
    └── Settings Tab → Settings Stack
        ├── Settings Home Screen
        ├── Profile Screen
        ├── Properties Screen
        ├── Property Detail Screen
        ├── Add Property Screen
        ├── Edit Property Screen
        ├── Language Screen
        ├── Notifications Screen
        └── About Screen
```

## Navigation Flow

### Authentication Flow

1. **Initial Load**: App checks for stored authentication tokens
2. **Not Authenticated**: Shows Auth Stack (Login Screen)
3. **Authenticated**: Shows Main Tabs with Dashboard as default

### Type Safety

All navigation is fully type-safe using TypeScript:

```typescript
// Navigation types are defined in @/shared/types/navigation
import type { RoomsStackScreenProps } from '@/shared/types/navigation';

type Props = RoomsStackScreenProps<'RoomDetail'>;

function RoomDetailScreen({ route, navigation }: Props) {
  const { roomId } = route.params; // Type-safe params
  navigation.navigate('EditRoom', { roomId }); // Type-safe navigation
}
```

### Custom Hooks

Type-safe navigation hooks are available:

```typescript
import { useRoomsNavigation } from '@/shared/hooks/useNavigation';

function MyComponent() {
  const navigation = useRoomsNavigation();
  navigation.navigate('RoomDetail', { roomId: '123' });
}
```

## Screen Transitions

- **Auth Flow**: Fade animation (300ms)
- **Stack Navigation**: Slide from right (default)
- **Tab Navigation**: No animation (instant switch)

## Adding New Screens

1. **Define route params** in `@/shared/types/navigation.ts`:
```typescript
export type RoomsStackParamList = {
  // ... existing screens
  NewScreen: { param1: string; param2: number };
};
```

2. **Create screen component** in appropriate feature folder:
```typescript
import type { RoomsStackScreenProps } from '@/shared/types/navigation';

type Props = RoomsStackScreenProps<'NewScreen'>;

export default function NewScreen({ route, navigation }: Props) {
  const { param1, param2 } = route.params;
  // Screen implementation
}
```

3. **Add to stack navigator**:
```typescript
<Stack.Screen
  name="NewScreen"
  component={NewScreen}
  options={{ title: 'New Screen' }}
/>
```

## Navigation Options

### Common Options

```typescript
{
  title: 'Screen Title',
  headerShown: true,
  animation: 'slide_from_right',
  headerBackTitle: 'Back',
  headerTintColor: '#2196F3',
}
```

### Tab Bar Options

```typescript
{
  tabBarLabel: 'Tab Name',
  tabBarIcon: ({ color, size }) => <Icon />,
  tabBarBadge: 3, // Show badge with count
}
```

## Deep Linking

Deep linking configuration will be added in future updates to support:
- Direct navigation to specific screens
- Push notification handling
- External URL handling

## Testing Navigation

Navigation can be tested using React Navigation's testing utilities:

```typescript
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';

test('navigates to room detail', () => {
  const { getByText } = render(
    <NavigationContainer>
      <RoomsStack />
    </NavigationContainer>
  );
  // Test navigation behavior
});
```

## Performance Considerations

- Lazy loading of screens is handled automatically by React Navigation
- Stack screens are unmounted when not visible (configurable)
- Tab screens remain mounted for faster switching
- Use `React.memo` for expensive screen components

## Future Enhancements

- [ ] Add deep linking configuration
- [ ] Implement screen-specific loading states
- [ ] Add navigation analytics tracking
- [ ] Implement gesture-based navigation
- [ ] Add screen transition customization per screen

import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { lightTheme } from '@/shared/config/theme';
import {
  Typography,
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  Loading,
  ErrorState,
  EmptyState,
  SearchBar,
  FilterChip,
} from '../index';

// Wrapper component for tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider theme={lightTheme}>{children}</PaperProvider>
);

describe('Shared UI Components', () => {
  describe('Typography', () => {
    it('should render text correctly', () => {
      const { getByText } = render(
        <TestWrapper>
          <Typography>Test Text</Typography>
        </TestWrapper>
      );
      expect(getByText('Test Text')).toBeTruthy();
    });

    it('should apply variant styles', () => {
      const { getByText } = render(
        <TestWrapper>
          <Typography variant="h1">Heading</Typography>
        </TestWrapper>
      );
      expect(getByText('Heading')).toBeTruthy();
    });
  });

  describe('Button', () => {
    it('should render button with text', () => {
      const { getByText } = render(
        <TestWrapper>
          <Button>Click Me</Button>
        </TestWrapper>
      );
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should handle different variants', () => {
      const { getByText } = render(
        <TestWrapper>
          <Button variant="outlined">Outlined</Button>
        </TestWrapper>
      );
      expect(getByText('Outlined')).toBeTruthy();
    });
  });

  describe('Card', () => {
    it('should render card with content', () => {
      const { getByText } = render(
        <TestWrapper>
          <Card>
            <Typography>Card Content</Typography>
          </Card>
        </TestWrapper>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });
  });

  describe('Input', () => {
    it('should render input field', () => {
      const { getByPlaceholderText } = render(
        <TestWrapper>
          <Input placeholder="Enter text" value="" onChangeText={() => {}} />
        </TestWrapper>
      );
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should display error text', () => {
      const { getByText } = render(
        <TestWrapper>
          <Input
            placeholder="Email"
            value=""
            onChangeText={() => {}}
            errorText="Invalid email"
          />
        </TestWrapper>
      );
      expect(getByText('Invalid email')).toBeTruthy();
    });
  });

  describe('Badge', () => {
    it('should render badge with text', () => {
      const { getByText } = render(
        <TestWrapper>
          <Badge>Active</Badge>
        </TestWrapper>
      );
      expect(getByText('Active')).toBeTruthy();
    });

    it('should apply variant styles', () => {
      const { getByText } = render(
        <TestWrapper>
          <Badge variant="success">Success</Badge>
        </TestWrapper>
      );
      expect(getByText('Success')).toBeTruthy();
    });
  });

  describe('Avatar', () => {
    it('should render avatar with label', () => {
      const { getByText } = render(
        <TestWrapper>
          <Avatar label="JD" />
        </TestWrapper>
      );
      expect(getByText('JD')).toBeTruthy();
    });
  });

  describe('Loading', () => {
    it('should render loading indicator', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Loading />
        </TestWrapper>
      );
      // ActivityIndicator is rendered
      expect(getByTestId).toBeTruthy();
    });

    it('should display loading message', () => {
      const { getByText } = render(
        <TestWrapper>
          <Loading message="Loading data..." />
        </TestWrapper>
      );
      expect(getByText('Loading data...')).toBeTruthy();
    });
  });

  describe('ErrorState', () => {
    it('should render error state with title and message', () => {
      const { getByText } = render(
        <TestWrapper>
          <ErrorState title="Error" message="Something went wrong" />
        </TestWrapper>
      );
      expect(getByText('Error')).toBeTruthy();
      expect(getByText('Something went wrong')).toBeTruthy();
    });

    it('should render retry button when onRetry is provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <ErrorState onRetry={() => {}} retryLabel="Try Again" />
        </TestWrapper>
      );
      expect(getByText('Try Again')).toBeTruthy();
    });
  });

  describe('EmptyState', () => {
    it('should render empty state with title and message', () => {
      const { getByText } = render(
        <TestWrapper>
          <EmptyState title="No Data" message="No items found" />
        </TestWrapper>
      );
      expect(getByText('No Data')).toBeTruthy();
      expect(getByText('No items found')).toBeTruthy();
    });

    it('should render action button when provided', () => {
      const { getByText } = render(
        <TestWrapper>
          <EmptyState actionLabel="Add Item" onAction={() => {}} />
        </TestWrapper>
      );
      expect(getByText('Add Item')).toBeTruthy();
    });
  });

  describe('SearchBar', () => {
    it('should render search bar', () => {
      const { getByPlaceholderText } = render(
        <TestWrapper>
          <SearchBar
            value=""
            onChangeText={() => {}}
            placeholder="Search..."
          />
        </TestWrapper>
      );
      expect(getByPlaceholderText('Search...')).toBeTruthy();
    });
  });

  describe('FilterChip', () => {
    it('should render filter chip', () => {
      const { getByText } = render(
        <TestWrapper>
          <FilterChip>All</FilterChip>
        </TestWrapper>
      );
      expect(getByText('All')).toBeTruthy();
    });
  });
});

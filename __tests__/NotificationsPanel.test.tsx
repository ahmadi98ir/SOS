import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NotificationsPanel } from '../src/components/NotificationsPanel';

// Mock useSocket to disable real websocket
jest.mock('../src/hooks/useSocket', () => ({
  useSocket: () => ({ message: undefined })
}));

describe('NotificationsPanel', () => {
  const mockNotifications = [
    { id: '1', message: 'اعلان شماره یک', type: 'info', read: false, userId: 'u1', createdAt: new Date() },
    { id: '2', message: 'اعلان شماره دو', type: 'success', read: true, userId: 'u1', createdAt: new Date() },
  ];

  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockImplementation((url, opts) => {
      if (url?.toString().includes('/api/notifications')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ notifications: mockNotifications })
        }) as any;
      }
      if (url?.toString().includes('/api/delete-notification')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'اعلان حذف شد.' })
        }) as any;
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) }) as any;
    });
    // Mock userId from localStorage
    jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation((key) => key === 'userId' ? 'u1' : null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders notifications and unread badge', async () => {
    render(<NotificationsPanel />);
    expect(screen.getByText('اعلان‌ها')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('اعلان شماره یک')).toBeInTheDocument();
      expect(screen.getByText('اعلان شماره دو')).toBeInTheDocument();
    });
    // Badge should show 1 unread
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('can filter unread notifications', async () => {
    render(<NotificationsPanel />);
    await waitFor(() => screen.getByText('اعلان شماره یک'));
    const filterBtn = screen.getByText('فقط خوانده‌نشده‌ها');
    fireEvent.click(filterBtn);
    expect(screen.queryByText('اعلان شماره دو')).not.toBeInTheDocument();
    expect(screen.getByText('اعلان شماره یک')).toBeInTheDocument();
    // Switch back
    fireEvent.click(screen.getByText('نمایش همه'));
    expect(screen.getByText('اعلان شماره دو')).toBeInTheDocument();
  });

  it('can delete a notification after confirm', async () => {
    render(<NotificationsPanel />);
    await waitFor(() => screen.getByText('اعلان شماره یک'));
    // Confirm window
    window.confirm = jest.fn(() => true);
    const deleteBtns = screen.getAllByText('حذف');
    fireEvent.click(deleteBtns[0]);
    await waitFor(() => {
      expect(screen.queryByText('اعلان شماره یک')).not.toBeInTheDocument();
    });
  });
});

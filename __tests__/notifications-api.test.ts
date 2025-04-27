import { createMocks } from 'node-mocks-http';
import handler from '../src/pages/api/notifications';
import deleteHandler from '../src/pages/api/delete-notification';

// Mock prisma for isolated testing
globalThis.prisma = {
  notification: {
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
};

describe('Notifications API', () => {
  it('should return 400 if userId is missing (GET)', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should return notifications for a user (GET)', async () => {
    globalThis.prisma.notification.findMany.mockResolvedValueOnce([
      { id: '1', message: 'msg', type: 'info', read: false, userId: 'u1', createdAt: new Date() },
    ]);
    const { req, res } = createMocks({
      method: 'GET',
      query: { userId: 'u1' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).notifications.length).toBe(1);
  });

  it('should mark notification as read (POST)', async () => {
    globalThis.prisma.notification.update.mockResolvedValueOnce({});
    const { req, res } = createMocks({
      method: 'POST',
      body: { userId: 'u1', notificationId: 'n1' },
    });
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});

describe('Delete Notification API', () => {
  it('should return 400 if missing params', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {},
    });
    await deleteHandler(req, res);
    expect(res._getStatusCode()).toBe(400);
  });

  it('should not delete if not found or not owner', async () => {
    globalThis.prisma.notification.findUnique.mockResolvedValueOnce(null);
    const { req, res } = createMocks({
      method: 'POST',
      body: { notificationId: 'n1', userId: 'u1' },
    });
    await deleteHandler(req, res);
    expect(res._getStatusCode()).toBe(404);
  });

  it('should delete notification', async () => {
    globalThis.prisma.notification.findUnique.mockResolvedValueOnce({ id: 'n1', userId: 'u1' });
    globalThis.prisma.notification.delete.mockResolvedValueOnce({});
    const { req, res } = createMocks({
      method: 'POST',
      body: { notificationId: 'n1', userId: 'u1' },
    });
    await deleteHandler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});

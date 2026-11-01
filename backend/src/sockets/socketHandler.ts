import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import { verifyToken } from '../utils/jwt';
import { config } from '../config';

let ioInstance: SocketIOServer | null = null;

export const initSocketIO = (httpServer: HttpServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [config.cors.frontendUrl, config.cors.adminUrl, 'http://localhost:5173', 'http://localhost:5174'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (token && typeof token === 'string') {
      try {
        const decoded = verifyToken(token);
        (socket as any).user = decoded;
      } catch {
        // Allow connection even without token for guest order tracking / live stock updates
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`🔌 Client connected [${socket.id}]${user ? ` User: ${user.email} (${user.role})` : ' (Guest)'}`);

    // Join user-specific room
    if (user && user.id) {
      socket.join(`user:${user.id}`);
    }

    // Join admin room if admin
    if (user && (user.role === 'admin' || user.role === 'superadmin')) {
      socket.join('admin_room');
      console.log(`👑 Admin ${user.email} joined admin_room`);
    }

    // Join order tracking room
    socket.on('join_order_room', (orderId: string) => {
      if (orderId) {
        socket.join(`order:${orderId}`);
        console.log(`📦 Socket ${socket.id} joined tracking room: order:${orderId}`);
      }
    });

    socket.on('leave_order_room', (orderId: string) => {
      if (orderId) {
        socket.leave(`order:${orderId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected [${socket.id}]`);
    });
  });

  ioInstance = io;
  return io;
};

export const getIO = (): SocketIOServer => {
  if (!ioInstance) {
    throw new Error('Socket.IO is not initialized yet');
  }
  return ioInstance;
};

export const emitToOrder = (orderId: string, event: string, data: unknown): void => {
  if (ioInstance) {
    ioInstance.to(`order:${orderId}`).emit(event, data);
  }
};

export const emitToUser = (userId: string, event: string, data: unknown): void => {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
};

export const emitToAdmin = (event: string, data: unknown): void => {
  if (ioInstance) {
    ioInstance.to('admin_room').emit(event, data);
  }
};

export const emitStockUpdate = (productId: string): void => {
  if (ioInstance) {
    ioInstance.emit('stock_updated', { productId, timestamp: new Date() });
  }
};

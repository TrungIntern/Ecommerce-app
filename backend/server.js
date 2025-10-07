// backend/server.js    //fastify server
import Fastify from 'fastify';
import cors from '@fastify/cors'; // CORS được sử dung để cho phép các domain khác nhau truy cập API
import { PrismaClient } from '@prisma/client';

const fastify = Fastify({ logger: true });
const prisma = new PrismaClient();

await fastify.register(cors, { origin: true }); // dev: cho phép tất cả


/* Authentication */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// secret cho JWT
const JWT_SECRET = "supersecret"; 

// Chức năng đăng kí

// POST /auth/signup
fastify.post('/auth/signup', async (req, reply) => {
  const { email, password, name } = req.body;

  // check trùng email
  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) {
    return reply.code(400).send({ error: 'Email đã tồn tại' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name }
  });

  return { id: user.id, email: user.email, name: user.name };
});

// start server
fastify.listen({ port: 4000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});

// Chức năng đăng nhập

// POST /auth/login
fastify.post('/auth/login', async (req, reply) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return reply.code(400).send({ error: 'Sai email hoặc mật khẩu' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return reply.code(400).send({ error: 'Sai email hoặc mật khẩu' });

  // sinh JWT
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

  return { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
});

// Middleware kiểm tra JWT

// helper auth
// async function authGuard(req, reply) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) throw new Error("No token");

//     const token = authHeader.split(" ")[1];
//     const payload = jwt.verify(token, JWT_SECRET);
//     req.user = payload; // gắn vào request
//   } catch (err) {
//     reply.code(401).send({ error: 'Unauthorized' });
//   }
// }

// Middleware kiểm tra JWT cho xác thực
async function authGuard(req, reply) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({ error: "No token" });
    }

    const token = authHeader.split(" ")[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // payload sẽ có { userId, role }
    req.user = {
      userId: payload.userId,
      role: payload.role || "USER"  // mặc định USER nếu không có
    };
  } catch (err) {
    return reply.code(401).send({ error: "Unauthorized" });
  }
}

// Middleware cho Admin
async function adminGuard(req, reply) {
  if (!req.user || req.user.role !== "ADMIN") {
    return reply.code(403).send({ error: "Forbidden - Admin only" });
  }
}

/* Product */

// List sản phẩm
// GET /products
fastify.get('/products', async () => {
  return prisma.product.findMany();
});

//Chi tiết sản phẩm
// GET /products/:id
fastify.get('/products/:id', async (req, reply) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return reply.code(404).send({ error: 'Not found' });
  return product;
});

/* Cart */
//Lấy giỏ hàng 
// GET /cart
fastify.get('/cart', { preHandler: authGuard }, async (req) => {
  const userId = req.user.userId;
  return prisma.cart.findMany({
    where: { userId },
    include: { product: true }
  });
});

//Thêm vào giỏ hàng
// POST /cart
fastify.post('/cart', { preHandler: authGuard }, async (req) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  return prisma.cart.upsert({
    where: {
      userId_productId: { userId, productId }
    },
    update: { quantity: { increment: quantity || 1 } },
    create: { userId, productId, quantity: quantity || 1 }
  });
});

//Xoá khỏi giỏ hàng
// DELETE /cart/:id
fastify.delete('/cart/:id', { preHandler: authGuard }, async (req) => {
  const { id } = req.params;
  return prisma.cart.delete({ where: { id } });
});

/* Order */
// Tạo đơn hàng
// POST /orders
fastify.post('/orders', { preHandler: authGuard }, async (req) => {
  const userId = req.user.userId;

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: { product: true }
  });

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      items: cartItems.map(c => ({
        productId: c.productId,
        title: c.product.title,
        quantity: c.quantity,
        price: c.product.price
      })),
      total
    }
  });

  // clear cart sau khi đặt hàng vì cart chỉ mang tính tạm thời
  await prisma.cart.deleteMany({ where: { userId } });

  return order;
});

// Xem danh sách đơn hàng (user)
// GET /orders
fastify.get('/orders', { preHandler: authGuard }, async (req) => {
  const userId = req.user.userId;
  return prisma.order.findMany({ where: { userId } });
});

/* Favorites */

// Lấy danh sách yêu thích
// GET /favorites

fastify.get('/favorites', { preHandler: authGuard }, async (req) => {
  const userId = req.user.userId;
  return prisma.favorite.findMany({
    where: { userId },
    include: { product: true }
  });
});

// Thêm vào yêu thích
// POST /favorites
fastify.post('/favorites', { preHandler: authGuard }, async (req) => {
  const userId = req.user.userId;
  const { productId } = req.body;

  return prisma.favorite.create({ data: { userId, productId } });
});

// Xoá khỏi yêu thích
// DELETE /favorites/:id
fastify.delete('/favorites/:id', { preHandler: authGuard }, async (req) => {
  const { id } = req.params;
  return prisma.favorite.delete({ where: { id } });
});


// /* ADMIN CRUD Product */

// // Tạo sản phẩm
// fastify.post('/admin/products', async (req) => {
//   const { title, description, price, imageUrl } = req.body;
//   return prisma.product.create({ data: { title, description, price, imageUrl } });
// });

// // Cập nhật sản phẩm
// fastify.put('/admin/products/:id', async (req) => {
//   const { id } = req.params;
//   const { title, description, price, imageUrl } = req.body;
//   return prisma.product.update({ where: { id }, data: { title, description, price, imageUrl } });
// });

// // Xóa sản phẩm
// fastify.delete('/admin/products/:id', async (req) => {
//   const { id } = req.params;
//   return prisma.product.delete({ where: { id } });
// });

// // Xem danh sách dơn hàng (admin)
// fastify.get('/admin/orders', { preHandler: [authGuard, adminGuard] }, async () => {
//   return prisma.order.findMany({
//     include: { user: true }
//   });
// });


/* GIAI ĐOẠN VIẾT MIDDLEWARE CHO CÁC ROUTE ADMIN BẰNG CÁCH GOM NHÓM */
fastify.register(async (instance) => {
  instance.addHook("preHandler", authGuard);
  instance.addHook("preHandler", adminGuard);

  instance.post('/products', async (req) => {
    const { title, description, price, imageUrl } = req.body;
    return prisma.product.create({ data: { title, description, price, imageUrl } });
  });

  instance.put('/products/:id', async (req) => {
    const { id } = req.params;
    const { title, description, price, imageUrl } = req.body;
    return prisma.product.update({ where: { id }, data: { title, description, price, imageUrl } });
  });

  instance.delete('/products/:id', async (req) => {
    const { id } = req.params;
    return prisma.product.delete({ where: { id } });
  });

  instance.get('/orders', async () => {
    return prisma.order.findMany({ include: { user: true } });
  });

}, { prefix: '/admin' });
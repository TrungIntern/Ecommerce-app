<script lang="ts">
  import { onMount } from 'svelte';

  type Product = {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
  };

  type CartItem = {
    id: string;
    productId: string;
    quantity: number;
  };

  let products: Product[] = [];
  let cartItems: CartItem[] = [];
  let cartCount = 0;
  let error = '';
  let message = '';

  // ✅ Lấy danh sách sản phẩm + giỏ hàng
  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const [productsRes, cartRes] = await Promise.all([
        fetch('http://localhost:4000/products', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:4000/cart', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!productsRes.ok || !cartRes.ok)
        throw new Error('Không thể tải dữ liệu');

      products = await productsRes.json();
      cartItems = await cartRes.json();

      // ✅ Cập nhật số loại sản phẩm trong giỏ hàng
      cartCount = cartItems.length;
    } catch (err) {
      console.error(err);
      error = 'Lỗi khi tải dữ liệu';
    }
  });

  // ✅ Hàm thêm vào giỏ hàng
  async function addToCart(productId: string) {
    message = '';
    error = '';

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('http://localhost:4000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();
      if (!res.ok) {
        error = data.error || 'Không thể thêm vào giỏ hàng';
        return;
      }

      // ✅ Nếu là sản phẩm mới thì tăng cartCount
      const exists = cartItems.find((i) => i.productId === productId);
      if (!exists) {
        cartItems.push(data);
        cartCount = cartItems.length;
      }

      message = 'Đã thêm sản phẩm vào giỏ hàng!';
    } catch (err) {
      console.error(err);
      error = 'Lỗi kết nối server';
    }
  }
</script>

<!-- ✅ Giao diện -->
<div class="p-6 relative">
  <!-- 🛒 Nút xem giỏ hàng + đơn hàng -->
  <div class="absolute top-4 right-6 flex gap-3">
    <a
      href="/cart"
      class="relative bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      🛒 Xem giỏ hàng
      {#if cartCount > 0}
        <span
          class="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5"
        >
          {cartCount}
        </span>
      {/if}
    </a>

    <!-- 📦 Nút xem đơn hàng -->
    <a
      href="/orders"
      class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
    >
      📦 Xem đơn hàng
    </a>
  </div>

  <h1 class="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>

  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}

  {#if message}
    <p class="text-green-600 mb-4">{message}</p>
  {/if}

  {#if products.length === 0}
    <p>Không có sản phẩm nào.</p>
  {:else}
    <div class="grid grid-cols-3 gap-4">
      {#each products as product}
        <div class="border rounded-lg p-4 shadow flex flex-col">
          <img
            src={product.imageUrl}
            alt={product.title}
            class="w-full h-40 object-cover mb-2 rounded"
          />
          <h2 class="font-semibold text-lg">{product.title}</h2>
          <p class="text-gray-600 text-sm mb-1 line-clamp-2">
            {product.description}
          </p>
          <p class="font-bold text-blue-600 mb-3">
            {product.price.toLocaleString('vi-VN')}₫
          </p>

          <button
            on:click={() => addToCart(product.id)}
            class="bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-auto"
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>


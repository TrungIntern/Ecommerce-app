<script lang="ts">
  import { onMount } from 'svelte';

  // ✅ Kiểu sản phẩm trong giỏ hàng
  type CartItem = {
    id: string;
    quantity: number;
    product: {
      id: string;
      title: string;
      price: number;
      imageUrl?: string;
    };
  };

  let cart: CartItem[] = [];
  let error = '';
  let message = '';

  // ✅ Tải giỏ hàng khi mở trang
  onMount(async () => {
    await loadCart();
  });

  async function loadCart() {
    error = '';
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('http://localhost:4000/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Không thể tải giỏ hàng');
      cart = await res.json();
    } catch (err) {
      console.error(err);
      error = 'Lỗi khi tải giỏ hàng';
    }
  }

  // ✅ Hàm xóa sản phẩm khỏi giỏ hàng
  async function removeFromCart(itemId: string) {
    error = '';
    message = '';
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/cart/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        error = data.error || 'Không thể xóa sản phẩm khỏi giỏ hàng';
        return;
      }

      message = 'Đã xóa sản phẩm khỏi giỏ hàng';
      await loadCart(); // reload lại giỏ hàng sau khi xóa
    } catch (err) {
      console.error(err);
      error = 'Lỗi kết nối server';
    }
  }

// ✅ Hàm đặt hàng (checkout)
async function checkout() {
  error = '';
  message = '';

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const res = await fetch('http://localhost:4000/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}) // 👈 thêm body rỗng để tránh lỗi 400
    });

    const data = await res.json();

    if (!res.ok) {
      error = data.error || 'Không thể đặt hàng';
      return;
    }

    message = '🎉 Đặt hàng thành công!';
    cart = []; // clear giỏ hàng trên giao diện

    // ⏳ Chuyển hướng sau 2 giây
    setTimeout(() => {
      window.location.href = '/products';
    }, 2000);
  } catch (err) {
    console.error(err);
    error = 'Lỗi kết nối server khi đặt hàng';
  }
}

  // ✅ Tổng tiền
  $: total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
</script>

<!-- ✅ Giao diện -->
<div class="p-6">
  <h1 class="text-2xl font-bold mb-4">🛒 Giỏ hàng của bạn</h1>

  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}

  {#if message}
    <p class="text-green-600 mb-4 animate-pulse">{message}</p>
  {/if}

  {#if cart.length === 0}
    <p>Giỏ hàng trống.</p>
  {:else}
    <div class="space-y-4">
      {#each cart as item}
        <div class="flex items-center border rounded p-4 shadow">
          <img
            src={item.product.imageUrl}
            alt={item.product.title}
            class="w-20 h-20 object-cover rounded mr-4"
          />
          <div class="flex-1">
            <h2 class="font-semibold text-lg">{item.product.title}</h2>
            <p class="text-gray-600">
              Giá: {item.product.price.toLocaleString('vi-VN')}₫ × {item.quantity}
            </p>
          </div>

          <button
            class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            on:click={() => removeFromCart(item.id)}
          >
            Xóa
          </button>
        </div>
      {/each}
    </div>

    <div class="mt-6 text-right">
      <p class="text-xl font-bold mb-2">
        Tổng cộng: {total.toLocaleString('vi-VN')}₫
      </p>

      <button
        class="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        on:click={checkout}
      >
        ✅ Đặt hàng
      </button>
    </div>
  {/if}
</div>

<script lang="ts">
  import { onMount } from 'svelte';

  type OrderItem = {
    productId: string;
    title: string;
    quantity: number;
    price: number;
  };

  type Order = {
    id: string;
    total: number;
    createdAt: string;
    items: OrderItem[];
  };

  let orders: Order[] = [];
  let error = '';

  onMount(async () => {
    await loadOrders();
  });

  async function loadOrders() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const res = await fetch('http://localhost:4000/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Không thể tải danh sách đơn hàng');
      orders = await res.json();
    } catch (err) {
      console.error(err);
      error = 'Lỗi khi tải đơn hàng';
    }
  }

  // ✅ Tách ngày và giờ rõ ràng
  function formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    const date = d.toLocaleDateString('vi-VN');
    const time = d.toLocaleTimeString('vi-VN');
    return { date, time };
  }
</script>

<!-- ✅ Giao diện -->
<div class="p-6 bg-gray-50 min-h-screen">
  <h1 class="text-2xl font-bold mb-6">📦 Đơn hàng của bạn</h1>

  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}

  {#if orders.length === 0}
    <p>Chưa có đơn hàng nào.</p>
  {:else}
    <div class="space-y-6">
      {#each orders as order}
        <div class="border rounded-lg bg-white shadow-md p-5">
          <!-- 🧾 Thông tin chung -->
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3">
            <div>
              <p class="font-semibold text-gray-800">
                🧾 Mã đơn:
                <span class="font-mono text-blue-700 break-all">{order.id}</span>
              </p>
            </div>

            <!-- ✅ Tách ngày / giờ -->
            <div class="text-gray-600 text-sm mt-1 sm:mt-0">
              {#key order.createdAt}
                <p>📅 Ngày: {formatDateTime(order.createdAt).date}</p>
                <p>🕓 Giờ: {formatDateTime(order.createdAt).time}</p>
              {/key}
            </div>
          </div>

          <!-- 🛍️ Danh sách sản phẩm -->
          <table class="w-full border-t border-b border-gray-200 mt-2 text-sm">
            <thead class="bg-gray-100 text-gray-700">
              <tr>
                <th class="text-left py-2 px-2">Sản phẩm</th>
                <th class="text-center py-2 px-2 w-20">SL</th>
                <th class="text-right py-2 px-2 w-28">Đơn giá</th>
                <th class="text-right py-2 px-2 w-28">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {#each order.items as item}
                <tr class="border-t">
                  <td class="py-2 px-2">{item.title}</td>
                  <td class="py-2 px-2 text-center">{item.quantity}</td>
                  <td class="py-2 px-2 text-right">{item.price.toLocaleString('vi-VN')}₫</td>
                  <td class="py-2 px-2 text-right">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>

          <!-- 💰 Tổng tiền -->
          <div class="text-right mt-3 font-bold text-lg text-blue-700">
            Tổng cộng: {order.total.toLocaleString('vi-VN')}₫
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

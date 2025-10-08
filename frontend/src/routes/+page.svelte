<!-- <script lang="ts">
  import { onMount } from 'svelte';

  // định nghĩa kiểu Product tương ứng với schema
  interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    createdAt: string; // Prisma trả về DateTime dạng ISO string
    updatedAt: string;
  }

  let products: Product[] = [];

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:4000/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      products = await res.json();
    } catch (err) {
      console.error(err);
      products = [];
    }
  });
</script>

<h1>Products</h1>
{#if products.length === 0}
  <p>Chưa có sản phẩm</p>
{:else}
  <div class="grid grid-cols-3 gap-4">
    {#each products as p (p.id)}
      <div class="p-4 border rounded">
        <h2 class="text-lg font-bold">{p.title}</h2>
        <p>{p.description}</p>
        <p class="mt-2">
          Giá: {p.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </p>
      </div>
    {/each}
  </div>
{/if} -->



<!-- GIAI ĐOẠN TEST LUỒNG HIỂN THỊ TỪ BACKEND RA FRONTEND TRONG 1 FILE +page.svelte -->

<!-- Form đăng nhập và đăng ký tài khoản -->

<script lang="ts">
  import { onMount } from 'svelte';

  // let isLogin = true; // true = form đăng nhập, false = form đăng ký

  // // Biến cho cả 2 form
  // let email = '';
  // let password = '';
  // let name = ''; // chỉ dùng khi đăng ký
  // let error = '';
  // let success = '';

  // // Hàm chuyển form
  // function toggleForm() {
  //   isLogin = !isLogin;
  //   error = '';
  //   success = '';
  // }

  // // Xử lý đăng nhập
  // async function handleLogin() {
  //   error = '';
  //   success = '';

  //   try {
  //     const res = await fetch('http://localhost:4000/auth/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       error = data.error || 'Đăng nhập thất bại';
  //       return;
  //     }

  //     localStorage.setItem('token', data.token);
  //     success = 'Đăng nhập thành công!';
  //     console.log('User info:', data.user);
  //   } catch (err) {
  //     console.error(err);
  //     error = 'Lỗi kết nối server';
  //   }
  // }

  // // Xử lý đăng ký
  // async function handleSignup() {
  //   error = '';
  //   success = '';

  //   try {
  //     const res = await fetch('http://localhost:4000/auth/signup', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ email, password, name }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       error = data.error || 'Đăng ký thất bại';
  //       return;
  //     }

  //     success = 'Đăng ký thành công! Hãy đăng nhập để tiếp tục.';
  //     // Sau khi đăng ký thì chuyển sang form login
  //     isLogin = true;
  //   } catch (err) {
  //     console.error(err);
  //     error = 'Lỗi kết nối server';
  //   }
  // }

  // Biến và hàm cho phần hiển thị sản phẩm

  interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    createdAt: string;
  }

  let products: Product[] = [];
  let selectedProduct: Product | null = null;
  let loading = true;
  let error = '';

  // 🟢 Lấy danh sách sản phẩm khi mở trang
  onMount(async () => {
    try {
      const res = await fetch('http://localhost:4000/products');
      if (!res.ok) throw new Error('Không thể tải danh sách sản phẩm');
      products = await res.json();
    } catch (err) {
      error = (err as Error).message;
    } finally {
      loading = false;
    }
  });

  // 🟣 Lấy chi tiết sản phẩm khi nhấn vào
  async function viewDetail(id: string) {
    try {
      loading = true;
      const res = await fetch(`http://localhost:4000/products/${id}`);
      if (!res.ok) throw new Error('Không tìm thấy sản phẩm');
      selectedProduct = await res.json();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      loading = false;
    }
  }

  // 🔙 Quay lại danh sách
  function backToList() {
    selectedProduct = null;
  }

</script>

<!-- Giao diện -->
<!-- <div class="flex flex-col items-center mt-10">
  <h1 class="text-2xl font-bold mb-4">
    {isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản'}
  </h1>

  <form
    on:submit|preventDefault={isLogin ? handleLogin : handleSignup}
    class="flex flex-col gap-4 w-80 border p-4 rounded shadow"
  >
    {#if !isLogin}
      <label>
        Họ tên:
        <input
          class="border p-2 w-full"
          type="text"
          bind:value={name}
          placeholder="Nhập họ tên"
          required
        />
      </label>
    {/if}

    <label>
      Email:
      <input
        class="border p-2 w-full"
        type="email"
        bind:value={email}
        placeholder="Nhập email"
        required
      />
    </label>

    <label>
      Mật khẩu:
      <input
        class="border p-2 w-full"
        type="password"
        bind:value={password}
        placeholder="Nhập mật khẩu"
        required
      />
    </label>

    <button
      type="submit"
      class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
    >
      {isLogin ? 'Đăng nhập' : 'Đăng ký'}
    </button>

    {#if error}
      <p class="text-red-500 text-sm">{error}</p>
    {/if}

    {#if success}
      <p class="text-green-600 text-sm">{success}</p>
    {/if}

    <p class="text-sm text-gray-600 mt-2">
      {isLogin
        ? "Chưa có tài khoản?"
        : "Đã có tài khoản?"}
      <a href="#" class="text-blue-600" on:click|preventDefault={toggleForm}>
        {isLogin ? 'Đăng ký' : 'Đăng nhập'}
      </a>
    </p>
  </form>
</div> -->

<div class="min-h-screen flex flex-col items-center justify-center">
  <h1 class="text-3xl font-bold mb-4">Welcome</h1>
  <div class="space-x-4">
    <a href="/login/" class="bg-blue-500 text-white px-4 py-2 rounded">Đăng nhập</a>
    <a href="/signup" class="border px-4 py-2 rounded">Đăng ký</a>
  </div>
</div>



<!-- Hiển thị danh sách sản phẩm -->

<!-- Biến và hàm cho phần hiển thị sản phẩm được thêm vào script từ dòng 127 -->

<h1 class="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>

{#if loading}
  <p>Đang tải...</p>
{:else if error}
  <p class="text-red-500">{error}</p>
{:else if selectedProduct}
  <!-- 🟣 Chi tiết sản phẩm -->
  <div class="p-4 border rounded-lg shadow w-full md:w-2/3 mx-auto">
    <button on:click={backToList} class="text-blue-500 hover:underline mb-3">&larr; Quay lại</button>
    <img src={selectedProduct.imageUrl} alt={selectedProduct.title} class="w-full h-64 object-cover rounded" />
    <h2 class="text-xl font-bold mt-3">{selectedProduct.title}</h2>
    <p class="text-gray-700 mt-2">{selectedProduct.description}</p>
    <p class="mt-3 text-lg font-semibold text-green-600">
      {selectedProduct.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
    </p>
    <button class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Thêm vào giỏ
    </button>
  </div>
{:else}
  <!-- 🟢 Danh sách sản phẩm -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each products as p}
      <div
        class="border p-3 rounded-lg shadow hover:shadow-md transition cursor-pointer"
        on:click={() => viewDetail(p.id)}
      >
        <img src={p.imageUrl} alt={p.title} class="w-full h-40 object-cover rounded" />
        <h2 class="font-semibold mt-2">{p.title}</h2>
        <p class="text-gray-600 text-sm line-clamp-2">{p.description}</p>
        <p class="font-bold mt-1">
          {p.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </p>
      </div>
    {/each}
  </div>
{/if}


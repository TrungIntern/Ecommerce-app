<script lang="ts">
  let email = '';
  let password = '';
  let error = '';
  let success = '';
  let loading = false;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  async function handleLogin(e: Event) {
    e.preventDefault();
    error = '';
    success = '';
    loading = true;

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        error = data.error || data.message || 'Đăng nhập thất bại';
        return;
      }

      // Lưu token & user (chỉ lưu minimal)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || {}));

      success = 'Đăng nhập thành công! Chuyển hướng...';

      // redirect tới trang sản phẩm hoặc dashboard
      setTimeout(() => {
        window.location.href = '/products';
      }, 700);
    } catch (err) {
      console.error(err);
      error = 'Lỗi kết nối tới server';
    } finally {
      loading = false;
    }
  }

  // Nếu đã login thì tự động redirect tức thì (tùy bạn muốn)
  // onMount(() => {
  //   if (localStorage.getItem('token')) window.location.href = '/products';
  // });
</script>

<div class="min-h-screen flex items-center justify-center p-6">
  <form on:submit={handleLogin} class="w-[360px] bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Đăng nhập</h2>

    <label class="block mb-2">
      Email
      <input type="email" bind:value={email} required class="w-full border p-2 rounded mt-1" />
    </label>

    <label class="block mb-4">
      Mật khẩu
      <input type="password" bind:value={password} required class="w-full border p-2 rounded mt-1" />
    </label>

    <button class="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
      {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
    </button>

    {#if error}
      <p class="mt-3 text-red-600 text-sm">{error}</p>
    {/if}
    {#if success}
      <p class="mt-3 text-green-600 text-sm">{success}</p>
    {/if}

    <p class="mt-4 text-sm text-center">
      Chưa có tài khoản?
      <a href="/signup" class="text-blue-600 ml-1">Đăng ký</a>
    </p>
  </form>
</div>

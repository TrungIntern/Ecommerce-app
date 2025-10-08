<script lang="ts">
  let name = '';
  let email = '';
  let password = '';
  let error = '';
  let success = '';
  let loading = false;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  async function handleSignup(e: Event) {
    e.preventDefault();
    error = '';
    success = '';
    loading = true;

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      // parse body (server trả JSON)
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // hiển thị lỗi từ server nếu có
        error = data.error || data.message || 'Đăng ký thất bại';
        return;
      }

      success = 'Đăng ký thành công! Chuyển sang trang đăng nhập...';

      // chuyển hướng tới trang login sau 1s
      setTimeout(() => {
        window.location.href = '/login';
      }, 800);
    } catch (err) {
      console.error(err);
      error = 'Lỗi kết nối tới server';
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center p-6">
  <form on:submit={handleSignup} class="w-[360px] bg-white p-6 rounded shadow">
    <h2 class="text-xl font-bold mb-4">Đăng ký</h2>

    <label class="block mb-2">
      Họ tên
      <input bind:value={name} required class="w-full border p-2 rounded mt-1" />
    </label>

    <label class="block mb-2">
      Email
      <input type="email" bind:value={email} required class="w-full border p-2 rounded mt-1" />
    </label>

    <label class="block mb-4">
      Mật khẩu
      <input type="password" bind:value={password} required class="w-full border p-2 rounded mt-1" />
    </label>

    <button class="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
      {loading ? 'Đang xử lý...' : 'Đăng ký'}
    </button>

    {#if error}
      <p class="mt-3 text-red-600 text-sm">{error}</p>
    {/if}
    {#if success}
      <p class="mt-3 text-green-600 text-sm">{success}</p>
    {/if}

    <p class="mt-4 text-sm text-center">
      Đã có tài khoản?
      <a href="/login" class="text-blue-600 ml-1">Đăng nhập</a>
    </p>
  </form>
</div>

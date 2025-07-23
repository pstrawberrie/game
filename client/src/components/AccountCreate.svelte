<script lang="ts">
  import { config } from '../../../config';
  const API_URL = config.SERVER_API_URL;
  let username = '';
  let password = '';
  let message = '';
  let success: boolean | null = null;

  async function createAccount(e: Event) {
    e.preventDefault();

    message = '';
    success = null;
    const res = await fetch(`${API_URL}/api/account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    success = data.success;
    message =
      data.message || (data.success ? 'Account created!' : 'Unknown error');
    if (data.success) {
      username = '';
      password = '';
    }
  }
</script>

<form onsubmit={createAccount}>
  <label>
    Username:
    <input bind:value={username} required />
  </label>
  <label>
    Password:
    <input type="password" bind:value={password} required />
  </label>
  <button type="submit">Create Account</button>
</form>

{#if success !== null}
  <p style="color: {success ? 'green' : 'red'}">{message}</p>
{/if}

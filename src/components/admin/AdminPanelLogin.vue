<template>
        <ion-content class="ion-padding">
            <ion-text>
                <h1>Příhlášení do administrace</h1>
            </ion-text>
            <ion-list>
                <ion-item>
                    <ion-label position="stacked">Heslo</ion-label>
                    <ion-input
                        type="password"
                        v-model="password"
                        :disabled="loading"
                        required
                        @keyup.enter="handleLogin"
                    ></ion-input>
                </ion-item>
            </ion-list>
            <ion-text color="danger" v-if="error">
                <p class="ion-text-center">{{ error }}</p>
            </ion-text>
            <ion-button
                expand="block"
                @click="handleLogin"
                :disabled="loading"
                class="ion-margin-top"
            >
                {{ loading ? 'Přihlašuji se...' : 'Přihlásit se' }}
            </ion-button>
        </ion-content>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();
const password = ref('');
const loading = computed(() => store.getters['admin/isLoading']);
const error = computed(() => store.getters['admin/getError']);

const hashedPassword = computed(async () => {
    if (!password.value) return '';
    
    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password.value);
    
    // Hash the password using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
});

const handleLogin = async () => {
    if (!password.value) {
        store.commit('admin/setError', 'Password is required');
        return;
    }
    
    try {
        const success = await store.dispatch('admin/login', await hashedPassword.value);
        if (success) {
            router.push('/admin');
        }
    } catch (err) {
        console.error('Login error:', err);
    }
};
</script>
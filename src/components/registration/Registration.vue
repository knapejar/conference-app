<script setup lang="ts">
import BaseLayout from '../base/BaseLayout.vue';

</script>

<template>
    <BaseLayout pageTitle="Přihlášení">
        <ion-content>
            <ion-card>
                <ion-card-header>
                    <ion-card-title>Přihlašte se ke konferenci</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <ion-item>
                        <ion-label position="floating">Your email</ion-label>
                        <ion-input v-model="email" type="email"></ion-input>
                    </ion-item>
                    <ion-button expand="block" @click="sendEmail">Send verification code</ion-button>
                    <ion-item>
                        <ion-label position="floating">Verification code</ion-label>
                        <ion-input v-model="verificationCode" type="text"></ion-input>
                    </ion-item>
                    <ion-button expand="block" @click="register">Register</ion-button>
                </ion-card-content>
            </ion-card>
        </ion-content>
    </BaseLayout>
</template>
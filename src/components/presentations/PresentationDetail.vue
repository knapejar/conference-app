<template>
  <BaseLayout pageTitle="Detail prezentace">
    <ion-content v-if="presentation">
      <ion-card>
        <ion-card-header>
          <ion-card-title>
            {{ presentation.title }}
          </ion-card-title>
          <ion-card-subtitle>
            {{ new Date(presentation.start).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', hour12: false }) }} - {{ new Date(presentation.end).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit', hour12: false }) }}
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-text>
            {{ presentation.description }}
          </ion-text>

          <ion-list>
            <ion-item v-for="presenter in presentation.presenters" :key="presenter.id" @click="openPersonDetail(presenter)">
              <ion-avatar slot="start">
                <img :src="presenter.imageURL" :alt="presenter.name" />
              </ion-avatar>
              <ion-label>
                <h2>{{ presenter.name }}</h2>
                <p>{{ presenter.role }}</p>
              </ion-label>
            </ion-item>
          </ion-list>

          <ion-button 
            v-if="presentation.questionsRoom" 
            expand="block" 
            :router-link="'/questions/' + presentation.id"
            class="ion-margin-top"
          >
            <ion-icon name="chatbubbles-outline" slot="start"></ion-icon>
            Otázky
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </BaseLayout>
</template>

<script>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  name: 'PresentationDetail',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const presentation = computed(() => {
      return store.getters['presentations/getPresentationById'](parseInt(route.params.id));
    });

    const presentationTitle = computed(() => {
      return presentation.value ? presentation.value.title : '';
    });

    const openPersonDetail = (person) => {
      router.push(`/people/${person.id}`);
    };

    return {
      presentation,
      presentationTitle,
      openPersonDetail
    };
  }
}
</script>
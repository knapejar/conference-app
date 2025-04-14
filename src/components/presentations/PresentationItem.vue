<template>
    <ion-item>
        <ion-icon 
            :name="isStarred ? 'star' : 'star-outline'" 
            slot="start" 
            @click="toggleStar" 
            class="star-icon"
        />
        <ion-button v-if="presentation.questionsRoom" slot="end" :router-link="'/questions/' + presentation.id" size="large">
            <ion-icon name="chatbubbles-outline"></ion-icon>
        </ion-button>
        <ion-label>
            <h2>{{ presentation.title }}</h2>
            <p>Prezentující: {{ presentation.presenter }}</p>
            <p>Začátek: {{ new Date(presentation.start).toLocaleTimeString() }}</p>
            <p>Konec: {{ new Date(presentation.end).toLocaleTimeString() }}</p>
        </ion-label>
    </ion-item>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import QuestionsIconButton from '../questions/QuestionsIconButton.vue';

export default {
    components: {
        QuestionsIconButton
    },
    props: {
        presentation: {
            type: Object,
            required: true
        }
    },
    setup(props) {
        const store = useStore();
        
        const isStarred = computed(() => {
            return store.getters['presentations/isPresentationStarred'](props.presentation.id);
        });
        
        const toggleStar = () => {
            store.dispatch('presentations/toggleStar', props.presentation.id);
        };
        
        return {
            isStarred,
            toggleStar
        };
    }
}
</script>

<style scoped>
.star-icon {
    cursor: pointer;
    font-size: 1.2em;
}
</style>